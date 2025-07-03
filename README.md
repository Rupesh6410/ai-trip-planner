# 🗺️ AI Trip Planner

AI-powered travel planner that generates a personalized itinerary based on user preferences like destination, group type, budget, and duration.

## 🔧 Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS** + **ShadCN UI**
- **Framer Motion** – animations
- **Prisma ORM** – PostgreSQL (via Neon)
- **Auth.js** – Google OAuth
- **Vercel** – deployment
- **Gemini API (via @google/generative-ai)** – AI itinerary generation

---

## ✨ Features

- 🔐 Authenticated user experience with Google login
- 🧠 AI-generated itineraries with:
  - Daily activity schedule
  - Hotel and hostel recommendations
  - Pro travel tips
- 🧳 Save & view trip plans
- 🚦 Status feedback during generation (animated loading states)
- 📅 Trip history page (planned)
- 🗑️ Delete trips securely

---

## 🖥️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/ai-trip-planner.git
cd ai-trip-planner

2. Install dependencies
npm install


3. Set up environment variables
Create a .env file based on .env.example:

cp .env.example .env
Fill in:


DATABASE_URL=your_neon_postgres_url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=some-random-secret
⚠️ In Vercel environment variables, don’t include quotes.

4. Prisma setup

npx prisma generate
npx prisma db push
🧪 Dev Commands
bash
Copy
Edit
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Lint check
🚀 Deploying on Vercel
Push to GitHub

Import into Vercel

Add these Vercel environment variables:


DATABASE_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET
Add npx prisma generate as a Vercel Build Command override:

Build Command:npx prisma generate && next build


📄 Google OAuth Configuration
Go to: https://console.cloud.google.com/apis/credentials

Ensure you:

Add http://localhost:3000 and https://your-vercel-domain.vercel.app to Authorized Redirect URIs

Use /api/auth/callback/google as the redirect path

📂 Folder Structure

src/
  app/
    api/
      generate-trip/
      trips/
    trips/
    components/
    lib/
      prisma.ts
  prisma/
    schema.prisma


🧠 Coming Soon
🌐 Image generation for destinations using Gemini + Cloudinary

📊 Analytics Dashboard

⏰ Scheduled Trips

🧵 Trip templates

👨‍💻 Author
Built by Rupesh Kumar. Powered by Gemini & Next.js.