# Social Drop (Vercel-Ready) 🚀

A sleek, mobile-first **Drop & Post** link platform built with **Next.js 15, Tailwind CSS, and Lucide React** to manage and schedule posts across **Instagram Reels, YouTube Shorts, TikTok, Threads, and Facebook** with built-in **Anti-Shadowban Human Cadence Protection**.

---

## 🛡️ Anti-Shadowban & Human Cadence Protection

Platforms (especially TikTok and Instagram) actively detect and penalize automated bot syndication networks. Social Drop incorporates 4 essential human-mimicking defenses:

1. **Smart Staggered Queues (No Simultaneous Blasting)**:
   * Instead of blasting 5 platforms at `15:00:00.000` (a known bot trigger), the engine staggers delivery across an organic 15–60 minute curve (e.g., YouTube $\rightarrow$ +15m TikTok $\rightarrow$ +32m Instagram $\rightarrow$ +48m Threads).
2. **Organic Minute Jitter**:
   * Adds random offsets (±2 to 7 minutes) so release timestamps look like a real person tapping "Post" on their phone.
3. **Platform-Adaptive Formatting**:
   * Automatically adapts caption structure and hashtag counts per platform (avoiding duplicate cross-posting penalties).
4. **Account Velocity Guard**:
   * Tracks daily post count per identity and displays an active velocity meter (Green = Safe/Human, Amber = Moderate, Red = High Frequency).

---

## ⚡ Deployment to Vercel (1-Click)

### Option A: Using the Vercel CLI
```bash
npm install -g vercel
vercel
```
Follow the interactive prompts to deploy to `https://your-app.vercel.app`!

### Option B: Using GitHub
1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Social Drop"
   git remote add origin https://github.com/your-username/social-drop.git
   git push -u origin main
   ```
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your GitHub repository and click **Deploy**.

---

## 💻 Running Locally

```bash
cd /Users/theo/.gemini/antigravity/scratch/social-drop-vercel
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## 📱 Mobile Workflow ("Drop Link")
1. Open the Vercel URL on your iPhone/Android browser.
2. Tap **Share $\rightarrow$ Add to Home Screen** to use it like a native iOS/Android app.
3. Choose your identity (e.g., `Brand Alpha` or `Personal`).
4. Drop your video from your Camera Roll.
5. Tap **Schedule & Auto-Post**.
