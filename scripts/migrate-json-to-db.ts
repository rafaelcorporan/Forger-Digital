/**
 * Migration Script: JSON Files to Database
 * 
 * This script migrates existing JSON form submissions to the database.
 * Run with: npx tsx scripts/migrate-json-to-db.ts
 */

import { prisma } from '../lib/prisma'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

interface ContactSubmission {
  timestamp: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  message: string
}

interface GetStartedSubmission {
  timestamp: string
  firstName: string
  lastName: string
  company: string
  email: string
  phone?: string
  role?: string
  projectDescription: string
  serviceInterests: string[]
  contactMethod: string
  timeline?: string
  budget?: string
}

async function migrateContactSubmissions() {
  const submissionsDir = join(process.cwd(), 'contact-submissions')
  
  try {
    const files = await readdir(submissionsDir)
    const jsonFiles = files.filter(f => f.endsWith('.json') && f.startsWith('submission-'))
    
    console.log(`Found ${jsonFiles.length} contact submission files`)
    
    for (const file of jsonFiles) {
      try {
        const filePath = join(submissionsDir, file)
        const content = await readFile(filePath, 'utf-8')
        const data: ContactSubmission = JSON.parse(content)
        
        // Check if already exists
        const existing = await prisma.contactFormSubmission.findFirst({
          where: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            createdAt: new Date(data.timestamp),
          },
        })
        
        if (existing) {
          console.log(`⏭️  Skipping ${file} - already exists`)
          continue
        }
        
        await prisma.contactFormSubmission.create({
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || null,
            company: data.company || null,
            message: data.message,
            createdAt: new Date(data.timestamp),
          },
        })
        
        console.log(`✅ Migrated ${file}`)
      } catch (error: any) {
        console.error(`❌ Error migrating ${file}:`, error.message)
      }
    }
  } catch (error: any) {
    console.error('Error reading submissions directory:', error.message)
  }
}

async function migrateGetStartedSubmissions() {
  const submissionsDir = join(process.cwd(), 'contact-submissions')
  
  try {
    const files = await readdir(submissionsDir)
    const jsonFiles = files.filter(f => f.endsWith('.json') && f.startsWith('project-inquiry-'))
    
    console.log(`Found ${jsonFiles.length} get started submission files`)
    
    for (const file of jsonFiles) {
      try {
        const filePath = join(submissionsDir, file)
        const content = await readFile(filePath, 'utf-8')
        const data: GetStartedSubmission = JSON.parse(content)
        
        // Check if already exists
        const existing = await prisma.getStartedSubmission.findFirst({
          where: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            createdAt: new Date(data.timestamp),
          },
        })
        
        if (existing) {
          console.log(`⏭️  Skipping ${file} - already exists`)
          continue
        }
        
        await prisma.getStartedSubmission.create({
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            company: data.company,
            email: data.email,
            phone: data.phone || null,
            role: data.role || null,
            projectDescription: data.projectDescription,
            serviceInterests: data.serviceInterests || [],
            contactMethod: data.contactMethod,
            timeline: data.timeline || null,
            budget: data.budget || null,
            createdAt: new Date(data.timestamp),
          },
        })
        
        console.log(`✅ Migrated ${file}`)
      } catch (error: any) {
        console.error(`❌ Error migrating ${file}:`, error.message)
      }
    }
  } catch (error: any) {
    console.error('Error reading submissions directory:', error.message)
  }
}

async function main() {
  console.log('🚀 Starting JSON to Database Migration...\n')
  
  try {
    await migrateContactSubmissions()
    console.log('')
    await migrateGetStartedSubmissions()
    console.log('\n✅ Migration completed!')
  } catch (error: any) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

