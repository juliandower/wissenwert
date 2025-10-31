# Deploying Quiz App to Your Portfolio Site

You have several options to integrate this quiz app into your portfolio at a path like `/quiz`:

## Option 1: Deploy on Vercel with Rewrites (Recommended)

This is the easiest option if your portfolio is also on Vercel or Next.js.

### Steps:

1. **Deploy this quiz app to Vercel:**
   ```bash
   # Make sure you're in this repo
   git add .
   git commit -m "Ready for deployment"
   git push
   
   # Then go to vercel.com and import this repo
   ```

2. **Configure Vercel to serve at /quiz:**
   - In your Vercel project settings, go to "Settings" → "Domains"
   - Add a custom domain or note the Vercel deployment URL
   - In your main portfolio's `vercel.json`, add:

   ```json
   {
     "rewrites": [
       {
         "source": "/quiz/:path*",
         "destination": "https://your-quiz-app.vercel.app/:path*"
       }
     ]
   }
   ```

3. **Or use Next.js rewrites:**
   If your portfolio is Next.js, add to `next.config.js`:
   
   ```javascript
   async rewrites() {
     return [
       {
         source: '/quiz/:path*',
         destination: 'https://your-quiz-app.vercel.app/:path*',
       },
     ]
   }
   ```

## Option 2: Build as Static Export

If you want everything in one deployment:

### Steps:

1. **Update `next.config.js` in this repo:**
   ```javascript
   const nextConfig = {
     output: 'export', // Add this line
     trailingSlash: true,
     basePath: '/quiz', // If deploying to /quiz on your site
   };
   
   export default nextConfig;
   ```

2. **Build the static files:**
   ```bash
   pnpm build
   ```

3. **Copy the `out/` folder** to your main portfolio repo at `/public/quiz/`

4. **Or deploy the `out/` folder** to your static hosting

## Option 3: Use a Subdomain

Deploy this app as `quiz.yourdomain.com`:

1. Deploy this repo to Vercel/Netlify
2. Add a CNAME record in your DNS:
   - Name: `quiz`
   - Value: `cname.vercel-dns.com` (or your hosting provider's CNAME)
3. Access at `https://quiz.yourdomain.com`

## Option 4: Deploy to a Subdirectory (For Static Sites)

If your portfolio is a static site (HTML/CSS/JS):

1. **Update `next.config.js`:**
   ```javascript
   const nextConfig = {
     output: 'export',
     basePath: '/quiz',
     trailingSlash: true,
   };
   ```

2. **Build and copy files:**
   ```bash
   pnpm build
   # This creates an 'out' folder
   # Copy everything from 'out/' to your main site's /quiz/ directory
   ```

3. **Serve from your main portfolio's public folder**

## Recommended Approach

For easiest maintenance, **Option 1 (Vercel with rewrites)** is best:

✅ Keep repos separate
✅ Independent deployments
✅ Easy to update the quiz without touching the portfolio
✅ Both stay fast and optimized

### Quick Setup:

1. **Deploy this quiz app to Vercel** (connect your GitHub repo)
2. **Note the deployment URL** (e.g., `quiz-app.vercel.app`)
3. **In your portfolio repo**, create/modify `vercel.json`:
   ```json
   {
     "rewrites": [
       {
         "source": "/quiz/(.*)",
         "destination": "https://quiz-app.vercel.app/$1"
       }
     ]
   }
   ```
4. **That's it!** Your quiz will be available at `yourportfolio.com/quiz`

Need help with a specific hosting platform? Let me know!

