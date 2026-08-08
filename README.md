# CampusShare

A campus item-lending marketplace: post things you own but rarely use, browse what
others are lending, and request to borrow — all in one place.

## Stack

- React 18 + Vite
- React Router v6
- Tailwind CSS
- Mock API backed by `localStorage` (see `src/services/api.js`) — no backend
  required to run this, and it's structured so swapping in real HTTP calls
  later is a drop-in replacement.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

## Demo account

A seeded demo account is available:

- **Email:** riya@campus.edu
- **Password:** password123

Or just register a new account — it persists in your browser's localStorage.

## Project structure

```
src/
├── components/     Navbar, Footer, ItemCard, SearchBar, CategoryCard
├── pages/          Home, Login, Register, Dashboard, ShareItem,
│                   BrowseItems, ItemDetails, MyListings, Requests, Profile
├── context/         AuthContext.jsx — session/auth state
├── hooks/           useAuth.js — consumes AuthContext
├── services/        api.js — mock API (auth, items, requests), localStorage-backed
├── App.jsx          Routes + protected-route wrapper
└── main.jsx         App entry point
```

## Swapping in a real backend

Every function in `src/services/api.js` returns a Promise and is the single
place data flows through. Replace the internals (e.g. with `fetch` calls to
your own API) and no component code needs to change.
