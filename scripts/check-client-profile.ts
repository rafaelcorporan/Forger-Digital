import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
// Load .env.local with override to ensure it takes precedence
dotenv.config({ path: '.env.local', override: true })

console.log('DB URL:', process.env.DATABASE_URL?.substring(0, 60) + '...')

const prisma = new PrismaClient()

async function checkClientProfile() {
  try {
    // Find the client user
    const client = await prisma.user.findFirst({
      where: { 
        email: { contains: 'eguitierez', mode: 'insensitive' }
      },
      include: {
        clientProfile: true
      }
    })

    if (!client) {
      console.log('❌ Client user not found')
      return
    }

    console.log('\n📋 Client User:')
    console.log(`  ID: ${client.id}`)
    console.log(`  Name: ${client.name}`)
    console.log(`  Email: ${client.email}`)
    console.log(`  Role: ${client.role}`)
    console.log(`  Has ClientProfile: ${client.clientProfile ? 'YES' : 'NO'}`)

    if (client.clientProfile) {
      console.log(`  ClientProfile ID: ${client.clientProfile.id}`)
      console.log(`  Company: ${client.clientProfile.company || 'N/A'}`)

      // Check for projects
      const projects = await prisma.project.findMany({
        where: { clientProfileId: client.clientProfile.id },
        include: { contracts: true }
      })

      console.log(`\n📁 Projects: ${projects.length}`)
      projects.forEach(p => {
        console.log(`  - ${p.name} (${p.status})`)
        console.log(`    Contracts: ${p.contracts.length}`)
        p.contracts.forEach(c => {
          console.log(`      • ${c.title} [${c.status}]`)
        })
      })
    } else {
      console.log('\n⚠️ No ClientProfile found! Creating one...')
      
      const newProfile = await prisma.clientProfile.create({
        data: {
          userId: client.id,
          company: null,
          phone: null,
        }
      })
      
      console.log(`✅ Created ClientProfile: ${newProfile.id}`)
    }

    // Also check all contracts
    const allContracts = await prisma.contract.findMany({
      include: {
        project: {
          include: { clientProfile: true }
        },
        clientProfile: true
      }
    })

    console.log(`\n📜 All Contracts: ${allContracts.length}`)
    allContracts.forEach(c => {
      console.log(`  - ${c.title} [${c.status}]`)
      console.log(`    Project Client: ${c.project?.clientProfile?.id || 'NOT SET'}`)
      console.log(`    Direct Client: ${c.clientProfile?.id || 'NOT SET'}`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkClientProfile()
