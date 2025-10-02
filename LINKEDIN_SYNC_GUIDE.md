# LinkedIn Bidirectional Sync - Complete Guide

## Overview

Your site now has **full bidirectional sync** with LinkedIn, supporting the complete article lifecycle:

| Operation | Trigger | LinkedIn Action | Status |
|-----------|---------|----------------|--------|
| **CREATE** | Add new article | Post to LinkedIn | ✅ Implemented |
| **READ** | (Manual) | View engagement metrics | 🚧 Phase 2 |
| **UPDATE** | Modify article | Update LinkedIn post | ✅ Implemented |
| **DELETE** | Remove article | Delete LinkedIn post | ✅ Implemented |

## Article Lifecycle States

### 1. DRAFT (Private Preview)
**Location:** `/article/drafts/`

```bash
# Create draft
cp article/article-template.html article/drafts/my-draft.html
git add article/drafts/my-draft.html
git push
```

**Result:**
- ✅ Posted to LinkedIn as **DRAFT**
- ✅ Only YOU can see it
- ✅ Safe for reviewing and testing
- ✅ Won't spam your network

### 2. PUBLISHED (Public)
**Location:** `/article/`

```bash
# Publish draft (move from drafts/)
git mv article/drafts/my-draft.html article/my-article.html
git push

# OR create directly as published
cp article/article-template.html article/my-article.html
git add article/my-article.html
git push
```

**Result:**
- ✅ Posted/Updated to LinkedIn as **PUBLISHED**
- ✅ Visible to your entire network
- ✅ Appears in feed
- ✅ Tracked in mapping database

### 3. ARCHIVED (Historical)
**Location:** `/article/archive/`

```bash
# Archive old article
git mv article/old-article.html article/archive/old-article.html
git push
```

**Result:**
- ✅ Updated on LinkedIn to **ARCHIVED**
- ✅ Still visible but de-emphasized
- ✅ Good for outdated but valuable content

### 4. DELETED (Removed)
**Action:** Delete file from repository

```bash
# Delete article completely
git rm article/my-article.html
git push
```

**Result:**
- ✅ Deleted from LinkedIn completely
- ✅ Removed from your profile
- ✅ Mapping updated to track deletion

---

## Complete Workflows

### Workflow 1: Draft → Review → Publish

**Use Case:** Write article, preview on LinkedIn privately, then publish

```bash
# Step 1: Create draft
cp article/article-template.html article/drafts/ai-trends-2024.html
# Edit the file...
git add article/drafts/ai-trends-2024.html
git commit -m "Draft: AI Trends 2024"
git push

# LinkedIn posts as DRAFT (only you see it)

# Step 2: Review on LinkedIn
# Check your LinkedIn profile, verify formatting

# Step 3: Publish when ready
git mv article/drafts/ai-trends-2024.html article/ai-trends-2024.html
git commit -m "Publish: AI Trends 2024"
git push

# LinkedIn updates to PUBLISHED (everyone sees it)
```

### Workflow 2: Direct Publish (No Draft)

**Use Case:** Confident in content, publish immediately

```bash
cp article/article-template.html article/my-article.html
# Edit the file...
git add article/my-article.html
git commit -m "Add article: My Article"
git push

# LinkedIn posts as PUBLISHED immediately
```

### Workflow 3: Update Existing Article

**Use Case:** Fix typo, update information, change title

```bash
# Edit existing article
vim article/my-article.html
# Make changes...

git add article/my-article.html
git commit -m "Update: Fix typo in My Article"
git push

# LinkedIn post updates automatically (same post, new content)
```

### Workflow 4: Archive Old Content

**Use Case:** Article is outdated but worth keeping for reference

```bash
git mv article/2023-predictions.html article/archive/2023-predictions.html
git commit -m "Archive: 2023 predictions"
git push

# LinkedIn post marked as ARCHIVED
```

### Workflow 5: Delete Mistake

**Use Case:** Posted wrong content, need to remove completely

```bash
git rm article/mistake.html
git commit -m "Remove: Incorrect article"
git push

# LinkedIn post deleted completely
```

---

## Mapping Database

### What It Tracks

