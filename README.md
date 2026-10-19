# Parday Typing App

**Type faster. Work smarter.** A responsive typing-practice app built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Lucide React, also this app can support two languages, English and Persian.

## Features

- 30- and 60-second typing tests
- Live WPM, accuracy, error count, and remaining-time metrics
- Eight progressive lessons with target WPM and accuracy
- Lesson unlocking when a learner meets the lesson target
- English and Persian/Farsi interface and practice text
- Random practice text
- Dark and light themes
- Personal-best metrics, practice streak, session history, and achievements
- Local progress persistence using `localStorage`
- Responsive desktop, tablet, and mobile layouts
- PWA manifest and service-worker support through `vite-plugin-pwa`

## Requirements

- Node.js 20.19+ or 22.12+ recommended
- npm

## Run locally

```bash
# 1. Extract this project, then enter its folder
cd parday-typing

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.



Test history is saved in this browser's `localStorage`. It does not automatically sync across devices or browsers. Clearing browser site data will clear saved progress.

- Google Fonts are loaded from Google Fonts when network access is available; fallback fonts are configured.
- The Persian lesson is shown with right-to-left text direction.
- PWA installation behavior depends on the browser and deployment being served over HTTPS (localhost is also supported).
