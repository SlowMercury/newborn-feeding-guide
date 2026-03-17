# 🍼 Гид по кормлению новорождённого

An LMS-style educational static website about newborn baby feeding, built with **React + Vite + Tailwind CSS**.

![License](https://img.shields.io/badge/license-MIT-green)
![Static](https://img.shields.io/badge/type-static%20site-blue)

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Content Management](#-content-management)
  - [Adding a New Lesson](#adding-a-new-lesson)
  - [Adding a New Module](#adding-a-new-module)
  - [Reordering Lessons](#reordering-lessons)
  - [Content Block Types](#content-block-types)
- [Deploying to GitHub Pages](#-deploying-to-github-pages)
  - [📘 Detailed Beginner Guide](./DEPLOYMENT_GUIDE.md) ← If this is your first time!
  - [Option 1: GitHub Actions (Recommended)](#option-1-github-actions-recommended)
  - [Option 2: Manual Deploy](#option-2-manual-deploy)
- [Responsive Design](#-responsive-design)
- [Future Roadmap](#-future-roadmap)

---

## ✨ Features

| Feature | Status |
|---------|--------|
| LMS-style lesson navigation with sidebar | ✅ |
| Accordion module/chapter structure | ✅ |
| Progress tracking via localStorage | ✅ |
| "Mark as Complete" per lesson | ✅ |
| Visual progress bar (% complete) | ✅ |
| Previous / Next lesson navigation | ✅ |
| Breadcrumb navigation | ✅ |
| Mobile responsive (hamburger menu + drawer) | ✅ |
| Swipe gestures on mobile (open/close sidebar) | ✅ |
| Horizontally scrollable tables on mobile | ✅ |
| Touch-friendly tap targets (44px minimum) | ✅ |
| Warm, earthy design with Poppins + Lora fonts | ✅ |
| Fade-in animations for lesson content | ✅ |
| Keyboard accessible (Escape to close sidebar) | ✅ |
| Print-friendly (sidebar hidden when printing) | ✅ |
| Body scroll lock when sidebar is open | ✅ |
| Client-side full-text search with highlighting | ✅ |
| Keyboard search shortcut (Ctrl+K) | ✅ |
| Toast notifications on progress changes | ✅ |
| Course completion celebration screen | ✅ |
| Reset progress with confirmation dialog | ✅ |
| Auto-advance hint after lesson completion | ✅ |
| Quizzes | 🔮 Planned |
| Multi-guide support | 🔮 Planned |

---

## 🧱 Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **Fonts:** Google Fonts (Poppins + Lora)
- **State:** React useState + localStorage
- **Deployment:** Static HTML/CSS/JS — any static host

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Install & Run

```bash
# Clone the repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder. You can preview it:

```bash
npm run preview
```

---

## 📁 Project Structure

```
├── index.html                          # Entry HTML with fonts & meta tags
├── README.md                           # This file
├── package.json
├── vite.config.ts                      # Vite config (do not edit directly)
├── src/
│   ├── main.tsx                        # React entry point
│   ├── App.tsx                         # Main app: routing, state, layout
│   ├── index.css                       # Global styles + Tailwind theme
│   ├── content/
│   │   └── lessons.ts                  # 📝 ALL CONTENT LIVES HERE
│   ├── components/
│   │   ├── Sidebar.tsx                 # Left nav with accordion modules
│   │   ├── ProgressBar.tsx             # Progress bar in sidebar
│   │   ├── Breadcrumb.tsx              # Module > Lesson breadcrumb
│   │   ├── LessonContent.tsx           # Renders lesson blocks
│   │   ├── LessonNav.tsx               # Prev/Next buttons
│   │   └── MarkComplete.tsx            # Complete toggle button
│   └── utils/
│       └── cn.ts                       # Utility for class names
└── public/
    └── images/                         # Static images (if any)
```

---

## 📝 Content Management

All content lives in **`src/content/lessons.ts`**. This is the single source of truth.

### Adding a New Lesson

1. Open `src/content/lessons.ts`
2. Add a new lesson object to the `lessons` array:

```typescript
{
  id: "unique-slug-id",                    // URL-friendly unique ID
  title: "Название урока",                  // Lesson title
  module: "Название модуля",               // Module this belongs to
  moduleOrder: 1,                          // Module sort order
  order: 7,                                // Lesson order within module
  content: [
    // Add content blocks here (see Content Block Types below)
    {
      type: "paragraph",
      text: "Текст урока..."
    },
  ],
},
```

3. Save the file. The sidebar, navigation, and progress tracking will **automatically** pick up the new lesson — no other files need to be modified.

### Adding a New Module

Simply add lessons with a **new `module` name** and a new `moduleOrder` value:

```typescript
{
  id: "new-module-lesson-1",
  title: "Первый урок нового модуля",
  module: "Новый модуль: Название",         // 👈 New module name
  moduleOrder: 2,                          // 👈 Comes after module 1
  order: 1,                                // First lesson in this module
  content: [ /* ... */ ],
},
```

The sidebar will automatically create a new accordion section for this module.

### Reordering Lessons

- **Within a module:** Change the `order` property on each lesson. Lessons are sorted by `order` ascending.
- **Between modules:** Change the `moduleOrder` property. Modules are sorted by `moduleOrder` ascending.
- **Moving a lesson to a different module:** Change its `module` string to match the target module name.

### Content Block Types

Each lesson's `content` is an array of typed blocks. Here are all available types:

#### 1. Paragraph

```typescript
{
  type: "paragraph",
  text: "Основной текст параграфа."
}
```

#### 2. Heading (levels 2, 3, 4)

```typescript
{
  type: "heading",
  level: 3,               // 2 = h2, 3 = h3, 4 = h4
  text: "Заголовок секции"
}
```

#### 3. List (bullet or numbered)

```typescript
{
  type: "list",
  ordered: false,          // true = numbered, false = bullet
  items: [
    "Первый пункт",
    "Второй пункт",
    "Третий пункт"
  ]
}
```

#### 4. Table

```typescript
{
  type: "table",
  headers: ["Колонка 1", "Колонка 2", "Колонка 3"],
  rows: [
    ["Ячейка 1A", "Ячейка 1B", "Ячейка 1C"],
    ["Ячейка 2A", "Ячейка 2B", "Ячейка 2C"],
  ]
}
```

Tables are automatically horizontally scrollable on mobile.

#### 5. Callout (info, warning, tip)

```typescript
{
  type: "callout",
  variant: "tip",          // "info" (💡 blue), "warning" (⚠️ orange), "tip" (✅ green)
  title: "Заголовок",
  text: "Текст подсказки."
}
```

#### 6. Quote / Blockquote

```typescript
{
  type: "quote",
  text: "Цитата или важная мысль."
}
```

---

## 🌐 Deploying to GitHub Pages

> ### 📘 First time? Never used GitHub before?
> Read the **[step-by-step beginner guide](./DEPLOYMENT_GUIDE.md)** — it explains every single click with screenshots-like detail, from creating a GitHub account to seeing your site live.

### Option 1: GitHub Actions (Recommended)

This is the fully automated approach. Every push to `main` triggers a build and deploy.

**Step 1:** Create the workflow file at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 2:** In your GitHub repo, go to **Settings → Pages**:
- Source: **GitHub Actions**

**Step 3:** Push to `main`:

```bash
git add .
git commit -m "Initial deploy"
git push origin main
```

Your site will be live at `https://<username>.github.io/<repo-name>/` within a few minutes.

**Step 4:** If your repo is **not** `<username>.github.io`, you need to set the `base` in `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/<repo-name>/',
  // ... rest of config
});
```

### Option 2: Manual Deploy

If you prefer to deploy manually without GitHub Actions:

```bash
# 1. Build the project
npm run build

# 2. Install gh-pages if you haven't
npm install -D gh-pages

# 3. Add to package.json scripts:
#    "deploy": "gh-pages -d dist"

# 4. Deploy
npm run deploy
```

Then in **Settings → Pages**, set source to **Deploy from a branch** → `gh-pages` / `/ (root)`.

### Custom Domain (Optional)

1. In **Settings → Pages**, enter your custom domain
2. Create a `public/CNAME` file with your domain:
   ```
   feeding-guide.yourdomain.com
   ```
3. Set up DNS records as instructed by GitHub

---

## 📱 Responsive Design

The site is fully responsive across all device sizes:

| Breakpoint | Behavior |
|-----------|----------|
| **< 640px** (mobile) | Sidebar hidden, hamburger menu, full-width content, stacked nav buttons, smaller font sizes, full-width "Mark Complete" button |
| **640px – 768px** (large mobile / small tablet) | Similar to mobile but with slightly more spacing |
| **768px+** (tablet & desktop) | Fixed sidebar (300px), content pane with max-width 760px |

### Mobile-Specific Features

- **Hamburger menu** in sticky top header
- **Slide-out drawer** sidebar with backdrop overlay
- **Swipe right from left edge** to open sidebar
- **Swipe left on sidebar** to close it
- **Body scroll lock** when sidebar drawer is open (prevents background scrolling)
- **Touch-active states** — buttons scale down slightly on press (`active:scale-[0.97]`)
- **Horizontally scrollable tables** with `-webkit-overflow-scrolling: touch`
- **44px minimum touch targets** for all buttons and interactive elements
- **Safe area insets** for notched phones (iPhone X+)
- **Current lesson title** shown in mobile header bar
- **Escape key** closes sidebar on keyboards

---

## 🔮 Future Roadmap

These features are **not yet built** but the architecture supports them:

### Quizzes
The content block system can be extended with a `quiz` block type:
```typescript
{
  type: "quiz",
  question: "Сколько раз минимум кормить в сутки?",
  options: ["6 раз", "8 раз", "10 раз", "12 раз"],
  correctIndex: 1,
  explanation: "ВОЗ рекомендует минимум 8 кормлений за 24 часа."
}
```
Add a `QuizBlock` component in `src/components/` and add the case to `LessonContent.tsx`.

### Multi-Guide Support
The current `lessons.ts` structure can be extended to include a `guide` or `course` field. Each guide would have its own set of modules and lessons. The sidebar could show a course picker dropdown.

---

## 📄 License

MIT — free to use, modify, and distribute.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-lesson`
3. Add your content to `src/content/lessons.ts`
4. Test locally: `npm run dev`
5. Build to verify: `npm run build`
6. Submit a pull request

---

*Built with ❤️ for new parents everywhere.*
