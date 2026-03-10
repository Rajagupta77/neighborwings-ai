# NeighborWings AI

Tampa Bay's Local Life Companion – Powered by Gemini AI

[![Live Demo](https://neighborwings-ai.vercel.app)
[![Tech Stack](https://github.com/Rajagupta77/neighborwings-ai)

### What is NeighborWings AI?

A hyper-local discovery tool for Tampa Bay residents to find events, activities, and vendors through natural conversation — no hallucinations, grounded suggestions, one-tap contact, and easy vendor onboarding.

Built as a 0→1 AI side project to explore conversational agents, prompt engineering, and full-funnel lead fulfillment in a marketplace-like experience.

### Live Demo

👉 https://neighborwings-ai.vercel.app

Try it:
- Chat: "decor under $800" or "events this weekend in Tampa"
- Click Surprise Me for random local suggestions
- Plan My Weekend for guided planning
- Join as Vendor to test the sign-up flow (mock payment)

### Key Features

- Real-time conversational AI powered by Google Gemini
- Intent qualification (budget, location, date, theme)
- Grounded recommendations using curated mock data (no hallucinations)
- Vendor cards with WhatsApp & Instagram deep links
- Surprise Me button + guided weekend planner
- Vendor sign-up form with mock Stripe payment & Supabase save
- Responsive, mobile-friendly UI

### Tech Stack

- Frontend: React + Vite + Tailwind CSS
- AI: Google Gemini (agentic chat workflows, prompt engineering)
- Backend/Database: Supabase (vendors table + Edge Functions)
- Payments: Stripe (test mode)
- Deployment: Vercel
- Development: Built iteratively in Google AI Studio Build mode

### Project Status

Prototype / MVP stage:
- Uses curated mock data for events & vendors (responses limited to small dataset)
- Payment flow is test-mode only (no real charges)
- No user auth or persistent sessions yet
- Actively iterating — open to feedback & contributions!

### How to Run Locally

1. Clone the repo
   ```bash
   git clone https://github.com/Rajagupta77/neighborwings-ai.git
   cd neighborwings-ai

2. Install dependencies
  npm install

3. Add environment variables (create .env.local)
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

4. Start dev server
   npm run dev
Open http://localhost:5173

Screenshots
(Add 3–5 screenshots here later – e.g., chat example, vendor card, sign-up modal)
<img src="screenshots/chat.png" alt="Chat example">
<img src="screenshots/vendor-card.png" alt="Vendor card with buttons">
<img src="screenshots/vendor-signup.png" alt="Sign-up modal">

What's Next?

. Switch to real event/vendor APIs (Meetup, Google Places, etc.)
. Add user auth & saved plans
. Implement real payments for premium vendor listings
. Expand to other Florida cities

Feedback, suggestions, or contributions welcome! Feel free to open an issue or PR.
Built with ❤️ in Tampa Bay

Raja Goalla
March 2026