The file `.github/scripts/article-linkedin-map.json` tracks:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2024-01-15T10:30:00Z",
  "articles": [
    {
      "file": "article/my-article.html",
      "linkedinPostUrn": "urn:li:ugcPost:123456789",
      "postedAt": "2024-01-15T10:00:00Z",
      "lastUpdated": "2024-01-20T14:00:00Z",
      "status": "published",
      "lifecycleState": "PUBLISHED",
      "title": "My Article Title",
      "articleUrl": "https://seantech.co/article/my-article.html"
    }
  ]
}
```

### Why It's Important

1. **Enables Updates**: Knows which LinkedIn post to update
2. **Enables Deletions**: Knows which LinkedIn post to delete
3. **Prevents Duplicates**: Skips already-posted articles
4. **Tracks Status**: Shows current state of each article
5. **Enables Future Features**: Foundation for analytics, engagement tracking

### Automatic Management

- ✅ **Auto-created** on first post
- ✅ **Auto-updated** on every operation
- ✅ **Auto-committed** back to repository
- ✅ **Version controlled** with your code

---

## GitHub Actions Workflows

### 1. Post to LinkedIn (`post-to-linkedin.yml`)

**Triggers:**
- New `.html` file added to `article/` or subdirectories
- Manual trigger via Actions UI

**What it does:**
1. Detects NEW files (not modified)
2. Extracts metadata from HTML
3. Posts to LinkedIn
4. Saves post URN to mapping database
5. Commits mapping database

### 2. Update LinkedIn (`update-linkedin.yml`)

**Triggers:**
- Existing `.html` file modified in `article/` or subdirectories
- Manual trigger via Actions UI

**What it does:**
1. Detects MODIFIED files (not new)
2. Looks up LinkedIn post URN from mapping
3. Extracts updated metadata
4. Updates LinkedIn post
5. Updates mapping database

### 3. Delete from LinkedIn (`delete-from-linkedin.yml`)

**Triggers:**
- `.html` file deleted from `article/` or subdirectories
- Manual trigger via Actions UI

**What it does:**
1. Detects DELETED files
2. Looks up LinkedIn post URN from mapping
3. Deletes LinkedIn post
4. Updates mapping database (marks as deleted)

---

## Manual Workflow Triggers

All workflows can be manually triggered from GitHub Actions UI:

### Post Manually
```
1. Go to: Actions → "Post Article to LinkedIn"
2. Click: "Run workflow"
3. Enter: article/my-article.html
4. Click: "Run workflow"
```

### Update Manually
```
1. Go to: Actions → "Update Article on LinkedIn"
2. Click: "Run workflow"
3. Enter: article/my-article.html
4. Click: "Run workflow"
```

### Delete Manually
```
1. Go to: Actions → "Delete Article from LinkedIn"
2. Click: "Run workflow"
3. Enter: article/my-article.html
4. Click: "Run workflow"
```

---

## Advanced Features

### Duplicate Detection

The system automatically prevents duplicate posts:

```bash
# First time: Posts to LinkedIn
git add article/my-article.html
git push

# Second time: Skips (already posted)
git push  # No action taken
```

Console output:
```
⏭️  Skipping article/my-article.html - already posted (URN: urn:li:ugcPost:123...)
```

### Lifecycle State Management

Articles automatically transition based on location:

| From | To | Action | LinkedIn Status |
|------|-----|--------|----------------|
| drafts/ | article/ | Move file | DRAFT → PUBLISHED |
| article/ | archive/ | Move file | PUBLISHED → ARCHIVED |
| archive/ | article/ | Move file | ARCHIVED → PUBLISHED |
| * | (deleted) | Delete file | * → DELETED |

### Rate Limiting

Built-in rate limiting prevents LinkedIn API throttling:

- **Posts**: 2-second delay between multiple posts
- **Updates**: 2-second delay between multiple updates
- **Deletes**: 1-second delay between multiple deletions
- **Daily limit**: 150 operations per day (LinkedIn API limit)

---

## Troubleshooting

### Article not posting to LinkedIn

**Check:**
1. Is file in correct directory? (`article/`, `article/drafts/`, etc.)
2. Is filename correct? (ends in `.html`)
3. Check GitHub Actions logs for errors
4. Verify secrets are set: `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_PERSON_URN`

### Update not working

**Check:**
1. Is article already in mapping database?
2. Did you actually modify the file? (git must detect changes)
3. Check Actions log: "No modified articles detected"
4. Try manual trigger from Actions UI

### Duplicate posts on LinkedIn

**This shouldn't happen** - the system prevents duplicates. If it does:
1. Check mapping database: `.github/scripts/article-linkedin-map.json`
2. Verify article path matches exactly
3. Manually delete duplicate from LinkedIn
4. Update mapping database with correct URN

### Mapping database not updating

**Check:**
1. GitHub Actions has write permissions
2. Check commit logs for "[automated]" commits
3. Pull latest changes: `git pull`
4. Check Actions log for commit errors

---

## Best Practices

### 1. Always Use Drafts for Important Articles

```bash
# Good: Draft first, review, then publish
article/drafts/important-announcement.html → review → article/important-announcement.html

