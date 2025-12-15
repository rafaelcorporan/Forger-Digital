import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local', override: true })

const prisma = new PrismaClient()

async function updatePassword() {
  const email = 'admin@forgerdigital.com'
  const newPassword = process.env.ADMIN_PASSWORD || 'Aa1234567$$$'
  
  console.log('\n🔑 Updating Admin Password...\n')
  console.log(`📧 Email: ${email}`)
  
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })
    
    console.log(`✅ Password updated successfully for: ${user.name}`)
    console.log(`📝 New password hash created`)
    
    // Verify the password works
    const verifyUser = await prisma.user.findUnique({
      where: { email },
      select: { password: true }
    })
    
    if (verifyUser?.password) {
      const isValid = await bcrypt.compare(newPassword, verifyUser.password)
      console.log(`✅ Password verification: ${isValid ? 'PASSED' : 'FAILED'}`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updatePassword()
