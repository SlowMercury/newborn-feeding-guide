# 🍼 How to Put Your Baby Feeding Website on the Internet

## What We're Doing (Big Picture)

You already uploaded your files to GitHub — great job! But the website isn't working yet because:

1. ❌ You're missing **one hidden file** that tells GitHub how to build your site
2. ❌ GitHub doesn't know you want it to be a website yet

We'll fix both using **only your web browser** — no Terminal needed.

**Total time**: About 10 minutes.

**Cost**: Completely free. Forever.

---

## 🔍 PART 1: Why It's Not Working

When you uploaded your files, you missed a hidden folder called `.github`. Files and folders that start with a dot (`.`) are hidden by default on your computer — you literally can't see them in Finder or File Explorer.

Inside that hidden folder is a special file:

```
.github/workflows/deploy.yml
```

This file is like a **recipe card** for GitHub. It says:
> "Hey GitHub, whenever I upload new files, please:
> 1. Install all the tools needed
> 2. Build my website
> 3. Put it on the internet"

Without this file, GitHub just stores your files — it doesn't know what to do with them.

**Let's create this file right now in your browser.**

---

## 📝 PART 2: Create the Missing File on GitHub

### Step 2.1 — Go to Your Repository

1. Open your browser
2. Go to your repository. It will be something like:
   ```
   https://github.com/YOUR_USERNAME/newborn-feeding-guide
   ```
3. You should see your files listed (like `src`, `index.html`, `package.json`, etc.)

### Step 2.2 — Create the Folder and File

GitHub lets you create files directly in your browser. Here's how:

1. Near the top of your file list, find the button that says **"Add file"**
2. Click it, then click **"Create new file"**

3. You'll see a text box at the top that says **"Name your file..."**

4. In that box, type this **exactly** (including the slashes):
   ```
   .github/workflows/deploy.yml
   ```

   > ☝️ **Important details:**
   > - Start with a dot: `.github` (not `github`)
   > - Use forward slashes: `/` (not backslashes)
   > - As you type the slashes, GitHub will automatically create the folders for you — you'll see `.github /` and then `workflows /` appear as separate folder labels
   > - The final filename is `deploy.yml`

5. You'll now see a big empty text editor below. **Copy the ENTIRE block below** and paste it into that editor:

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

### Step 2.3 — Save the File

1. Scroll down below the editor
2. You'll see a section called **"Commit changes"** (or a green button saying "Commit changes...")
3. In the commit message box, type:
   ```
   Add deployment workflow
   ```
4. Make sure **"Commit directly to the `main` branch"** is selected (it should be by default)
5. Click the green **"Commit changes"** button

✅ **The file is now created!**

You can verify by going back to your repo and clicking into the `.github` folder → `workflows` folder → you should see `deploy.yml` there.

---

## 🌐 PART 3: Tell GitHub to Make It a Website

### Step 3.1 — Go to Settings

1. On your repository page, look at the menu bar near the top:
   ```
   < > Code    Issues    Pull requests    Actions    ⚙ Settings
   ```

