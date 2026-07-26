# CYSCOM VIT Chennai - Recruitment & Cabinet Portal

This is the official CYSCOM Recruitment and Cabinet Admin Portal for the 2026 term, built with Next.js, Prisma, PostgreSQL, and Auth.js.

The platform is divided into two distinct experiences seamlessly integrated into one application:
1. **Student Portal (Recruitment)**: A futuristic, cyber-security themed portal for applicants.
2. **Cabinet Portal (Admin)**: A powerful, internal dashboard for CYSCOM board and cabinet members to manage applications and interviews.

## 🚀 Tech Stack
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database**: PostgreSQL (via Neon/Supabase/etc.)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/) with Google OAuth
- **Styling**: Tailwind CSS + Framer Motion (Animations)
- **UI Components**: Radix UI / Shadcn UI

---

## 💻 Getting Started (Local Development)

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed on your machine.
You will also need a PostgreSQL database.

### 2. Environment Variables
Create a `.env` file in the root directory and add the following keys:

```env
# Database Connection String
DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-key-here"

# Google OAuth Credentials (for Login)
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```
*(Contact the technical lead for the specific development keys if you don't have them).*

### 3. Installation
Install the dependencies:
```bash
npm install
```

### 4. Database Setup
Push the Prisma schema to your database to create the necessary tables:
```bash
npx prisma db push
```

### 5. Run the Server
Start the development server:
```bash
npm run dev
```

---

## 🎓 How to access the Student Portal

The Student Portal is the public-facing side of the application.
1. Make sure the development server is running.
2. Open your browser and go to `http://localhost:3000/`.
3. You will see the **CYSCOM Landing Page**. 
4. Click **Apply Now** to go through the multi-step registration process and begin the timer-based assessment.

---

## 🛡️ How to access the Admin Panel (Cabinet Portal)

The Admin Panel requires you to be logged in with a Google account that has been granted `ADMIN` or `SUPER_ADMIN` privileges.

### Accessing the Panel
1. Navigate to `http://localhost:3000/admin`.
2. If you are not logged in, you will be redirected to the login page. Sign in with Google.
3. If your account does not have admin rights, you will see an "Unauthorized" message.

### Giving yourself Admin Rights (for local testing)
By default, new users who sign in are assigned the `APPLICANT` role. To test the admin panel locally:
1. Open Prisma Studio by running:
   ```bash
   npx prisma studio
   ```
2. A new browser tab will open at `http://localhost:5555`.
3. Click on the **User** model.
4. Find your email address, and change the `role` column from `APPLICANT` to `SUPER_ADMIN`.
5. Save the changes in Prisma Studio.
6. Go back to `http://localhost:3000/admin` and refresh the page. You now have full access to the CYSCOM Cabinet Portal!

### Role-Based Access Control (RBAC)
- **SUPER_ADMIN (Board Members)**: Full access. Can manage settings, change other members' roles, and edit interview slots.
- **ADMIN (Cabinet Members)**: Can view applicants, shortlist candidates, conduct assessments, and view interview slots. Cannot edit system settings.

---

## 📁 Project Structure

- `/src/app/page.tsx`: Student Landing Page
- `/src/app/register`: Student Multi-step Application Wizard
- `/src/app/assessment`: Timer-based online test with Integrity Tracking
- `/src/app/dashboard`: Student Application Status Tracker
- `/src/app/admin`: CYSCOM Cabinet Portal (Admin Dashboard)
- `/src/app/api`: API routes (including Auth)
- `/src/lib/prisma.ts`: Database client configuration
- `/prisma/schema.prisma`: Database Schema definition
