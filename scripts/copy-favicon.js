import { mkdir, cp } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Получаем текущую директорию (ES modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Пути к исходной и целевой директориям
const sourceDir = join(__dirname, '../public/favicon')
const targetDir = join(__dirname, '../dist/favicon')

/**
 * Копирует папку favicon из public в dist
 * Кроссплатформенное решение для работы на любой ОС
 */
async function copyFavicon() {
  try {
    // Создаем целевую директорию, если её нет
    await mkdir(targetDir, { recursive: true })
    
    // Копируем всю папку favicon
    await cp(sourceDir, targetDir, { recursive: true })
    
    console.log('✅ Favicon скопирован успешно из public/favicon в dist/favicon')
  } catch (error) {
    console.error('❌ Ошибка при копировании favicon:', error.message)
    process.exit(1)
  }
}

// Запускаем копирование
copyFavicon()
