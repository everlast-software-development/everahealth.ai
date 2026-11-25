# Evera AI website

React (Vite) front end + Node.js (Express) API, in one project.

```
evera-site/
├─ package.json          ← run everything from here
├─ client/               ← the website (React + Vite)
│  ├─ index.html         ← page title, meta tags, Google Fonts
│  └─ src/
│     ├─ main.jsx        ← entry point
│     ├─ site/App.jsx    ← every section of the site
│     ├─ site/site.css   ← the site's styles
│     ├─ data/landing.js ← all the text: steps, features, testimonials, plans, contact…
│     ├─ components/     ← waitlist pop-up, image components, social icons
│     ├─ lib/            ← API calls, image loading, animation helpers
│     ├─ styles/         ← base styles and the pop-up styles
│     └─ assets/         ← images (the Evera video is streamed from a web address)
└─ server/               ← the API (Express)
   ├─ src/index.js       ← server setup
   ├─ src/routes/        ← /api/waitlist, /api/contact, /api/newsletter
   └─ data/              ← form submissions are saved here as JSON
```

## Requirements

- Node.js **18.18 or newer** (check with `node -v`). Download from https://nodejs.org

## Run it

Open the folder in VS Code, open a terminal (**Terminal → New Terminal**) and run:

```bash
npm run setup      # first time only: installs everything
npm run dev        # starts the site and the API together
```

Then open **http://localhost:5173**. Changes you save appear in the browser straight away.

- The site runs on port **5173**, the API on **5000**. During development every `/api` request from the site is forwarded to the API automatically.
- To stop: press `Ctrl + C` in the terminal.

## Where to change things

| To change… | Edit |
| --- | --- |
| Text of steps, features, testimonials, plans, contact details, social links | `client/src/data/landing.js` |
| Hero text, section titles, layout of a section | `client/src/site/App.jsx` (each section is a function: `Hero`, `Care`, `About`, `Scan`, `Features`, `Analysis`, `Voices`, `Pricing`, `Contact`, `Final`) |
| Colours, sizes, spacing | `client/src/site/site.css` (brand colours: `#0E0E25`, `#9259FF`, `#CAE751`, `#BCACFF`, `#5619CC`, `#2A0F4F`) |
| Images | `client/src/assets/` (keep the same file names, or update the imports) |
| The Evera video | It is streamed from a web address, not stored in the project: change `heroVideo` in `client/src/data/landing.js` (and the same address in `server/src/index.js` and `client/index.html`). If the new video starts on a different frame, replace `client/src/assets/video/evera-hero-poster.jpg` with its first frame. |
| Privacy Policy and Terms & Conditions text | `client/src/data/legal.js` (layout: `client/src/legal/`) |
| Section order | the `SECTIONS` list near the end of `client/src/site/App.jsx` |

## Form submissions

Waitlist and contact forms are saved in `server/data/waitlist.json` and `server/data/contact.json`.
For a live launch, connect `server/src/lib/store.js` to a real database or an email service.

## Settings

Copy `server/.env.example` to `server/.env` to change the port or the site address used for CORS.

## Build for production

```bash
npm run build      # builds the site into client/dist
npm start          # one server on http://localhost:5000 serves the site and the API
```

## Before going live

- The Privacy Policy (`/privacy-policy`) and Terms & Conditions (`/terms-and-conditions`) pages are drafts: have a UAE lawyer review them, and check that the privacy policy matches what the app really collects.
- Numbers shown inside example screens (markers, percentages) are illustrations; review them.
- Medical wording should be reviewed by a doctor, and legal pages by a UAE lawyer.
