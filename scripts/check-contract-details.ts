import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local', override: true })

const prisma = new PrismaClient()

async function checkContracts() {
  try {
    const contracts = await prisma.contract.findMany({
      select: {
        id: true,
        contractNumber: true,
        title: true,
        status: true,
        shareToken: true,
        shareTokenExpiry: true,
        signedAt: true,
        signedByClient: true,
      }
    })

    console.log(`\n📜 Found ${contracts.length} contracts:\n`)

    for (const contract of contracts) {
      console.log(`Contract: ${contract.contractNumber}`)
      console.log(`  Title: ${contract.title}`)
      console.log(`  Status: ${contract.status}`)
      console.log(`  Share Token: ${contract.shareToken ? contract.shareToken.substring(0, 20) + '...' : 'NOT SET'}`)
      console.log(`  Token Expiry: ${contract.shareTokenExpiry ? contract.shareTokenExpiry.toISOString() : 'NOT SET'}`)
      console.log(`  Is Expired: ${contract.shareTokenExpiry ? (new Date() > contract.shareTokenExpiry ? 'YES' : 'NO') : 'N/A'}`)
      console.log(`  Signed At: ${contract.signedAt || 'NOT SIGNED'}`)
      console.log(`  Signed By: ${contract.signedByClient || 'NOT SIGNED'}`)
      console.log('')
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkContracts()