# Risky: Direct publish without review
article/important-announcement.html → public immediately
```

### 2. Keep Article Metadata Updated

Ensure these meta tags are always accurate:
```html
<meta property="og:title" content="Current, accurate title">
<meta property="og:description" content="Current, accurate description">
<meta name="article:published_time" content="2024-01-15">
```

### 3. Archive, Don't Delete (Usually)

```bash
# Preferred: Archive (keeps historical record)
git mv article/old.html article/archive/old.html

# Only when necessary: Delete
git rm article/wrong.html
```

### 4. Commit Messages Should Be Clear

```bash
# Good
git commit -m "Draft: AI Trends in Healthcare 2024"
git commit -m "Publish: AI Trends in Healthcare 2024"
git commit -m "Update: Fix typo in introduction"
git commit -m "Archive: Outdated 2023 predictions"

# Bad
git commit -m "update"
git commit -m "changes"
```

### 5. Pull Before Push

```bash
# Always pull first to get mapping database updates
git pull
git add article/my-article.html
git commit -m "Add: My article"
git push
```

---

## Directory Structure

```
article/
├── drafts/                          # DRAFT status articles
│   ├── README.md                    # How to use drafts
│   └── work-in-progress.html       # Your draft articles
│
├── archive/                         # ARCHIVED status articles
│   ├── README.md                    # How to use archive
│   ├── 2023/                       # Optional: organize by year
│   └── old-article.html            # Your archived articles
│
├── article-template.html            # Template for new articles
├── README.md                        # Main article instructions
├── my-article.html                  # PUBLISHED articles
└── another-article.html

.github/
├── workflows/
│   ├── post-to-linkedin.yml        # CREATE workflow
│   ├── update-linkedin.yml         # UPDATE workflow
│   └── delete-from-linkedin.yml    # DELETE workflow
│
└── scripts/
    ├── post-to-linkedin.js         # CREATE script
    ├── update-linkedin.js          # UPDATE script
    ├── delete-from-linkedin.js     # DELETE script
    ├── mapping-utils.js            # Shared utilities
    ├── article-linkedin-map.json   # Article → LinkedIn URN mapping
    └── package.json                # Dependencies
```

---

## Next Steps

### Phase 2 Features (Planned)

**Engagement Tracking:**
- Pull likes, comments, shares from LinkedIn
- Display metrics on article pages
- Weekly engagement reports

**Rich Media:**
- Auto-extract featured images
- Upload images to LinkedIn
- Native image posts (higher engagement)

**Smart Posting:**
- Scheduled publishing (future dates)
- Optimal posting times
- A/B test post variations

**Analytics:**
- Performance dashboard
- Top-performing articles
- Engagement trends

**Multi-Platform:**
- Cross-post to Twitter/X
- Cross-post to Mastodon
- Cross-post to Dev.to

---

## Support

**Documentation:**
- Main workflow guide: `ARTICLE_WORKFLOW.md`
- Article creation: `article/README.md`
- Draft workflow: `article/drafts/README.md`
- Archive workflow: `article/archive/README.md`
- Quick start: `QUICK_START.md`

**Logs & Debugging:**
- GitHub Actions logs: Repo → Actions tab → Select workflow run
- Mapping database: `.github/scripts/article-linkedin-map.json`
- Check secrets: Repo → Settings → Secrets → Actions

---

## Summary

🎉 **Your article publishing system now supports the complete lifecycle:**

1. **DRAFT** → Private preview on LinkedIn
2. **PUBLISHED** → Public on your site + LinkedIn
3. **UPDATE** → Keep LinkedIn in sync with edits
4. **ARCHIVED** → De-emphasize old content
5. **DELETED** → Remove completely

All automated via GitHub Actions. Write once, sync everywhere. 🚀
