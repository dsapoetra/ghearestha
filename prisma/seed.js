require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the Prisma adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.blogPost.deleteMany();
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
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GheaSaputra&backgroundColor=b6e3f4',
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

  // Create Blog Posts
  const blogPosts = await Promise.all([
    prisma.blogPost.create({
      data: {
        title: 'Building Scalable Microservices with Node.js and Docker',
        slug: 'building-scalable-microservices-nodejs-docker',
        excerpt: 'Learn how to architect and deploy microservices using Node.js, Docker, and Kubernetes for production-ready applications.',
        content: `# Building Scalable Microservices with Node.js and Docker

Microservices architecture has become the de facto standard for building modern, scalable applications. In this post, I'll share my experience and best practices for building microservices with Node.js and Docker.

## Why Microservices?

Microservices offer several advantages:
- Independent deployment
- Technology flexibility
- Better fault isolation
- Easier scaling

## Getting Started

First, let's set up our development environment...

\`\`\`javascript
// Example service
const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});
\`\`\`

## Dockerizing Your Service

Create a Dockerfile for your service...

Stay tuned for part 2 where we'll cover orchestration with Kubernetes!`,
        coverImage: '/images/blog/microservices.jpg',
        published: true,
        publishedAt: new Date('2024-11-15'),
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'React Performance Optimization: Tips and Tricks',
        slug: 'react-performance-optimization-tips-tricks',
        excerpt: 'Discover practical techniques to optimize your React applications and deliver lightning-fast user experiences.',
        content: `# React Performance Optimization: Tips and Tricks

Performance is crucial for user experience. Here are my top tips for optimizing React applications.

## 1. Use React.memo Wisely

Memoization can prevent unnecessary re-renders...

## 2. Code Splitting

Split your bundles to reduce initial load time...

## 3. Virtualization for Large Lists

When rendering large lists, use virtualization libraries...

These techniques have helped me reduce load times by up to 60% in production applications.`,
        coverImage: '/images/blog/react-performance.jpg',
        published: true,
        publishedAt: new Date('2024-10-28'),
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'My Journey from Junior to Tech Lead',
        slug: 'journey-junior-to-tech-lead',
        excerpt: 'Reflections on my career progression and lessons learned along the way to becoming a technical leader.',
        content: `# My Journey from Junior to Tech Lead

Eight years ago, I started my career as a junior developer. Today, I lead a talented team of engineers. Here's what I learned along the way.

## The Early Days

Starting out was overwhelming...

## Growth Through Challenges

Every bug taught me something new...

## Leadership Lessons

Technical skills are important, but communication and empathy are crucial...

The journey continues, and I'm excited about what's next!`,
        coverImage: '/images/blog/career-journey.jpg',
        published: true,
        publishedAt: new Date('2024-09-10'),
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'Understanding TypeScript Generics',
        slug: 'understanding-typescript-generics',
        excerpt: 'A deep dive into TypeScript generics with practical examples and real-world use cases.',
        content: `# Understanding TypeScript Generics

Generics are one of the most powerful features in TypeScript. Let me break them down for you.

## What are Generics?

Generics allow you to write reusable, type-safe code...

## Basic Example

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\`

## Real-World Applications

Here's how I use generics in production code...

Master generics and level up your TypeScript game!`,
        published: false,
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'PostgreSQL vs MongoDB: Choosing the Right Database',
        slug: 'postgresql-vs-mongodb-choosing-right-database',
        excerpt: 'An in-depth comparison of PostgreSQL and MongoDB to help you make informed database decisions.',
        content: `# PostgreSQL vs MongoDB: Choosing the Right Database

Choosing the right database is crucial for your application's success. Let's compare two popular options.

## PostgreSQL Strengths

- ACID compliance
- Complex queries
- Data integrity

## MongoDB Strengths

- Flexible schema
- Horizontal scaling
- JSON-like documents

## When to Use What

My rule of thumb...

Both are excellent choices - pick based on your specific needs!`,
        published: false,
      },
    }),
  ]);

  console.log('Created blog posts:', blogPosts.length);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
