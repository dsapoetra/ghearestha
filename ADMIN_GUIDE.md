# Admin CMS Guide

## Quick Start

### 1. Start the Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### 2. Access Admin Panel

**Login URL:** http://localhost:3000/admin/login

**Default Credentials:**
- **Email:** `admin@ghea.com`
- **Password:** `password123`

Alternative account:
- **Email:** `ghea@example.com`
- **Password:** `password123`

### 3. Admin Dashboard

After logging in, you can manage:
- **Profile** (`/admin/profile`) - Edit your profile information
- **Job History** (`/admin/job-history`) - Manage work experience
- **Certifications** (`/admin/certifications`) - Manage certifications
- **Blog Posts** (`/admin/blog`) - Create and edit blog posts

## User Management

### Create a New Admin User

```bash
npm run user:create
```

This will prompt you for:
- Email
- Password
- Name (optional)

### Change User Password

```bash
npm run user:change-password
```

This will prompt you for:
- User email
- New password

### View Database in Prisma Studio

```bash
npm run db:studio
```

Opens a visual database browser at http://localhost:5555

## Database Commands

### Reset Database with Seed Data

```bash
npm run db:seed
```

This will:
- Clear all existing data
- Create 2 admin users
- Add sample profile data
- Add 3 job history entries
- Add 4 certifications
- Add 5 blog posts (3 published, 2 drafts)

### Run Migrations

```bash
npm run db:migrate
```

### Generate Prisma Client

```bash
npm run db:generate
```

## Production Deployment

### Important: Change These Before Deploying

1. **Update `.env` file:**
   - Change `NEXTAUTH_SECRET` to a strong random string
   - Update `NEXTAUTH_URL` to your production domain
   - Update database credentials
   - Add email server configuration

2. **Change admin passwords:**
   ```bash
   npm run user:change-password
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Start production server:**
   ```bash
   npm start
   ```

## Security Notes

- Default password is `password123` - **CHANGE THIS IMMEDIATELY**
- Never commit `.env` file to version control
- Use strong, unique passwords for admin accounts
- Enable HTTPS in production
- Update `NEXTAUTH_SECRET` to a secure random string

## Troubleshooting

### Can't log in?
- Verify database is running and seeded
- Check credentials are correct
- Clear browser cookies and try again

### Database connection error?
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env` file
- Test connection: `psql ghea_homepage -U dsapoetra`

### Need to reset everything?
```bash
npm run db:seed
```

This will reset all data to defaults.
