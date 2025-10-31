# Setup Instructions: Connecting Quiz to Your Vercel Portfolio

## Step-by-Step Guide

### 1. Deploy This Quiz App to Vercel

**Option A: Deploy via Vercel Dashboard (Easiest)**

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New" → "Project"
4. Import your `wissenwert` repository
5. Configure the project:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `pnpm build` (auto-detected)
   - Install Command: `pnpm install` (auto-detected)
6. Add environment variables:
   - Variable: `OPENROUTER_API_KEY`
   - Value: Your actual OpenRouter API key
7. Click "Deploy"
8. **Note the deployment URL** (e.g., `wissenwert.vercel.app`)

**Option B: Deploy via Vercel CLI**
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy
vercel

# Follow the prompts, it will auto-detect Next.js settings
```

---

### 2. Add Rewrite Rule to Your Portfolio

**IMPORTANT:** The exact method depends on whether your portfolio is a Next.js app or a static site.

#### If Your Portfolio is Next.js:

1. Go to your portfolio repository
2. Open `next.config.js` and add:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/quiz/:path*',
        destination: 'https://YOUR-QUIZ-APP.vercel.app/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

Replace `YOUR-QUIZ-APP.vercel.app` with your actual quiz app's Vercel URL.

3. Deploy your portfolio:
   ```bash
   git add next.config.js
   git commit -m "Add quiz app rewrite"
   git push
   ```

#### If Your Portfolio is a Static Site (or uses Vercel rewrites):

1. Go to your portfolio repository
2. Create or update `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/quiz/:path*",
      "destination": "https://YOUR-QUIZ-APP.vercel.app/:path*"
    }
  ]
}
```

3. Commit and push:
   ```bash
   git add vercel.json
   git commit -m "Add quiz app rewrite"
   git push
   ```

---

### 3. Test It!

1. Visit your portfolio: `https://yourportfolio.com`
2. Go to: `https://yourportfolio.com/quiz`
3. The quiz app should load seamlessly!

---

## Troubleshooting

### Quiz shows "404" or doesn't load
- Check that your quiz app is deployed successfully on Vercel
- Verify the URL in your rewrite rule matches the deployed app exactly
- Make sure you've pushed and deployed your portfolio changes

### Quiz loads but paths are wrong (e.g., CSS not loading)
- This happens if the quiz app needs a `basePath` configuration
- In your quiz app's `next.config.js`, add:
  ```javascript
  basePath: '/quiz',
  ```
- Redeploy the quiz app

### Locale switching doesn't work
- The locale paths (`/en/...`, `/de/...`) should work automatically with the rewrite
- If not, check that your middleware is configured correctly in the quiz app

---

## Alternative: Subdomain Approach

If rewrites don't work, you can use a subdomain instead:

1. In Vercel, add a custom domain to your quiz app: `quiz.yourdomain.com`
2. Add a CNAME record in your DNS:
   - Type: CNAME
   - Name: `quiz`
   - Value: `cname.vercel-dns.com`
3. Access at: `https://quiz.yourdomain.com`

This approach doesn't require any rewrites - the apps are completely separate.

---

## Need Help?

If you get stuck:
1. Check the Vercel deployment logs for your quiz app
2. Check the Vercel deployment logs for your portfolio
3. Test the rewrite by visiting: `https://yourportfolio.com/quiz/en` directly
4. Verify environment variables are set in your quiz app's Vercel settings




