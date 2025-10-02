# Articles Display System

## Overview

The homepage now displays the latest 5 articles from the `/article/` directory automatically, with responsive behavior that shows only 3 articles on mobile devices.

## How It Works

### Architecture

```
Article files (article/*.html)
  ↓
GitHub Actions (on push)
  ↓
Generate articles-index.json
  ↓
Frontend JavaScript loads JSON
  ↓
Display articles on homepage
```

### Components

#### 1. Backend: Articles Index Generator

**File:** `.github/scripts/generate-articles-index.js`

**What it does:**
- Scans `/article/` directory for HTML files
- Excludes: `article-template.html`, `/drafts/`, `/archive/`
- Extracts metadata from each article:
  - Title (`og:title` meta tag)
  - Description (`og:description` meta tag)
  - Published date (`article:published_time` meta tag)
  - Category (`article:category` meta tag)
  - Featured image (`og:image` meta tag)
- Generates `articles-index.json` with sorted list (newest first)

#### 2. GitHub Actions Workflow

**File:** `.github/workflows/update-articles-index.yml`

**Triggers:**
- Push to `article/**/*.html` (any article added/modified)
- Manual trigger via Actions UI

**What it does:**
1. Runs generator script
2. Creates/updates `articles-index.json`
3. Commits file to repository
4. Auto-deploys to GitHub Pages

#### 3. Frontend JavaScript

**File:** `js/load-articles.js`

**What it does:**
- Fetches `articles-index.json`
- Displays top 5 articles on desktop
- Displays top 3 articles on mobile
- Creates article cards with:
  - Featured image
  - Title
  - Date
  - Category
  - Description excerpt
  - "Read more" link
- Handles errors gracefully (fallback messages)
- Updates display on window resize

#### 4. Responsive CSS

**File:** `css/articles.css`

**Responsive Behavior:**

| Screen Size | Articles Shown | Layout |
|-------------|----------------|--------|
| Desktop (≥992px) | 5 | 3 in top row, 2 in bottom row (centered) |
| Tablet (768-991px) | 3-4 | 2 per row |
| Mobile (<768px) | 3 | 1 per row, stacked |

#### 5. Homepage Integration

**File:** `index.html`

**Changes:**
- Section title: "Latest Articles & Insights"
- Container ID: `articles-container`
- Button: "View All Articles" → links to `blog.html`
- Includes: `js/load-articles.js`
- Includes: `css/articles.css`

---

## File Structure

```
/
├── article/
│   ├── article-template.html       # Template (excluded from index)
│   ├── drafts/                     # Draft articles (excluded from index)
│   ├── archive/                    # Archived articles (excluded from index)
│   └── my-article.html             # Published articles (included in index)
│
├── .github/
│   ├── workflows/
│   │   └── update-articles-index.yml    # Workflow to update index
│   └── scripts/
│       └── generate-articles-index.js   # Generator script
│
├── css/
│   └── articles.css                # Article display styles
│
├── js/
│   └── load-articles.js            # Frontend article loader
│
├── articles-index.json             # Generated article index (auto-updated)
└── index.html                      # Homepage (displays articles)
```

---

## Article Metadata Requirements

For articles to appear correctly, ensure these meta tags are present:

```html
<!-- Required -->
<meta property="og:title" content="Your Article Title">
<meta property="og:description" content="Brief description (150-200 chars)">

<!-- Recommended -->
<meta name="article:published_time" content="2024-01-15">
<meta name="article:category" content="Technology">
<meta property="og:image" content="img/blog/1.jpg">
```

If meta tags are missing, defaults are used:
- Title: Falls back to `<title>` tag or "Untitled Article"
- Description: Empty string
- Date: Current date
- Category: "Technology"
- Image: "img/blog/1.jpg"

---

## Workflow: Adding New Articles

### Automatic Update

1. Create new article: `article/my-new-article.html`
2. Commit and push:
   ```bash
   git add article/my-new-article.html
   git commit -m "Add article: My New Article"
   git push origin gh-pages
   ```
3. GitHub Actions automatically:
   - Detects new article
   - Regenerates `articles-index.json`
   - Commits updated index
   - Deploys to site
4. Homepage automatically shows new article (newest first)

### Manual Trigger

If the index gets out of sync:

1. Go to: GitHub repo → **Actions** tab
2. Select: **"Update Articles Index"** workflow
3. Click: **"Run workflow"**
4. Click: **"Run workflow"** button

