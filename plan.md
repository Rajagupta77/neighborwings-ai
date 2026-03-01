
# NeighborWings AI — Detailed Build Plan

> **Goal**: Build a fast, intuitive web app that helps Tampa Bay users discover local events, activities, and vendors — with zero hallucinations, one-tap contact options, and community-driven growth.

---

## 📋 Project Overview

| Item | Detail |
|------|--------|
| **App Name** | NeighborWings AI |
| **Type** | Single-page web application (SPA) with tabs and chat |
| **Stack** | React + Vite + Tailwind CSS + Gemini API + Supabase (DB) |
| **Hosting** | Vercel (static deploy with env vars) |
| **Auth** | None (MVP — guest mode) |
| **Timeline** | 1–2 weeks (iterative sprints in AI Studio Build mode) |

---

## 🗂️ File Structure

```
neighborwings-ai/
├── src/
│   ├── components/
│   │   ├── VendorModal.tsx          ← Vendor sign-up form
│   │   ├── ChatMessage.tsx          ← Chat bubbles and vendor cards
│   │   ├── EventCard.tsx            ← Event display cards
│   │   ├── VendorCard.tsx           ← Vendor display cards with buttons
│   │   ├── Header.tsx               ← App header with buttons (Surprise Me, Plan My Weekend, Join as Vendor)
│   │   ├── Footer.tsx               ← Disclaimer and back links
│   │   └── ... (other UI components)
│   ├── lib/
│   │   ├── supabaseclient.js        ← Supabase client init
│   │   └── geminiService.ts         ← Gemini API calls
│   ├── pages/
│   │   ├── Landing.tsx              ← Landing page with hero, problem, solution, how it works, CTA
│   │   ├── Chat.tsx                 ← Main chat interface
│   │   └── DiscoverEvents.tsx       ← Events tab with filters and cards
│   ├── App.tsx                      ← Main app router (landing vs chat)
│   ├── index.css                    ← Tailwind imports and custom styles
│   └── main.tsx                     ← React entry point
├── public/
│   └── index.html                   ← Root HTML (no Tailwind CDN)
├── vite.config.ts                   ← Vite config with aliases
├── .env.local                       ← Local env vars (Gemini, Supabase keys)
├── package.json                     ← Dependencies (react, @supabase/supabase-js, etc.)
├── README.md                        ← Deployment instructions
└── SECURITY.md                      ← Security playbook
```

---

## 🎨 Phase 1 — Design System & Layout (2–3 hours)

### Color Palette (Light Theme First)
```css
--bg-primary:    #F8FAFC   /* light gray-blue */
--bg-card:       #FFFFFF   /* white cards */
--bg-input:      #F1F5F9   /* input areas */
--accent:        #6366F1   /* indigo-500 */
--accent-glow:   #6366F140 /* accent opacity */
--success:       #22C55E   /* green */
--warning:       #F59E0B   /* amber */
--danger:        #EF4444   /* red */
--text-primary:  #0F172A
--text-muted:    #64748B
--border:        #E2E8F0
```

### Typography
- **Font**: `Inter` from Google Fonts (body, headings)
- **Heading**: 600 weight, slight tracking
- **Body**: 400 weight
- **Code/Monospace**: `Monaco` for any code snippets (optional)

### Layout Sections
1. **Header** — Logo + buttons (Surprise Me, Plan My Weekend, Join as Vendor)
2. **Tabs** — Chat / Discover Events
3. **Chat Section** — Message bubbles + input
4. **Footer** — Prototype disclaimer + back to landing link

---

## 🏗️ Phase 2 — Chat & Input (2 hours)

### Input Component
- Chat box with placeholder: "Ask about events, vendors, or plans in Tampa Bay..."
- Multi-line expand
- Send button or Enter submit

### Chat Logic
- Multi-turn history (user right, AI left)
- Loading spinner during Gemini calls
- Error handling: "Oops, try rephrasing!"

---

## 📊 Phase 3 — Vendor & Event Matching (3 hours)

### Vendor Pool
- Hardcoded mock vendors (4–5 with name, service, price_range, location, distance, rating, instagram, whatsapp)

### Event Pool
- Hardcoded Tampa Bay events (7–10 with name, date, location, price, description)

### Matching Logic
- Gemini prompt: Refine query → suggest 2–4 matches in bullets/cards with [Source]

---

## 🔗 Phase 4 — Contact Options (1 hour)

### WhatsApp & Instagram Buttons
- In vendor cards: "Message on WhatsApp" (deep link wa.me/[phone]?text=[pre-filled])
- "View on Instagram" (instagram.com/[username])

### Vendor Sign-up
- Modal form with fields (businessName, serviceType, priceRange, location, rating, email, description, instagram, whatsapp)
- Submit saves to Supabase `vendors` table

---

## 🎉 Phase 5 — Advanced Features (2 hours)

### Surprise Me
- Button → random event/vendor card with "Why it's great" + buttons

### Plan My Weekend
- Button → 3-step questions (budget, group, interests) → personalized plan with events + vendor bundles

### Discover Events Tab
- Filterable list of events with cards + "Pair with Vendor" button

### Bundling
- Auto-suggest vendor with event (e.g., "Pair with catering")

---

## 🌟 Phase 6 — UI Polish & Animations (1 hour)

- Cards: shadow, hover, rounded
- Animations: fade-in messages, button ripple
- Responsive: stack on mobile
- Generic errors + loading states

---

## 🚀 Phase 7 — Deploy (30 min)

1. GitHub repo: `neighborwings-ai`
2. Push code
3. Vercel: import repo, add env vars (VITE_GEMINI_API_KEY, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
4. Auto-deploy
5. Custom domain (optional): `neighborwings.ai`

---

## ✅ MVP Definition of Done

- [ ] User can chat queries (events/vendors) with responses
- [ ] Discover Events tab with filters/cards
- [ ] Surprise Me button with random suggestion
- [ ] Plan My Weekend with questions + plan
- [ ] Vendor sign-up form saves to Supabase
- [ ] WhatsApp/Instagram buttons in vendor cards
- [ ] Landing page with hero + CTA
- [ ] Deployed on Vercel with public URL
- [ ] Loads under 2 seconds, mobile-friendly

---

## 🔮 Post-MVP Ideas (v2)

- User auth (Supabase) for saved plans
- Real-time event data (integrate Meetup API or X search)
- Vendor dashboard to edit listings
- Payments for premium listings (Stripe)
- AI-powered event recommendations based on user history
- Mobile app version (React Native)
- Expand to other cities (e.g., Miami, Orlando)
