# Articles Directory

This directory contains blog articles for Sean Tech Consulting.

## How to Add a New Article

### 1. Create Your Article

1. **Copy the template:**
   ```bash
   cp article/article-template.html article/your-article-slug.html
   ```

2. **Edit the metadata** in the `<head>` section:
   ```html
   <title>Your Article Title - Sean Tech Consulting</title>
   <meta name="description" content="Your article excerpt (150-200 chars)">
   <meta name="article:published_time" content="2024-01-15">
   <meta name="article:category" content="Technology">

   <!-- Update Open Graph tags -->
   <meta property="og:title" content="Your Article Title">
   <meta property="og:description" content="Your article excerpt">
   <meta property="og:url" content="https://seantech.co/article/your-article-slug.html">
   <meta property="og:image" content="https://seantech.co/img/blog/1.jpg">
   ```

3. **Update the article title** in the page:
   - Line ~164: `<h2 class="title">Your Article Title</h2>`
   - Line ~207: `<h4 class="uppercase pt-15 pb-15">Your Article Title</h4>`

4. **Update the date**:
   - Line ~221: `<li class="date">January 15, 2024</li>`

5. **Write your content** between the `<!-- ARTICLE CONTENT STARTS HERE -->` and `<!-- ARTICLE CONTENT ENDS HERE -->` comments.

### 2. Add to Blog Listing Page

Manually add your article to `blog.html`:

```html
<!--Post-->
<div class="post mb-60">
  <!--Post media-->
  <div class="post-media">
    <img src="img/blog/1.jpg" alt=""/>
  </div>
  <!--End post media-->

  <!--Post details-->
  <div class="post-details bg-white pb-20">
    <h4 class="uppercase pt-15 pb-15">
      <a href="article/your-article-slug.html">Your Article Title</a>
    </h4>

    <!--Post meta-->
    <div class="post-meta t-center pt-10 pb-10">
      <ul class="clearfix">
        <li class="date">January 15, 2024</li>
        <li><i class="icon-user-1"></i><span>by<a href="#"> Sean Tech</a></span></li>
        <li><i class="icon-layout"></i><span>Tagged in<a href="#"> Technology</a></span></li>
      </ul>
    </div>
    <!--End post meta-->

    <p class="pt-15 pb-20">Your article excerpt goes here (1-2 sentences)...</p>

    <a class="more" href="article/your-article-slug.html">read more <span>→</span></a>
  </div>
  <!--End post details-->
</div>
<!--End post-->
```

### 3. Commit and Push

```bash
git add article/your-article-slug.html blog.html
git commit -m "Add new article: Your Article Title"
git push origin gh-pages
```

### 4. Automatic LinkedIn Posting

When you push your article to GitHub:

1. **GitHub Actions automatically detects** the new article in `/article/` directory
2. **Extracts metadata** from your HTML file (title, description, URL)
3. **Posts to LinkedIn** with:
   - Article title
   - Excerpt
   - Link back to seantech.co

**No manual LinkedIn posting needed!** The workflow handles it automatically.

You can also **manually trigger** the LinkedIn post:
1. Go to GitHub repository → Actions tab
2. Select "Post Article to LinkedIn" workflow
3. Click "Run workflow"
4. Enter the article path (e.g., `article/your-article-slug.html`)

## Article Metadata Requirements

For the GitHub Action to work correctly, ensure these meta tags are filled in:

| Meta Tag | Purpose | Example |
|----------|---------|---------|
| `og:title` | LinkedIn post title | "AI Trends in 2024" |
| `og:description` | LinkedIn post excerpt | "Exploring the latest developments..." |
| `article:published_time` | Date | "2024-01-15" |
| `article:category` | Hashtag for LinkedIn | "Technology" |
| `og:url` | Full article URL | "https://seantech.co/article/..." |

## Directory Structure

```
article/
├── README.md                    # This file
├── article-template.html        # Template for new articles
├── your-first-article.html      # Your articles
└── another-article.html
```

## Tips

- **Use descriptive slugs**: `ai-trends-2024.html` not `article1.html`
- **Keep excerpts concise**: 150-200 characters for LinkedIn
- **Add images**: Update `og:image` with a relevant featured image
- **Use hashtags wisely**: Category becomes hashtag (e.g., #Technology)
- **Test locally**: Open HTML file in browser before pushing

## Troubleshooting

### LinkedIn post didn't appear
- Check GitHub Actions tab for workflow status
- Verify `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_PERSON_URN` secrets are set
- Ensure article metadata is complete

### Article doesn't display correctly
- Validate HTML syntax
- Check that image paths are relative to `/article/` directory (use `../img/...`)

---

For questions or issues, check the [QUICK_START.md](../QUICK_START.md) guide.
