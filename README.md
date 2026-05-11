# AI CFO — Landing Page

React + Vite + Tailwind CSS frontend for the AI CFO Financial Intelligence Platform.

---

## 🚀 Setup (Step by Step)

### Step 1 — Download / copy this project folder

Place the `ai-cfo` folder anywhere on your computer (e.g. Desktop).

### Step 2 — Open in VS Code

```
File → Open Folder → Select "ai-cfo"
```

### Step 3 — Open Terminal in VS Code

```
Ctrl + `  (backtick key)
```

### Step 4 — Install dependencies

```bash
npm install
```

Wait for it to finish (1–2 minutes first time).

### Step 5 — Start local server

```bash
npm run dev
```

### Step 6 — Open browser

Go to: **http://localhost:5173**

You will see the landing page! 🎉

---

## 📁 Folder Structure

```
ai-cfo/
├── public/
│   └── favicon.svg          ← Site icon
│   └── images/              ← Put Figma exported images here
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx   ← Top navigation
│   │   │   └── Footer.jsx   ← Bottom footer
│   │   ├── sections/
│   │   │   ├── Hero.jsx           ← Hero / main banner
│   │   │   ├── TrustedBy.jsx      ← Logo strip
│   │   │   ├── ProblemSolution.jsx← Problem vs Solution cards
│   │   │   ├── Features.jsx       ← 6 feature cards
│   │   │   ├── PlatformShowcase.jsx ← Dashboard mockup
│   │   │   ├── Pricing.jsx        ← Pricing cards
│   │   │   ├── CTABanner.jsx      ← Blue CTA section
│   │   │   └── Testimonials.jsx   ← Reviews
│   │   └── ui/
│   │       └── DashboardPreview.jsx ← Mini dashboard in Hero
│   ├── App.jsx              ← Assembles all sections
│   ├── main.jsx             ← Entry point
│   └── index.css            ← Global styles + Tailwind
│
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🖼️ Adding Images from Figma

1. In Figma: Select frame → Right click → Export as PNG (2x)
2. Put exported files in `public/images/` folder
3. Use in components like:
   ```jsx
   <img src="/images/your-image.png" alt="description" />
   ```

---

## 🛑 Common Issues

| Issue | Fix |
|-------|-----|
| `npm install` fails | Make sure Node.js is installed: `node --version` |
| Port already in use | Run `npm run dev -- --port 3000` |
| Blank screen | Check terminal for red error messages |

---

## 📦 Build for production

```bash
npm run build
```

Output goes to `dist/` folder — ready to deploy to Vercel.
