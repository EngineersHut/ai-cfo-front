# AI CFO — Unified Platform

Next.js 16+ project managing both the Landing Page and Admin Panel.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/(landing)`: Landing page routes.
- `src/app/(admin)`: Admin panel routes.
- `src/components/layout`: Shared layout components (Navbar, Footer).
- `src/components/sections`: Landing page UI sections.
- `src/components/ui`: Common UI components.
- `src/lib`: Contexts, utilities, and hooks.

## Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theme**: Light/Dark mode support via `ThemeContext`
