#!/usr/bin/env node

/**
 * Database Management Script
 * Provides utilities for managing local MongoDB database
 */

const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prodance'

// Import all models
const User = require('../models/User')
const Dentist = require('../models/Dentist')
const Booking = require('../models/Booking')
const HealthProfile = require('../models/HealthProfile')
const Document = require('../models/Document')
const Notification = require('../models/Notification')
const Review = require('../models/Review')

const models = {
  User,
  Dentist,
  Booking,
  HealthProfile,
  Document,
  Notification,
  Review
}

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB:', MONGODB_URI)
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    process.exit(1)
  }
}

async function disconnectDB() {
  await mongoose.connection.close()
  console.log('📦 Database connection closed')
}

async function showStats() {
  console.log('📊 Database Statistics:')
  console.log('========================')
  
  for (const [modelName, Model] of Object.entries(models)) {
    try {
      const count = await Model.countDocuments()
      console.log(`${modelName}: ${count} documents`)
    } catch (error) {
      console.log(`${modelName}: Error counting documents`)
    }
  }
}

async function clearDatabase() {
  console.log('🧹 Clearing all data from database...')
  
  for (const [modelName, Model] of Object.entries(models)) {
    try {
      const result = await Model.deleteMany({})
      console.log(`✅ Cleared ${result.deletedCount} documents from ${modelName}`)
    } catch (error) {
      console.log(`❌ Error clearing ${modelName}:`, error.message)
    }
  }
}

async function exportData() {
  console.log('📤 Exporting database data...')
  
  const exportData = {}
  
  for (const [modelName, Model] of Object.entries(models)) {
    try {
      const data = await Model.find({}).lean()
      exportData[modelName] = data
      console.log(`✅ Exported ${data.length} documents from ${modelName}`)
    } catch (error) {
      console.log(`❌ Error exporting ${modelName}:`, error.message)
    }
  }
  
  const exportPath = path.join(__dirname, '../exports')
  if (!fs.existsSync(exportPath)) {
    fs.mkdirSync(exportPath, { recursive: true })
  }
  
  const filename = `database_export_${new Date().toISOString().split('T')[0]}.json`
  const filepath = path.join(exportPath, filename)
  
  fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2))
  console.log(`💾 Data exported to: ${filepath}`)
}

async function importData(filepath) {
  console.log(`📥 Importing data from: ${filepath}`)
  
  if (!fs.existsSync(filepath)) {
    console.error('❌ File not found:', filepath)
    return
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'))
    
    for (const [modelName, documents] of Object.entries(data)) {
      if (models[modelName] && documents.length > 0) {
        try {
          await models[modelName].insertMany(documents)
          console.log(`✅ Imported ${documents.length} documents to ${modelName}`)
        } catch (error) {
          console.log(`❌ Error importing ${modelName}:`, error.message)
        }
      }
    }
  } catch (error) {
    console.error('❌ Error reading import file:', error.message)
  }
}

async function createBackup() {
  console.log('💾 Creating database backup...')
  
  const backupPath = path.join(__dirname, '../backups')
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true })
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `backup_${timestamp}.json`
  const filepath = path.join(backupPath, filename)
  
  const backupData = {}
  
  for (const [modelName, Model] of Object.entries(models)) {
    try {
      const data = await Model.find({}).lean()
      backupData[modelName] = data
      console.log(`✅ Backed up ${data.length} documents from ${modelName}`)
    } catch (error) {
      console.log(`❌ Error backing up ${modelName}:`, error.message)
    }
  }
  
  fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2))
  console.log(`💾 Backup created: ${filepath}`)
}

// Command line interface
async function main() {
  const command = process.argv[2]
  
  if (!command) {
    console.log('📋 Available commands:')
    console.log('  stats     - Show database statistics')
    console.log('  clear     - Clear all data from database')
    console.log('  export    - Export all data to JSON file')
    console.log('  import    - Import data from JSON file (provide file path)')
    console.log('  backup    - Create a backup of the database')
    console.log('')
    console.log('Usage: node dbManager.js <command> [options]')
    return
  }
  
  await connectDB()
  
  try {
    switch (command) {
      case 'stats':
        await showStats()
        break
      case 'clear':
        await clearDatabase()
        break
      case 'export':
        await exportData()
        break
      case 'import':
        const importPath = process.argv[3]
        if (!importPath) {
          console.error('❌ Please provide the path to the import file')
          break
        }
        await importData(importPath)
        break
      case 'backup':
        await createBackup()
        break
      default:
        console.error('❌ Unknown command:', command)
    }
  } catch (error) {
    console.error('❌ Command failed:', error)
  } finally {
    await disconnectDB()
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = {
  connectDB,
  disconnectDB,
  showStats,
  clearDatabase,
  exportData,
  importData,
  createBackup
}