import { PrismaClient, UserRole } from '@prisma/client'
import { hash } from 'bcryptjs'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const prisma = new PrismaClient()

async function main() {
    const password = await hash('password123', 12)

    const staff = await prisma.user.upsert({
        where: { email: 'frontend@forgerdigital.com' },
        update: {},
        create: {
            email: 'frontend@forgerdigital.com',
            name: 'Alex Rivera (Frontend Lead)',
            password,
            role: UserRole.STAFF, // Using the new STAFF role
        },
    })

    const admin = await prisma.user.upsert({
        where: { email: 'admin@forgerdigital.com' },
        update: {},
        create: {
            email: 'admin@forgerdigital.com',
            name: 'System Admin',
            password, // Same password: password123
            role: UserRole.ADMIN,
        },
    })

    console.log({ staff, admin })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
