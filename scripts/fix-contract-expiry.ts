import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local', override: true })

const prisma = new PrismaClient()

async function fixContractExpiry() {
  try {
    // Find contracts without shareTokenExpiry
    const contracts = await prisma.contract.findMany({
      where: { 
        shareTokenExpiry: null,
        shareToken: { not: null }
      }
    })

    console.log(`Found ${contracts.length} contracts without expiry date`)

    for (const contract of contracts) {
      // Set expiry to 90 days from now
      const expiry = new Date()
      expiry.setDate(expiry.getDate() + 90)

      await prisma.contract.update({
        where: { id: contract.id },
        data: { shareTokenExpiry: expiry }
      })

      console.log(`✅ Updated contract ${contract.contractNumber}: expires ${expiry.toLocaleDateString()}`)
    }

    console.log('\n✅ All contracts updated!')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixContractExpiry()
