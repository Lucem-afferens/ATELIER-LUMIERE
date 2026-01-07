import { existsSync, readdirSync, statSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Проверяет, что папка dist существует и не пуста после сборки
 * Завершает процесс с ошибкой, если проверка не пройдена
 */
function verifyBuild() {
  const distDir = resolve(__dirname, '../dist')
  
  // Проверяем существование dist
  if (!existsSync(distDir)) {
    console.error('❌ ОШИБКА: Папка dist не существует после сборки!')
    console.error('❌ Это означает, что сборка не завершилась успешно.')
    process.exit(1)
  }
  
  // Проверяем, что это директория
  const stat = statSync(distDir)
  if (!stat.isDirectory()) {
    console.error('❌ ОШИБКА: dist существует, но это не папка!')
    process.exit(1)
  }
  
  // Проверяем, что dist не пуста
  const files = readdirSync(distDir)
  if (files.length === 0) {
    console.error('❌ ОШИБКА: Папка dist пуста после сборки!')
    console.error('❌ Это означает, что файлы не были собраны.')
    process.exit(1)
  }
  
  // Успешная проверка
  console.log(`✅ Проверка пройдена: папка dist существует и содержит ${files.length} элементов`)
  console.log(`✅ Список файлов/папок в dist: ${files.slice(0, 10).join(', ')}${files.length > 10 ? '...' : ''}`)
}

// Запускаем проверку
verifyBuild()
