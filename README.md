# HR Professional Landing Page

A modern, full-featured landing page and blog platform for HR professionals, built with Next.js 16, Prisma, and NextAuth.

## Features

- **Professional Landing Page**: Showcase your profile, experience, certifications, and recent blog posts
- **Blog Platform**: Write and publish articles with a rich WYSIWYG editor (TipTap)
- **Admin Dashboard**: Secure backend for managing all content
- **Contact Form**: Built-in contact form with email notifications
- **Responsive Design**: Mobile-friendly layout using Tailwind CSS
- **Authentication**: Secure admin access with NextAuth.js
- **Database**: PostgreSQL with Prisma ORM

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud service like Vercel Postgres, Supabase, Railway, or Neon)
- npm or yarn

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up your environment variables:

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for development)
- `NEXTAUTH_SECRET`: A random secret for NextAuth (generate with: `openssl rand -base64 32`)
- Email configuration (for contact form):
  - `EMAIL_SERVER_USER`
  - `EMAIL_SERVER_PASSWORD`
  - `EMAIL_SERVER_HOST`
  - `EMAIL_SERVER_PORT`
  - `EMAIL_FROM`
  - `EMAIL_TO`

3. Run database migrations:

```bash
npx prisma migrate dev
```

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Seed the database with sample data:

```bash
curl -X POST http://localhost:3000/api/seed
```

This will create:
- Admin user: `admin@example.com` / `admin123`
- Sample profile data
- Sample job history
- Sample certifications
- Sample blog post

6. Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` to see the landing page and `http://localhost:3000/admin/login` to access the admin dashboard.

## Deployment to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your repository to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. Configure your environment variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add all the environment variables from your `.env` file
   - Important: Update `NEXTAUTH_URL` to your production URL

4. Set up PostgreSQL database:
   - Option 1: Use Vercel Postgres (recommended)
     - Go to Storage tab → Create Database → Postgres
     - Connection string will be automatically added to your environment variables
   - Option 2: Use external provider (Supabase, Railway, Neon, etc.)
     - Create a database and add the `DATABASE_URL` to environment variables

5. Deploy:
   - Vercel will automatically deploy your application
   - Run migrations in production:
     - Go to Deployments → Select deployment → Open terminal
     - Run: `npx prisma migrate deploy`
   - Seed the database by visiting: `https://your-domain.vercel.app/api/seed`

## Admin Dashboard

Access the admin dashboard at `/admin/login` with your credentials.

From the dashboard you can:
- Edit your profile information
- Manage job history
- Add/edit certifications
- Create and publish blog posts
- Use the WYSIWYG editor for rich content

## Project Structure

```
├── app/
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes
│   ├── blog/               # Blog pages
│   ├── page.tsx            # Landing page
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
├── lib/                    # Utilities (Prisma, Auth)
├── prisma/                 # Database schema and migrations
└── public/                 # Static assets
```

## Technologies

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **Rich Text Editor**: TipTap
- **Email**: Nodemailer
- **Deployment**: Vercel

## Security Notes

- Change the default admin credentials after first login
- Use strong passwords and secure secrets in production
- Keep your `.env` file secure and never commit it to version control
- Regularly update dependencies for security patches

## Customization

- Update colors in `tailwind.config.js`
- Modify the landing page layout in `app/page.tsx`
- Customize email templates in `app/api/contact/route.ts`
- Add more fields to the database schema in `prisma/schema.prisma`

## Support

For issues or questions, please open an issue in the repository.

## License

MIT
