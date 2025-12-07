require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createUser() {
  try {
    console.log('\n=== Create New Admin User ===\n');

    const email = await question('Email: ');
    const password = await question('Password: ');
    const name = await question('Name (optional): ');

    if (!email || !password) {
      console.error('Email and password are required!');
      process.exit(1);
    }

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

    console.log('\n✓ User created successfully!');
    console.log('Email:', user.email);
    console.log('Name:', user.name || '(not set)');
    console.log('\nYou can now log in at: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('\nError creating user:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
    await pool.end();
  }
}

createUser();
