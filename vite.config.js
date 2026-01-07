import { defineConfig } from 'vite'
import { resolve } from 'path'

// Конфигурация Vite для сборки многостраничного проекта
// Настраивает сборку всех HTML страниц и копирование статических файлов из папки public в dist
export default defineConfig({
  // Папка с исходными файлами
  root: '.',
  
  // Базовый путь для статических ресурсов (корень сайта)
  base: '/',
  
  // Папка для сборки
  build: {
    outDir: 'dist',
    // Копировать содержимое public в корень dist
    copyPublicDir: true,
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
