import { defineConfig } from 'vite'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Плагин для копирования статических файлов в dist
// Копирует favicon и другие статические файлы (robots.txt, sitemap.xml)
// Использует closeBundle для гарантированного выполнения после полной записи всех файлов
function copyStaticFilesPlugin() {
  return {
    name: 'copy-static-files',
    closeBundle() {
      // Выполняется ПОСЛЕ полного завершения записи всех бандлов и закрытия bundle
      // Это гарантирует, что папка dist уже создана и все файлы записаны
      try {
        const distDir = resolve(__dirname, 'dist')
        
        // Проверяем, что dist существует
        if (!statSync(distDir).isDirectory()) {
          console.error('❌ Папка dist не найдена!')
          process.exit(1)
        }
        
        console.log('📁 Папка dist существует, начинаем копирование статических файлов...')
        
        // Копируем favicon из public/favicon в dist/favicon
        const faviconSourceDir = resolve(__dirname, 'public/favicon')
        const faviconTargetDir = resolve(__dirname, 'dist/favicon')
        
        try {
          if (statSync(faviconSourceDir).isDirectory()) {
            mkdirSync(faviconTargetDir, { recursive: true })
            const files = readdirSync(faviconSourceDir)
            files.forEach(file => {
              const sourcePath = resolve(faviconSourceDir, file)
              const targetPath = resolve(faviconTargetDir, file)
              const stat = statSync(sourcePath)
              
              if (stat.isFile()) {
                copyFileSync(sourcePath, targetPath)
              }
            })
            console.log('✅ Favicon скопирован в dist/favicon/')
          }
        } catch (error) {
          console.warn('⚠️  Не удалось скопировать favicon:', error.message)
          // Не прерываем сборку - favicon не критичен
        }
        
        // Копируем robots.txt и sitemap.xml в корень dist
        const rootFiles = ['robots.txt', 'sitemap.xml']
        rootFiles.forEach(file => {
          const sourcePath = resolve(__dirname, file)
          try {
            if (statSync(sourcePath).isFile()) {
              const targetPath = resolve(__dirname, 'dist', file)
              copyFileSync(sourcePath, targetPath)
              console.log(`✅ ${file} скопирован в dist/`)
            }
          } catch (error) {
            // Файл не существует - это нормально, пропускаем
          }
        })
        
        // Финальная проверка - убеждаемся, что dist содержит файлы
        const distFiles = readdirSync(distDir)
        if (distFiles.length === 0) {
          console.error('❌ Папка dist пуста после сборки!')
          process.exit(1)
        }
        
        console.log(`✅ Сборка завершена успешно. В dist найдено ${distFiles.length} элементов.`)
      } catch (error) {
        console.error('❌ Критическая ошибка при копировании статических файлов:', error.message)
        console.error('❌ Стек ошибки:', error.stack)
        process.exit(1)
      }
    }
  }
}

// Конфигурация Vite для сборки многостраничного проекта
// Настраивает сборку всех HTML страниц и копирование статических файлов
export default defineConfig({
  // Папка с исходными файлами
  root: '.',
  
  // Базовый путь для статических ресурсов (корень сайта)
  base: '/',
  
  // Плагины
  plugins: [
    copyStaticFilesPlugin()
  ],
  
  // Папка для сборки
  build: {
    outDir: 'dist',
    // Копировать содержимое public в корень dist (кроме favicon, так как он копируется плагином)
    copyPublicDir: false, // Отключаем автоматическое копирование, чтобы контролировать процесс
    // Минифицировать код
    minify: true,
    // Настройки сборки для многостраничного приложения
    rollupOptions: {
      // Входные точки - все HTML файлы в корне проекта
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        menu: resolve(__dirname, 'menu.html'),
        contact: resolve(__dirname, 'contact.html'),
        reservation: resolve(__dirname, 'reservation.html'),
        'private-dining': resolve(__dirname, 'private-dining.html'),
        wine: resolve(__dirname, 'wine.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html')
      }
    }
  },
  
  // Настройка сервера разработки
  server: {
    port: 3000,
    open: true
  }
})
