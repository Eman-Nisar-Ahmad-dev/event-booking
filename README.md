# EventNest — Setup Guide

## 1. Create the Vite project (in VS Code terminal)

```bash
npm create vite@latest eventnest -- --template react
cd eventnest
npm install
npm install firebase react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then copy all the files from this folder into your new `eventnest` project,
overwriting `src/App.jsx`, `src/index.css`, and `tailwind.config.js`, and
adding the new files (`firebase.js`, `context/`, `components/`, `pages/`).

## 2. Set up Firebase

1. Go to https://console.firebase.google.com → **Add project**
2. Once created, click the **</> (Web) icon** to register a web app — this gives you the config values for `.env`
3. In the left sidebar: **Build → Authentication → Get started → Email/Password → Enable**
4. In the left sidebar: **Build → Firestore Database → Create database** (start in test mode for development)
5. Copy `.env.example` to `.env` and paste in your Firebase config values

## 3. Add sample events to Firestore

In Firestore console, create a collection called `events`. Add a document like:

```
title: "React Meetup Islamabad"
description: "Monthly meetup for React developers to share projects and ideas."
date: "2026-08-20"
time: "6:00 PM"
location: "Islamabad"
image: "https://placehold.co/600x300?text=React+Meetup"
totalSeats: 50
seatsBooked: 0
price: 0
```

Add 2–3 more so your landing page has something to show.

## 4. Run it

```bash
npm run dev
```

Visit the local URL shown in the terminal (usually http://localhost:5173).

## 5. Deploy (optional but recommended)

```bash
npm install -g vercel
vercel
```

Follow the prompts — remember to add your `.env` variables in the Vercel
dashboard under Project Settings → Environment Variables, since `.env` is
not pushed to git.

## What's included

| Requirement | Where |
|---|---|
| Landing page | `src/pages/Home.jsx` — pulls events live from Firestore |
| Credentials (login/email) | `src/pages/Login.jsx`, `Signup.jsx`, `src/context/AuthContext.jsx` — Firebase Auth with email verification |
| Dynamic data | `src/pages/EventDetail.jsx` — booking writes to Firestore with a transaction to safely update seat counts, `Dashboard.jsx` reads it back live |

## Next steps to extend it

- Build an `Admin.jsx` page to add/edit events from the UI instead of the Firestore console
- Add Firestore security rules so only authenticated users can write bookings
- Add a "cancel booking" button on the Dashboard