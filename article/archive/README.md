# Archive Directory

Articles in this directory are marked as **ARCHIVED** on LinkedIn.

## What is ARCHIVED Status?

- **Visibility**: Post remains on LinkedIn but marked as archived
- **Purpose**: Historical content that's no longer current
- **Use case**: Outdated information, superseded articles, old announcements

## When to Archive

Archive articles when:
- ✅ Information is outdated but worth keeping
- ✅ Article has been replaced by a newer version
- ✅ Content is no longer relevant but has historical value
- ✅ You want to de-emphasize without deleting

## How to Archive an Article

### Move from Published to Archive

```bash
# Move article to archive directory
git mv article/my-old-article.html article/archive/my-old-article.html

git commit -m "Archive: My old article"
git push origin gh-pages
```

### GitHub Actions Updates Status

The workflow automatically:
- Detects file moved to `article/archive/`
- Updates LinkedIn post to `lifecycleState: ARCHIVED`
- Post remains accessible but marked as archived

## Archive vs Delete

| Action | LinkedIn Status | Visibility | Use Case |
|--------|----------------|------------|----------|
| **Archive** | ARCHIVED | Still visible but de-emphasized | Outdated but valuable for reference |
| **Delete** | DELETED | Completely removed | Wrong information, no longer relevant |

### When to Archive:
- Old product announcements (product still exists but announcement is old)
- Superseded how-to guides (old version still useful for reference)
- Event recaps (event is over but recap has historical value)
- Previous year's trends (useful for comparison)

### When to Delete:
- Incorrect information
- Duplicate posts
- Content you want completely removed
- Accidental posts

## Restoring from Archive

To restore an archived article:

```bash
# Move back to main article directory
git mv article/archive/my-old-article.html article/my-old-article.html

git commit -m "Restore: My old article"
git push origin gh-pages
```

The workflow automatically updates LinkedIn to `PUBLISHED` status.

## Directory Structure

```
article/
├── drafts/               # Draft articles (LinkedIn DRAFT)
├── archive/             # Archived articles (LinkedIn ARCHIVED)
│   ├── README.md        # This file
│   └── old-article.html # Your archived articles
└── my-article.html      # Published articles (LinkedIn PUBLISHED)
```

## Best Practices

1. **Add archive date**: Update article metadata when archiving
   ```html
   <meta name="article:archived_date" content="2024-01-15">
   ```

2. **Add archive notice**: Add a notice at the top of archived articles
   ```html
   <div class="archive-notice">
     ⚠️ This article was archived on January 15, 2024 and may contain outdated information.
   </div>
   ```

3. **Link to newer content**: If there's a replacement article, link to it
   ```html
   <p>📝 For updated information, see: <a href="new-article.html">New Article Title</a></p>
   ```

4. **Organize by year**: Consider subdirectories
   ```
   archive/
   ├── 2023/
   ├── 2024/
   └── 2025/
   ```

---

**Complete Article Lifecycle:**

1. **Draft** (`/article/drafts/`) → LinkedIn DRAFT (private preview)
2. **Published** (`/article/`) → LinkedIn PUBLISHED (public)
3. **Archived** (`/article/archive/`) → LinkedIn ARCHIVED (de-emphasized)
4. **Deleted** (removed from repo) → LinkedIn DELETED (removed entirely)
