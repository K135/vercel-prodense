const mongoose = require('mongoose')
require('dotenv').config()

const Billing = require('../models/Billing')
const Booking = require('../models/Booking')
const User = require('../models/User')
const Dentist = require('../models/Dentist')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prodance')
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

const addDummyBilling = async () => {
  try {
    console.log('🔍 Looking for existing bookings for user 68b5bfe60c8ff435ee99f0ec...')
    
    const userId = '68b5bfe60c8ff435ee99f0ec'
    const bookings = await Booking.find({ userId }).populate('dentistId')
    
    console.log(`📋 Found ${bookings.length} bookings`)
    
    if (bookings.length === 0) {
      console.log('❌ No bookings found for the user')
      return
    }

    // Get user details for billing address
    const user = await User.findById(userId)
    if (!user) {
      console.log('❌ User not found')
      return
    }

    for (const booking of bookings) {
      // Check if billing already exists for this booking
      const existingBill = await Billing.findOne({ bookingId: booking._id })
      if (existingBill) {
        console.log(`⚠️  Billing already exists for booking ${booking.bookingNumber}`)
        continue
      }

      // Calculate line items based on treatment type
      const lineItems = []
      let subtotal = 0

      // Base consultation fee
      lineItems.push({
        description: 'Consultation Fee',
        quantity: 1,
        unitPrice: 50,
        totalPrice: 50,
        category: 'consultation'
      })
      subtotal += 50

      // Treatment-specific charges
      switch (booking.treatmentType) {
        case 'whitening':
          lineItems.push({
            description: 'Teeth Whitening Treatment',
            quantity: 1,
            unitPrice: 250,
            totalPrice: 250,
            category: 'treatment'
          })
          subtotal += 250
          break
        
        case 'orthodontics':
          lineItems.push({
            description: 'Orthodontic Consultation & Assessment',
            quantity: 1,
            unitPrice: 100,
            totalPrice: 100,
            category: 'treatment'
          })
          subtotal += 100
          break
        
        case 'cleaning':
          lineItems.push({
            description: 'Professional Dental Cleaning',
            quantity: 1,
            unitPrice: 80,
            totalPrice: 80,
            category: 'treatment'
          })
          subtotal += 80
          break
        
        default:
          lineItems.push({
            description: `${booking.treatmentType.charAt(0).toUpperCase() + booking.treatmentType.slice(1)} Treatment`,
            quantity: 1,
            unitPrice: 120,
            totalPrice: 120,
            category: 'treatment'
          })
          subtotal += 120
      }

      // Calculate tax (18% GST)
      const taxRate = 18
      const taxAmount = (subtotal * taxRate) / 100

      // Create billing record
      const billingData = {
        userId: booking.userId,
        bookingId: booking._id,
        invoiceDate: booking.createdAt,
        dueDate: new Date(booking.appointmentDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days after appointment
        status: booking.status === 'completed' ? 'paid' : 'sent',
        subtotal,
        taxAmount,
        discountAmount: 0,
        totalAmount: subtotal + taxAmount,
        currency: 'USD',
        lineItems,
        taxDetails: [{
          taxName: 'GST',
          taxRate,
          taxAmount,
          taxType: 'GST'
        }],
        paymentStatus: booking.paymentStatus || (booking.status === 'completed' ? 'paid' : 'pending'),
        paymentMethod: booking.paymentMethod || 'card',
        paymentDate: booking.status === 'completed' ? booking.appointmentDate : null,
        paymentReference: booking.status === 'completed' ? `TXN${Date.now()}${Math.floor(Math.random() * 1000)}` : null,
        billingAddress: {
          name: `${user.firstName} ${user.lastName}`,
          street: user.address?.street || '123 Main Street',
          city: user.address?.city || 'Mumbai',
          state: user.address?.state || 'Maharashtra',
          country: user.address?.country || 'India',
          pincode: user.address?.pincode || '400001',
          phone: user.phone,
          email: user.email
        },
        provider: {
          name: booking.dentistId ? `Dr. ${booking.dentistId.firstName} ${booking.dentistId.lastName}` : 'Dr. Sarah Johnson',
          clinicName: booking.clinic.name,
          address: {
            street: booking.clinic.address.street,
            city: booking.clinic.address.city,
            state: booking.clinic.address.state,
            country: booking.clinic.address.country,
            pincode: booking.clinic.address.pincode
          },
          contact: {
            phone: booking.clinic.contact.phone,
            email: booking.clinic.contact.email || 'clinic@example.com'
          },
          taxId: 'GST123456789',
          licenseNumber: 'DL12345'
        },
        notes: [{
          author: booking.userId,
          message: `Bill generated for ${booking.treatmentType} treatment`,
          createdAt: booking.createdAt,
          isInternal: false
        }],
        metadata: {
          source: 'booking',
          isRecurring: false
        }
      }

      // Add payment history if paid
      if (booking.status === 'completed') {
        billingData.paymentHistory = [{
          amount: billingData.totalAmount,
          method: billingData.paymentMethod,
          reference: billingData.paymentReference,
          date: booking.appointmentDate,
          status: 'success'
        }]
      }

      const bill = new Billing(billingData)
      await bill.save()

      console.log(`✅ Created billing record ${bill.invoiceNumber} for booking ${booking.bookingNumber}`)
      console.log(`   - Treatment: ${booking.treatmentType}`)
      console.log(`   - Amount: $${bill.totalAmount}`)
      console.log(`   - Status: ${bill.status}`)
      console.log(`   - Payment Status: ${bill.paymentStatus}`)
    }

    console.log('\n🎉 Dummy billing data added successfully!')
    
    // Show summary
    const totalBills = await Billing.countDocuments({ userId })
    const totalAmount = await Billing.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
    
    console.log(`\n📊 Summary:`)
    console.log(`   - Total Bills: ${totalBills}`)
    console.log(`   - Total Amount: $${totalAmount[0]?.total || 0}`)

  } catch (error) {
    console.error('❌ Error adding dummy billing data:', error)
  }
}

const main = async () => {
  await connectDB()
  await addDummyBilling()
  await mongoose.disconnect()
  console.log('✅ Disconnected from MongoDB')
}

main().catch(console.error)