2. Click **"Settings"** (it's on the right side — you might need to click the `···` three dots on mobile to find it)

### Step 3.2 — Find Pages

1. In the left sidebar, scroll down and look for a section called **"Code and automation"**
2. Under it, you'll see **"Pages"**
3. Click **"Pages"**

### Step 3.3 — Change the Source

1. You'll see a section called **"Build and deployment"**
2. Under **"Source"**, there's a dropdown that probably says **"Deploy from a branch"**
3. **Click that dropdown** and change it to: **"GitHub Actions"**
4. It saves automatically — no save button needed

✅ **GitHub Pages is now enabled!**

---

## 🚀 PART 4: Watch Your Website Get Built

### Step 4.1 — Go to the Actions Tab

1. Click on the **"Actions"** tab in the top menu of your repository

2. You should now see a workflow called **"Deploy to GitHub Pages"** (or your commit message "Add deployment workflow")

3. It will have one of these icons next to it:
   - 🟡 **Yellow spinning circle** = It's building right now (wait 1–2 minutes)
   - ✅ **Green checkmark** = It's done! Your site is live!
   - ❌ **Red X** = Something went wrong (see Troubleshooting below)

### Step 4.2 — If You Don't See Any Workflow Yet

Sometimes GitHub doesn't trigger the workflow immediately. You can trigger it manually:

1. If you see the Actions page but it says "No workflows" or the list is empty:
2. Click on **"Deploy to GitHub Pages"** in the left sidebar (if visible)
3. Click the **"Run workflow"** button on the right
4. In the dropdown, click the green **"Run workflow"** button
5. Refresh the page after 5 seconds — you should see it running now

**If you still don't see it:**
- The `deploy.yml` file might not have saved correctly
- Go back to your repo → click `.github` → `workflows` → `deploy.yml`
- Make sure the content matches exactly what was shown in Step 2.2 above
- If it looks wrong, click the ✏️ pencil icon to edit it, fix it, and commit again

### Step 4.3 — Find Your Live Website

Once you see the green ✅ checkmark:

1. Go to **Settings → Pages** (same as Part 3)
2. At the top of the page, you'll see a green banner:

   > ✅ **Your site is live at** https://YOUR_USERNAME.github.io/newborn-feeding-guide/

3. **Click that link!**

🎉🎉🎉 **YOUR WEBSITE IS ON THE INTERNET!** 🎉🎉🎉

> 📝 **Save this link!** Bookmark it, text it to yourself, or write it down.
> This is your website's permanent address.

---

## ✏️ PART 5: How to Make Changes Later (Without Terminal)

You can edit files directly on GitHub's website!

### To Edit an Existing File:

1. Go to your repository on GitHub
2. Click through the folders to find the file you want to edit
   - Example: click `src` → `content` → `lessons.ts`
3. Click the **✏️ pencil icon** (top right of the file view) to edit
4. Make your changes in the editor
5. Click **"Commit changes..."** (green button)
6. Add a message like "Updated lesson content"
7. Click **"Commit changes"**
8. Go to **Actions** tab and wait for the green ✅ (1–2 minutes)
9. Refresh your website — changes are live!

### To Upload New Files:

1. Go to the folder where you want to add the file
2. Click **"Add file"** → **"Upload files"**
3. Drag your files in or click "choose your files"
4. Add a commit message
5. Click **"Commit changes"**
6. Wait for the Actions build to finish

### To Delete a File:

1. Navigate to the file on GitHub
2. Click the **🗑️ trash can icon** (or three dots `···` → Delete)
3. Commit the deletion
4. Wait for rebuild

---

## ❓ Troubleshooting — Something Went Wrong?

### "The Actions build failed (red ❌)"

1. Click on the failed workflow run in the Actions tab
2. Click on the **"build"** job (it will have a red ❌)
3. You'll see the step-by-step log — the step with the ❌ tells you what went wrong
4. Most common problem: **a typo in a file you edited**
5. Go fix the file (edit it on GitHub with the pencil icon), commit the fix, and it will automatically rebuild

### "I see a 404 page when I visit the link"

- Go to **Settings → Pages** and make sure Source says **"GitHub Actions"** (not "Deploy from a branch")
- Check the **Actions** tab to make sure the latest build has a green ✅
- Make sure you're using the correct URL (with your actual username)

### "The website looks old / my changes aren't showing"

Your browser saved the old version. Force it to reload:
- **Mac**: Press `Cmd + Shift + R`
- **Windows**: Press `Ctrl + Shift + R`
- **Phone**: Clear browser cache, or open the link in a private/incognito tab

### "I can't find the Settings or Pages option"

- Make sure you're on YOUR repository page (not someone else's)
- You must be the **owner** of the repository to see Settings
- On mobile, the Settings link might be hidden — tap the `···` three dots in the menu bar

### "I can see .github but the workflow still doesn't run"

Check the file is in the right place. The path must be **exactly**:
```
.github/workflows/deploy.yml
```

Common mistakes:
- `github/workflows/deploy.yml` (missing the dot at the start)
- `.github/deploy.yml` (missing the `workflows` folder)
- `.github/workflows/deploy.yaml` (`.yaml` works too actually, but double-check)

Click into `.github` → `workflows` → you should see `deploy.yml`. Click on it and make sure the content looks right (not empty, not garbled).

### "I accidentally created the file in the wrong place"

1. Find the file wherever it ended up
2. Click on it, then click the 🗑️ delete icon, and commit the deletion
3. Follow Part 2 again to create it in the right place

### "I want to start completely over"

1. Go to **Settings** (scroll all the way to the very bottom of the page)
2. In the red **"Danger Zone"** section, click **"Delete this repository"**
3. It will ask you to type the repo name to confirm
4. After deletion, go back to Part 2 of this guide and start fresh

---

## 📌 Quick Reference Card

Save this somewhere handy:

```
┌─────────────────────────────────────────────┐
│                                             │
│   🍼 MY BABY FEEDING GUIDE WEBSITE          │
│                                             │
│   Website URL:                              │
│   https://_______.github.io/                │
│          newborn-feeding-guide/             │
│                                             │
│   GitHub Repo:                              │
│   https://github.com/_______/              │
│          newborn-feeding-guide              │
│                                             │
│   To update the site (on GitHub.com):       │
│   1. Find the file, click ✏️ pencil         │
│   2. Make changes                           │
│   3. Click "Commit changes"                 │
│   4. Wait 2 min for Actions ✅              │
│   5. Refresh your website                   │
│                                             │
│   GitHub username: _______________          │
│   GitHub email:    _______________          │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎯 Summary: Your Checklist

Check off each step as you complete it:

- [ ] **Part 1**: Understood why it wasn't working (missing `.github/workflows/deploy.yml`)
- [ ] **Part 2**: Created the `deploy.yml` file on GitHub using the browser
- [ ] **Part 3**: Changed Settings → Pages → Source to "GitHub Actions"
- [ ] **Part 4**: Saw the green ✅ in the Actions tab
- [ ] **Part 4**: Visited your live website URL and it works!
- [ ] **Part 5**: Know how to edit files on GitHub for future updates

---

**That's it! You did it! 🎉**

Your baby feeding guide is now a real website on the internet. No Terminal was needed at any point. Whenever you want to update something, just edit the file on GitHub, commit, and wait 2 minutes.
