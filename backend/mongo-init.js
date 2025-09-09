// MongoDB initialization script for Docker
// This script creates a user for the application database

db = db.getSiblingDB('prodance');

// Create application user
db.createUser({
  user: 'prodance_user',
  pwd: 'prodance_pass_2024',
  roles: [
    {
      role: 'readWrite',
      db: 'prodance'
    }
  ]
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "phone": 1 }, { unique: true });
db.dentists.createIndex({ "email": 1 }, { unique: true });
db.dentists.createIndex({ "location.coordinates": "2dsphere" });
db.bookings.createIndex({ "patientId": 1 });
db.bookings.createIndex({ "dentistId": 1 });
db.bookings.createIndex({ "appointmentDate": 1 });

print('Database initialization completed successfully!');