---

## Display Behavior

### Desktop View (≥992px)

```
┌─────────┐  ┌─────────┐  ┌─────────┐
│Article 1│  │Article 2│  │Article 3│
└─────────┘  └─────────┘  └─────────┘

   ┌─────────────┐  ┌─────────────┐
   │  Article 4  │  │  Article 5  │
   └─────────────┘  └─────────────┘
```

### Tablet View (768-991px)

```
┌─────────────┐  ┌─────────────┐
│  Article 1  │  │  Article 2  │
└─────────────┘  └─────────────┘

┌─────────────┐  ┌─────────────┐
│  Article 3  │  │  Article 4  │
└─────────────┘  └─────────────┘
```

### Mobile View (<768px)

```
┌───────────────────┐
│     Article 1     │
└───────────────────┘

┌───────────────────┐
│     Article 2     │
└───────────────────┘

┌───────────────────┐
│     Article 3     │
└───────────────────┘
```

---

## Empty State

When no articles exist:

```
No articles yet. Check back soon!

[Follow on LinkedIn for Updates]
```

---

## Error Handling

If `articles-index.json` fails to load:

```
Unable to load articles at this time.

[View All Articles]
```

---

## Customization

### Change Number of Articles Displayed

Edit `js/load-articles.js`:

```javascript
// Configuration
const MAX_ARTICLES_DESKTOP = 5;  // Change to desired number
const MAX_ARTICLES_MOBILE = 3;   // Change to desired number
```

### Change Responsive Breakpoint

Edit `js/load-articles.js`:

```javascript
// Mobile breakpoint (default: 768px)
if (window.innerWidth < 768) {  // Change this value
  return MAX_ARTICLES_MOBILE;
}
```

### Customize Article Card Styles

Edit `css/articles.css` to modify:
- Card layout
- Colors
- Spacing
- Hover effects
- Responsive breakpoints

---

## Troubleshooting

### Articles not showing on homepage

**Check:**
1. Does `articles-index.json` exist?
2. Is it valid JSON? (open and validate)
3. Check browser console for JavaScript errors
4. Verify articles have required metadata

### Index not updating automatically

**Check:**
1. GitHub Actions tab for workflow status
2. Did the workflow run successfully?
3. Was `articles-index.json` committed?
4. Pull latest changes: `git pull`

### Wrong articles showing

**Solution:**
1. Manually trigger "Update Articles Index" workflow
2. Verify article metadata (dates especially)
3. Check that articles aren't in `drafts/` or `archive/`

### Styling issues

**Check:**
1. Is `css/articles.css` loaded in `index.html`?
2. Browser cache (hard refresh: Ctrl+F5)
3. Check for CSS conflicts with existing styles

---

## Integration with LinkedIn Sync

The articles display system works seamlessly with the LinkedIn sync system:

1. **Write article** → saves to `article/`
2. **Push to GitHub** → triggers TWO workflows:
   - LinkedIn posting (posts to LinkedIn)
   - Articles index update (updates homepage)
3. **Result:**
   - Article posted to LinkedIn
   - Article appears on homepage
   - Both systems stay in sync

---

## Performance

- **JSON file size:** ~1-2KB per 10 articles
- **Load time:** < 100ms (cached after first load)
- **No database:** Static JSON file
- **No server calls:** Pure client-side loading
- **SEO friendly:** Articles indexed by search engines

---

## Future Enhancements

Potential additions:

1. **Search/Filter:** Add search box and category filters
2. **Pagination:** Load more articles on scroll
3. **Featured Articles:** Pin specific articles to top
4. **Reading Time:** Display estimated reading time
5. **Tags:** Multi-tag support beyond single category
6. **Social Share:** Share buttons on each card
7. **View Count:** Track article views (requires analytics)

---

## Related Documentation

- **Article creation:** `article/README.md`
- **LinkedIn sync:** `LINKEDIN_SYNC_GUIDE.md`
- **Article workflow:** `ARTICLE_WORKFLOW.md`
- **Quick start:** `QUICK_START.md`

---

## Summary

✅ **Automatic:** Articles display updates on every push
✅ **Responsive:** 5 on desktop, 3 on mobile
✅ **Fast:** Static JSON, no database queries
✅ **Integrated:** Works with LinkedIn sync system
✅ **Maintainable:** Single source of truth (article HTML files)

Your homepage now has a fully automated, responsive article display system! 🎉
