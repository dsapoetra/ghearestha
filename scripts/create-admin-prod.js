require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function createAdmin() {
  try {
    const email = process.argv[2];
    const password = process.argv[3];
    const name = process.argv[4];

    if (!email || !password) {
      console.error('Usage: node scripts/create-admin-prod.js <email> <password> [name]');
      process.exit(1);
    }

    console.log('\n=== Creating Admin User in Production Database ===\n');

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error(`\nError: User with email ${email} already exists!`);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    });

    console.log('\n✓ Admin user created successfully in production database!');
    console.log('Email:', user.email);
    console.log('Name:', user.name || '(not set)');
    console.log('\nYou can now log in at your production site: /admin/login');

  } catch (error) {
    console.error('\nError creating user:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

createAdmin();
