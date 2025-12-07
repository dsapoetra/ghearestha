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

async function changePassword() {
  try {
    console.log('\n=== Change Admin User Password ===\n');

    const email = await question('User email: ');
    const newPassword = await question('New password: ');

    if (!email || !newPassword) {
      console.error('Email and new password are required!');
      process.exit(1);
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`\nError: User with email ${email} not found!`);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    console.log('\n✓ Password updated successfully for:', email);
    console.log('\nYou can now log in at: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('\nError changing password:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
    await pool.end();
  }
}

changePassword();
