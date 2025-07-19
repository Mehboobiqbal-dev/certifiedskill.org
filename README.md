# CertifiedSkill.org

A modern, industry-level certification platform built with Next.js, React, and Tailwind CSS.

## Features

- **User Profile & Account Management**: View and edit your profile, see all your certificates, and manage account settings.
- **Certificate Sharing**: Share certificates on LinkedIn, download as PDF, and access public, verifiable certificate pages.
- **Admin Panel**: Manage users, exams, and certificates with CRUD operations (admin only).
- **Dark Mode**: Toggle between light and dark themes for accessibility and user preference.
- **Notifications**: In-app notifications for exam results, new exams, and certificate issuance.
- **Analytics**: Users can view their exam history and progress; admins see platform analytics.
- **Gamification**: Earn badges for achievements and view the leaderboard of top users.
- **Modern UI/UX**: Fully responsive, accessible, and styled with Tailwind CSS. Skeleton loaders for all loading states.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

- `/pages` — Main app pages (Home, Profile, Dashboard, Admin, Certificate, Leaderboard, etc.)
- `/components` — Reusable UI components
- `/api` — API routes for users, exams, certificates, etc.
- `/public` — Static assets (logo, certificate images, etc.)

## Customization
- Update branding, colors, and images in `/public` and Tailwind config.
- Add or modify exams, certificates, and user roles via the admin panel.

## License
MIT
