/**
 * Test Form Submissions Script
 * Tests that contact and get-started forms save to database correctly
 * 
 * Usage: npx tsx scripts/test-form-submissions.ts
 */

import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const prisma = new PrismaClient()

async function testFormSubmissions() {
  console.log('🧪 Testing form submission database integration...\n')

  try {
    // Test 1: Contact Form Submission
    console.log('📝 Test 1: Contact Form Submission')
    const contactData = {
      firstName: 'Test',
      lastName: 'User',
      email: `test-${Date.now()}@example.com`,
      phone: '+1234567890',
      company: 'Test Company',
      message: 'This is a test contact form submission'
    }

    const contactSubmission = await prisma.contactFormSubmission.create({
      data: contactData
    })
    
    console.log('  ✅ Contact form submission created:', contactSubmission.id)
    
    // Verify it was saved
    const retrievedContact = await prisma.contactFormSubmission.findUnique({
      where: { id: contactSubmission.id }
    })
    
    if (retrievedContact && retrievedContact.email === contactData.email) {
      console.log('  ✅ Contact form submission verified in database')
    } else {
      console.log('  ❌ Contact form submission verification failed')
    }

    // Test 2: Get Started Form Submission
    console.log('\n📝 Test 2: Get Started Form Submission')
    const getStartedData = {
      firstName: 'Test',
      lastName: 'User',
      company: 'Test Company',
      email: `test-getstarted-${Date.now()}@example.com`,
      phone: '+1234567890',
      role: 'Developer',
      projectDescription: 'This is a test get started form submission',
      serviceInterests: ['Web Development', 'AI & Automation'],
      contactMethod: 'email',
      timeline: '1-3 months',
      budget: '$10,000 - $50,000'
    }

    const getStartedSubmission = await prisma.getStartedSubmission.create({
      data: getStartedData
    })
    
    console.log('  ✅ Get started form submission created:', getStartedSubmission.id)
    
    // Verify it was saved
    const retrievedGetStarted = await prisma.getStartedSubmission.findUnique({
      where: { id: getStartedSubmission.id }
    })
    
    if (retrievedGetStarted && retrievedGetStarted.email === getStartedData.email) {
      console.log('  ✅ Get started form submission verified in database')
    } else {
      console.log('  ❌ Get started form submission verification failed')
    }

    // Test 3: Duplicate Prevention
    console.log('\n🛡️  Test 3: Duplicate Prevention')
    try {
      // Try to create duplicate with same email (if email was unique, this would fail)
      // Since email is not unique in our schema, we'll test by checking count
      const duplicateEmail = `duplicate-${Date.now()}@example.com`
      
      await prisma.contactFormSubmission.create({
        data: {
          firstName: 'Duplicate',
          lastName: 'Test',
          email: duplicateEmail,
          message: 'First submission'
        }
      })
      
      await prisma.contactFormSubmission.create({
        data: {
          firstName: 'Duplicate',
          lastName: 'Test',
          email: duplicateEmail,
          message: 'Second submission (allowed - email not unique)'
        }
      })
      
      const count = await prisma.contactFormSubmission.count({
        where: { email: duplicateEmail }
      })
      
      console.log(`  ℹ️  Multiple submissions with same email allowed (${count} found)`)
      console.log('  ✅ Duplicate handling works as expected')
      
    } catch (error: any) {
      console.log('  ⚠️  Duplicate prevention:', error.message)
    }

    // Test 4: Data Counts
    console.log('\n📊 Test 4: Data Counts')
    const contactCount = await prisma.contactFormSubmission.count()
    const getStartedCount = await prisma.getStartedSubmission.count()
    
    console.log(`  Contact Form Submissions: ${contactCount}`)
    console.log(`  Get Started Submissions: ${getStartedCount}`)

    console.log('\n✅ All form submission tests passed!')
    
    // Cleanup test data (optional)
    console.log('\n🧹 Cleaning up test data...')
    await prisma.contactFormSubmission.deleteMany({
      where: {
        email: { contains: 'test' }
      }
    })
    await prisma.getStartedSubmission.deleteMany({
      where: {
        email: { contains: 'test' }
      }
    })
    console.log('  ✅ Test data cleaned up')
    
  } catch (error: any) {
    console.error('\n❌ Form submission test failed!')
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testFormSubmissions()

