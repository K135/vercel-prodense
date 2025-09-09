#!/usr/bin/env node

/**
 * MongoDB Atlas to Local Migration Script
 * This script exports data from MongoDB Atlas and imports it to local MongoDB
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

// Configuration
const ATLAS_URI = process.env.MONGODB_URI
const LOCAL_URI = 'mongodb://localhost:27017/prodance'
const BACKUP_DIR = path.join(__dirname, '../atlas-backup')
const DATABASE_NAME = 'prodance'

console.log('🚀 Starting MongoDB Atlas to Local Migration...')

// Validate Atlas URI
if (!ATLAS_URI || !ATLAS_URI.includes('mongodb+srv://')) {
  console.error('❌ MongoDB Atlas URI not found or invalid in .env file')
  process.exit(1)
}

// Create backup directory
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true })
  console.log('📁 Created backup directory:', BACKUP_DIR)
}

async function exportFromAtlas() {
  console.log('📤 Exporting data from MongoDB Atlas...')
  
  try {
    // Extract database name from Atlas URI - look for the last part after the last /
    const uriParts = ATLAS_URI.split('/')
    const atlasDbName = uriParts[uriParts.length - 1].split('?')[0] || DATABASE_NAME
    
    console.log(`📊 Database: ${atlasDbName}`)
    console.log('⏳ This may take a few minutes depending on data size...')
    
    // Use mongodump to export from Atlas
    const dumpCommand = `mongodump --uri="${ATLAS_URI}" --out="${BACKUP_DIR}"`
    
    execSync(dumpCommand, { 
      stdio: 'inherit',
      cwd: __dirname 
    })
    
    console.log('✅ Export from Atlas completed successfully!')
    return atlasDbName
    
  } catch (error) {
    console.error('❌ Export failed:', error.message)
    throw error
  }
}

async function importToLocal(sourceDbName) {
  console.log('📥 Importing data to local MongoDB...')
  
  try {
    const sourcePath = path.join(BACKUP_DIR, sourceDbName)
    
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Source database directory not found: ${sourcePath}`)
    }
    
    // Check what collections were exported
    const collections = fs.readdirSync(sourcePath).filter(file => file.endsWith('.bson'))
    console.log(`📋 Found ${collections.length} collections:`, collections.map(c => c.replace('.bson', '')).join(', '))
    
    // Use mongorestore to import to local
    const restoreCommand = `mongorestore --uri="${LOCAL_URI}" --drop "${sourcePath}"`
    
    execSync(restoreCommand, { 
      stdio: 'inherit',
      cwd: __dirname 
    })
    
    console.log('✅ Import to local MongoDB completed successfully!')
    
  } catch (error) {
    console.error('❌ Import failed:', error.message)
    throw error
  }
}

async function verifyMigration() {
  console.log('🔍 Verifying migration...')
  
  const mongoose = require('mongoose')
  
  try {
    // Connect to local MongoDB
    await mongoose.connect(LOCAL_URI)
    console.log('✅ Connected to local MongoDB')
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray()
    
    console.log('📊 Migration Summary:')
    console.log('====================')
    
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments()
      console.log(`${collection.name}: ${count} documents`)
    }
    
    await mongoose.connection.close()
    console.log('📦 Database connection closed')
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message)
    throw error
  }
}

async function cleanupBackup() {
  console.log('🧹 Cleaning up backup files...')
  
  try {
    // Remove backup directory
    fs.rmSync(BACKUP_DIR, { recursive: true, force: true })
    console.log('✅ Backup files cleaned up')
  } catch (error) {
    console.warn('⚠️ Could not clean up backup files:', error.message)
  }
}

async function main() {
  try {
    // Step 1: Export from Atlas
    const sourceDbName = await exportFromAtlas()
    
    // Step 2: Import to Local
    await importToLocal(sourceDbName)
    
    // Step 3: Verify Migration
    await verifyMigration()
    
    // Step 4: Cleanup (optional)
    const keepBackup = process.argv.includes('--keep-backup')
    if (!keepBackup) {
      await cleanupBackup()
    } else {
      console.log(`💾 Backup files kept at: ${BACKUP_DIR}`)
    }
    
    console.log('🎉 Migration completed successfully!')
    console.log('')
    console.log('📋 Next Steps:')
    console.log('1. Update your application to use local MongoDB')
    console.log('2. Test your application with the migrated data')
    console.log('3. Consider updating your .env file to use local connection')
    
  } catch (error) {
    console.error('💥 Migration failed:', error.message)
    process.exit(1)
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('MongoDB Atlas to Local Migration Script')
  console.log('')
  console.log('Usage: node migrateFromAtlas.js [options]')
  console.log('')
  console.log('Options:')
  console.log('  --keep-backup    Keep backup files after migration')
  console.log('  --help, -h       Show this help message')
  console.log('')
  console.log('Environment Variables:')
  console.log('  MONGODB_URI      MongoDB Atlas connection string (from .env)')
  process.exit(0)
}

// Run the migration
main()