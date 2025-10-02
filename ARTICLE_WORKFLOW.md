# Article Publishing & LinkedIn Auto-Post Workflow

## Overview

Your static website now has an automated article publishing system that:
- ✅ Keeps the site **100% static** (no runtime dependencies)
- ✅ **Auto-posts to LinkedIn** when you publish an article
- ✅ Uses **GitHub Actions** for server-side automation
- ✅ Maintains **minimal attack surface**

## Architecture

```
Write Article (HTML)
  ↓
Push to GitHub (gh-pages branch)
  ↓
GitHub Actions (server-side)
  ↓
├─ Deploy to GitHub Pages (seantech.co)
└─ Post to LinkedIn REST API
  ↓
Article live on both platforms!
```

## Quick Start

### 1. Write an Article

```bash
# Copy template
cp article/article-template.html article/my-new-article.html

# Edit the file - update metadata and content
# See article/README.md for detailed instructions
```

### 2. Add to Blog Page

Edit `blog.html` and add your article to the listing (see `article/README.md` for HTML snippet).

### 3. Publish

```bash
git add article/my-new-article.html blog.html
git commit -m "Add article: My New Article"
git push origin gh-pages
```

### 4. Automatic LinkedIn Post

GitHub Actions automatically:
1. Detects new article in `/article/` directory
2. Extracts title, excerpt, and URL
3. Posts to LinkedIn with link back to your site

**Done!** Your article is now live on seantech.co and posted on LinkedIn.

## Files Created

### Article System
- `/article/` - Directory for blog articles
- `/article/article-template.html` - Template for new articles
- `/article/README.md` - Detailed instructions

### GitHub Actions
- `.github/workflows/post-to-linkedin.yml` - Workflow that posts to LinkedIn
- `.github/scripts/post-to-linkedin.js` - Script that calls LinkedIn REST API
- `.github/scripts/package.json` - Dependencies (axios, cheerio)

### Configuration
- `.gitignore` - Updated to exclude node_modules and package-lock.json

## Required GitHub Secrets

You need these secrets configured in GitHub repository settings:

| Secret Name | Description | Status |
|-------------|-------------|--------|
| `LINKEDIN_ACCESS_TOKEN` | OAuth token with `w_member_social` scope | ✅ Already configured |
| `LINKEDIN_PERSON_URN` | Your LinkedIn person URN | ✅ Already configured |

To verify/update secrets:
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Check that both secrets exist

## How the LinkedIn Posting Works

### Automatic Trigger
- Detects new `.html` files in `/article/` directory
- Excludes `article-template.html` from triggering
- Runs automatically on `git push`

### Manual Trigger
You can also manually trigger a LinkedIn post:

1. Go to: GitHub repo → **Actions** tab
2. Select: **"Post Article to LinkedIn"** workflow
3. Click: **"Run workflow"**
4. Enter: `article/my-article.html`
5. Click: **"Run workflow"**

### What Gets Posted

LinkedIn post format:
```
[Article Title]

[Brief excerpt from og:description meta tag]

Read the full article: https://seantech.co/article/your-article.html

#Technology #TechConsulting
```

### Rate Limits
- LinkedIn API: 150 requests per day per member
- Workflow: Waits 2 seconds between multiple posts

## Article Metadata

Your articles must include these meta tags for LinkedIn posting:

```html
<meta property="og:title" content="Your Article Title">
<meta property="og:description" content="Brief excerpt (150-200 chars)">
<meta property="og:url" content="https://seantech.co/article/your-article.html">
<meta property="og:image" content="https://seantech.co/img/blog/1.jpg">
<meta name="article:published_time" content="2024-01-15">
<meta name="article:category" content="Technology">
```

## Workflow Details

### Trigger Conditions

**Automatic:**
- Push to `gh-pages` branch
- Changes to `article/*.html`
- Excludes `article-template.html`

**Manual:**
- Workflow dispatch with article path input

### Workflow Steps

1. **Checkout** - Gets latest code
2. **Setup Node.js** - Installs Node.js 18
3. **Install Dependencies** - Installs axios & cheerio (server-side only)
4. **Detect Articles** - Finds new/modified articles
5. **Post to LinkedIn** - Calls REST API for each article
6. **Summary** - Reports success/failure

### Workflow File Location
`.github/workflows/post-to-linkedin.yml`

## Monitoring

### Check Workflow Status

1. Go to: GitHub repo → **Actions** tab
2. View: Recent workflow runs
3. Click: Any run to see detailed logs

### Success Indicators
- ✅ Green checkmark on workflow run
- ✅ LinkedIn post appears on your profile
- ✅ Workflow logs show "Posted successfully"

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Workflow fails | Check Actions tab for error logs |
| No LinkedIn post | Verify GitHub secrets are set |
| Wrong content | Check article metadata tags |
| 401 Error | LinkedIn token expired - regenerate |
| Rate limit | Wait 24 hours (150 posts/day limit) |

## Important Notes

### Static Site Architecture
- **Site files**: 100% static HTML/CSS/JS
- **Node.js**: Only used by GitHub Actions (server-side)
- **package.json**: Only in `.github/scripts/` directory
- **No runtime dependencies**: Site loads instantly

### Security
- ✅ No server-side code on the site
- ✅ Credentials stored in GitHub Secrets (encrypted)
- ✅ OAuth tokens never exposed in frontend
- ✅ Minimal attack surface

### Best Practices
- Write articles in Markdown, convert to HTML
- Use semantic HTML structure
- Optimize images before adding to `/img/blog/`
- Test article locally before pushing
- Keep excerpts concise (150-200 chars)

## Advanced Usage

### Custom LinkedIn Post Format

Edit `.github/scripts/post-to-linkedin.js` to customize the post format:

```javascript
// Line ~33: createPostText function
function createPostText(metadata) {
  // Customize your LinkedIn post format here
}
```

### Disable Auto-Posting

Temporarily disable auto-posting:

1. Go to: `.github/workflows/post-to-linkedin.yml`
2. Comment out the `push:` trigger section
3. Use manual workflow dispatch only

### Multiple Articles at Once

Push multiple articles in one commit:
```bash
git add article/article1.html article/article2.html blog.html
git commit -m "Add multiple articles"
git push origin gh-pages
```

The workflow posts all articles (with 2-second delay between each).

## Files Changed/Created

### Created
```
article/
├── article-template.html
└── README.md

.github/
├── workflows/
│   └── post-to-linkedin.yml
└── scripts/
    ├── post-to-linkedin.js
    └── package.json

ARTICLE_WORKFLOW.md (this file)
```

### Modified
```
.gitignore (added package-lock.json)
```

### Deleted
```
- package.json (root)
- package-lock.json (root)
- node_modules/ (root)
- data/ directory
- js/linkedin-posts.js
- get-linkedin-token.js
- test-linkedin-connection.js
- update-person-urn.js
- add-article.js
- LINKEDIN_SETUP.md
- .env.example
- .github/workflows/sync-linkedin.yml
- .github/scripts/fetch-linkedin.js
```

## Next Steps

1. **Test the workflow:**
   ```bash
   # Create a test article
   cp article/article-template.html article/test-article.html
   # Edit with test content
   # Push and verify LinkedIn post
   ```

2. **Write your first article** using the template

3. **Monitor the workflow** in GitHub Actions

4. **Check LinkedIn** to see your auto-posted article

## Support

- **Article instructions**: See `article/README.md`
- **Quick start guide**: See `QUICK_START.md`
- **Project overview**: See `CLAUDE.md`

---

🎉 **Your automated article publishing system is ready!**

Write once, publish everywhere - all while keeping your site 100% static and secure.
