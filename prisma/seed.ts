import 'dotenv/config';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.certification.deleteMany();
  await prisma.jobHistory.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'admin@ghea.com',
      password: hashedPassword,
      name: 'Ghea Admin',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'ghea@example.com',
      password: hashedPassword,
      name: 'Ghea Saputra',
    },
  });

  console.log('Created users:', { user1: user1.email, user2: user2.email });

  // Create Profile
  const profile = await prisma.profile.create({
    data: {
      name: 'Ghea Saputra',
      title: 'Senior Software Engineer & Tech Lead',
      summary: 'Passionate software engineer with 8+ years of experience in building scalable web applications and leading development teams.',
      bio: `I'm a full-stack developer specializing in modern web technologies. Throughout my career, I've led multiple successful projects from conception to deployment, focusing on clean code, best practices, and mentoring junior developers.

My expertise spans across React, Node.js, TypeScript, and cloud infrastructure. I'm passionate about creating user-centric applications that solve real-world problems.`,
      email: 'ghea@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'https://linkedin.com/in/gheasaputra',
      profileImage: '/images/profile.jpg',
    },
  });

  console.log('Created profile:', profile.name);

  // Create Job History
  const jobs = await Promise.all([
    prisma.jobHistory.create({
      data: {
        company: 'TechCorp Solutions',
        position: 'Senior Software Engineer & Tech Lead',
        startDate: new Date('2021-03-01'),
        current: true,
        description: `• Led a team of 6 developers in building a microservices-based e-commerce platform
• Architected and implemented CI/CD pipelines reducing deployment time by 60%
• Mentored junior developers and conducted code reviews
• Improved application performance by 40% through optimization techniques
• Technologies: React, Node.js, PostgreSQL, Docker, Kubernetes`,
        order: 1,
      },
    }),
    prisma.jobHistory.create({
      data: {
        company: 'Digital Innovation Labs',
        position: 'Full Stack Developer',
        startDate: new Date('2018-06-01'),
        endDate: new Date('2021-02-28'),
        current: false,
        description: `• Developed and maintained multiple client-facing web applications
• Implemented RESTful APIs and GraphQL endpoints
• Collaborated with UX designers to create responsive interfaces
• Reduced bug reports by 50% through comprehensive testing
• Technologies: React, Express.js, MongoDB, AWS`,
        order: 2,
      },
    }),
    prisma.jobHistory.create({
      data: {
        company: 'StartupXYZ',
        position: 'Junior Software Developer',
        startDate: new Date('2016-01-15'),
        endDate: new Date('2018-05-31'),
        current: false,
        description: `• Built features for company's SaaS product from scratch
• Participated in agile development processes
• Fixed bugs and improved code quality
• Learned modern development practices and tools
• Technologies: JavaScript, Node.js, MySQL, Git`,
        order: 3,
      },
    }),
  ]);

  console.log('Created job history entries:', jobs.length);

  // Create Certifications
  const certifications = await Promise.all([
    prisma.certification.create({
      data: {
        name: 'AWS Certified Solutions Architect - Professional',
        issuer: 'Amazon Web Services',
        issueDate: new Date('2023-05-15'),
        expiryDate: new Date('2026-05-15'),
        credentialId: 'AWS-PSA-12345',
        credentialUrl: 'https://aws.amazon.com/verification',
        description: 'Advanced certification demonstrating expertise in designing distributed systems on AWS',
        order: 1,
      },
    }),
    prisma.certification.create({
      data: {
        name: 'Certified Kubernetes Administrator (CKA)',
        issuer: 'Cloud Native Computing Foundation',
        issueDate: new Date('2022-11-20'),
        expiryDate: new Date('2025-11-20'),
        credentialId: 'CKA-2022-456789',
        credentialUrl: 'https://www.cncf.io/certification/cka/',
        description: 'Validates skills in Kubernetes administration, including installation, configuration, and management',
        order: 2,
      },
    }),
    prisma.certification.create({
      data: {
        name: 'Professional Scrum Master I (PSM I)',
        issuer: 'Scrum.org',
        issueDate: new Date('2021-08-10'),
        credentialId: 'PSM-2021-789012',
        credentialUrl: 'https://www.scrum.org/certificates',
        description: 'Demonstrates fundamental knowledge of Scrum framework and ability to apply it in real-world situations',
        order: 3,
      },
    }),
    prisma.certification.create({
      data: {
        name: 'MongoDB Certified Developer',
        issuer: 'MongoDB University',
        issueDate: new Date('2020-03-25'),
        expiryDate: new Date('2025-03-25'),
        credentialId: 'MONGO-DEV-345678',
        credentialUrl: 'https://university.mongodb.com/certification',
        description: 'Validates ability to develop applications using MongoDB',
        order: 4,
      },
    }),
  ]);

  console.log('Created certifications:', certifications.length);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
