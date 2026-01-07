import { mkdir, cp, access } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { constants } from 'fs'

// Получаем текущую директорию (ES modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Пути к исходной и целевой директориям
const sourceDir = join(__dirname, '../public/favicon')
const targetDir = join(__dirname, '../dist/favicon')
const distDir = join(__dirname, '../dist')

/**
 * Копирует папку favicon из public в dist
 * Кроссплатформенное решение для работы на любой ОС
 * Не прерывает сборку при ошибке - favicon не критичен
 */
async function copyFavicon() {
  try {
    // Проверяем, существует ли папка dist (должна быть создана vite build)
    try {
      await access(distDir, constants.F_OK)
      console.log('📁 Папка dist найдена, начинаем копирование favicon...')
    } catch (error) {
      console.warn('⚠️  Папка dist не найдена. Возможно, vite build ещё не завершился.')
      console.warn('⚠️  Пропускаем копирование favicon. Сборка продолжится.')
      return
    }

    // Проверяем, существует ли исходная папка favicon
    try {
      await access(sourceDir, constants.F_OK)
    } catch (error) {
      console.warn('⚠️  Папка public/favicon не найдена. Пропускаем копирование.')
      return
    }

    // Создаем целевую директорию, если её нет
    await mkdir(targetDir, { recursive: true })
    
    // Копируем всю папку favicon
    await cp(sourceDir, targetDir, { recursive: true })
    
    console.log('✅ Favicon скопирован успешно из public/favicon в dist/favicon')
  } catch (error) {
    // Не прерываем сборку при ошибке - это не критично
    console.warn('⚠️  Не удалось скопировать favicon:', error.message)
    console.warn('⚠️  Сборка продолжается без favicon.')
    // НЕ вызываем process.exit(1) - позволяем сборке завершиться успешно
  }
}

// Запускаем копирование
copyFavicon()
