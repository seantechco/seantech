# Drafts Directory

Articles in this directory are posted to LinkedIn as **DRAFT** status.

## What is DRAFT Status?

- **Visibility**: Only YOU can see these posts on LinkedIn
- **Purpose**: Review and preview before publishing publicly
- **Use case**: Test formatting, check for errors, get internal feedback

## How to Use

### 1. Create a Draft Article

```bash
# Copy template to drafts/
cp article/article-template.html article/drafts/my-draft-article.html

# Edit the file with your content
```

### 2. Push to GitHub

```bash
git add article/drafts/my-draft-article.html
git commit -m "Draft: My new article"
git push origin gh-pages
```

### 3. GitHub Actions Posts as DRAFT

The workflow automatically:
- Detects new file in `article/drafts/`
- Posts to LinkedIn with `lifecycleState: DRAFT`
- Only you can see it on your LinkedIn profile

### 4. Review on LinkedIn

1. Go to your LinkedIn profile
2. Look for the draft post (visible only to you)
3. Check formatting, links, and content
4. Make edits if needed

### 5. Publish When Ready

Move the article to the main `/article/` directory:

```bash
git mv article/drafts/my-draft-article.html article/my-draft-article.html
git commit -m "Publish: My new article"
git push origin gh-pages
```

The workflow automatically:
- Detects the file was modified (moved)
- Updates the LinkedIn post to `lifecycleState: PUBLISHED`
- Post becomes public on your network

## Benefits

✅ **Safe testing**: Preview before publishing
✅ **No spam**: Doesn't flood your network with test posts
✅ **Easy workflow**: Just move the file when ready
✅ **Full control**: Edit and refine before going public

## Tips

- Keep drafts in this directory until completely ready
- Use meaningful filenames (they become part of the URL)
- Test all links and images before publishing
- Check LinkedIn preview to ensure proper formatting

## Directory Structure

```
article/
├── drafts/               # Draft articles (LinkedIn DRAFT status)
│   ├── README.md        # This file
│   └── my-draft.html    # Your draft articles
├── archive/             # Archived articles (LinkedIn ARCHIVED status)
└── my-article.html      # Published articles (LinkedIn PUBLISHED status)
```

---

**Workflow Summary:**

1. Create in `/article/drafts/` → LinkedIn **DRAFT** (only you see)
2. Move to `/article/` → LinkedIn **PUBLISHED** (public)
3. Move to `/article/archive/` → LinkedIn **ARCHIVED** (historical)
4. Delete from repo → LinkedIn **DELETED** (removed)
