# Secure Upload Directory

This directory contains user-uploaded files organized by user ID for security.

## Structure
```
uploads/
├── documents/
│   └── [userId]/
│       ├── [timestamp]_[uuid].pdf
│       └── [timestamp]_[uuid].jpg
├── reports/
│   └── [userId]/
│       └── medical_reports...
└── profiles/
    └── [userId]/
        └── profile_images...
```

## Security Features
- User-specific directories (isolated by user ID)
- Secure file permissions (700)
- File type validation
- Size limits enforced
- Virus scanning (placeholder for production)
- No direct web access (served through authenticated endpoints)

## File Access
Files are served through authenticated API endpoints only:
- `/api/user/documents/:id/download` - Download with authentication
- `/api/user/documents/:id/view` - View with authentication

## Backup & Cleanup
- Regular cleanup of temporary files
- Automated backups (implement in production)
- File retention policies (implement as needed)