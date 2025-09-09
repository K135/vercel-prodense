const path = require('path')
const fs = require('fs')

// Define secure upload directory structure
const UPLOADS_BASE_DIR = path.join(__dirname, '../secure_uploads')

const uploadConfig = {
  baseDir: UPLOADS_BASE_DIR,
  directories: {
    documents: path.join(UPLOADS_BASE_DIR, 'documents'),
    reports: path.join(UPLOADS_BASE_DIR, 'reports'), 
    profiles: path.join(UPLOADS_BASE_DIR, 'profiles'),
    temp: path.join(UPLOADS_BASE_DIR, 'temp')
  },
  permissions: {
    directory: 0o700, // Owner read/write/execute only
    file: 0o600       // Owner read/write only
  }
}

// Initialize secure upload directories
const initializeUploadDirectories = () => {
  try {
    // Create base directory if it doesn't exist
    if (!fs.existsSync(uploadConfig.baseDir)) {
      fs.mkdirSync(uploadConfig.baseDir, { 
        recursive: true, 
        mode: uploadConfig.permissions.directory 
      })
      console.log(`✅ Created secure uploads directory: ${uploadConfig.baseDir}`)
    }

    // Create subdirectories
    Object.entries(uploadConfig.directories).forEach(([type, dir]) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { 
          recursive: true, 
          mode: uploadConfig.permissions.directory 
        })
        console.log(`✅ Created ${type} directory: ${dir}`)
      }
    })

    // Set proper permissions on existing directories
    fs.chmodSync(uploadConfig.baseDir, uploadConfig.permissions.directory)
    Object.values(uploadConfig.directories).forEach(dir => {
      if (fs.existsSync(dir)) {
        fs.chmodSync(dir, uploadConfig.permissions.directory)
      }
    })

    console.log('✅ Upload directories initialized with secure permissions')
    return true

  } catch (error) {
    console.error('❌ Failed to initialize upload directories:', error)
    return false
  }
}

// Create user-specific directory
const createUserDirectory = (userId, uploadType = 'documents') => {
  try {
    const baseDir = uploadConfig.directories[uploadType]
    if (!baseDir) {
      throw new Error(`Invalid upload type: ${uploadType}`)
    }

    const userDir = path.join(baseDir, userId.toString())
    
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { 
        recursive: true, 
        mode: uploadConfig.permissions.directory 
      })
      console.log(`✅ Created user directory: ${userDir}`)
    }

    return userDir
  } catch (error) {
    console.error('❌ Failed to create user directory:', error)
    throw error
  }
}

// Validate file path security
const validateFilePath = (filePath) => {
  try {
    const resolvedPath = path.resolve(filePath)
    const resolvedBaseDir = path.resolve(uploadConfig.baseDir)
    
    // Ensure file is within uploads directory
    if (!resolvedPath.startsWith(resolvedBaseDir)) {
      throw new Error('File path outside secure uploads directory')
    }

    return true
  } catch (error) {
    console.error('❌ File path validation failed:', error)
    return false
  }
}

// Set secure file permissions
const setSecureFilePermissions = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.chmodSync(filePath, uploadConfig.permissions.file)
      return true
    }
    return false
  } catch (error) {
    console.error('❌ Failed to set file permissions:', error)
    return false
  }
}

// Clean up temporary files older than specified time
const cleanupTempFiles = (maxAgeHours = 24) => {
  try {
    const tempDir = uploadConfig.directories.temp
    if (!fs.existsSync(tempDir)) return

    const files = fs.readdirSync(tempDir)
    const maxAge = maxAgeHours * 60 * 60 * 1000 // Convert to milliseconds
    const now = Date.now()
    let cleanedCount = 0

    files.forEach(file => {
      const filePath = path.join(tempDir, file)
      const stats = fs.statSync(filePath)
      
      if (now - stats.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath)
        cleanedCount++
      }
    })

    if (cleanedCount > 0) {
      console.log(`✅ Cleaned up ${cleanedCount} temporary files`)
    }

    return cleanedCount
  } catch (error) {
    console.error('❌ Failed to cleanup temporary files:', error)
    return 0
  }
}

// Get directory info for monitoring
const getDirectoryInfo = () => {
  try {
    const info = {}
    
    Object.entries(uploadConfig.directories).forEach(([type, dir]) => {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir, { withFileTypes: true })
        info[type] = {
          path: dir,
          totalItems: files.length,
          directories: files.filter(f => f.isDirectory()).length,
          files: files.filter(f => f.isFile()).length
        }
      } else {
        info[type] = {
          path: dir,
          exists: false
        }
      }
    })

    return info
  } catch (error) {
    console.error('❌ Failed to get directory info:', error)
    return {}
  }
}

module.exports = {
  uploadConfig,
  initializeUploadDirectories,
  createUserDirectory,
  validateFilePath,
  setSecureFilePermissions,
  cleanupTempFiles,
  getDirectoryInfo
}