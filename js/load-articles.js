/**
 * Load and display articles from articles-index.json
 * Responsive hiding handled by CSS media queries
 */

/**
 * Create HTML for a single article card
 */
function createArticleCard(article, index) {
  // All articles use same class - CSS handles responsive hiding
  const colClass = 'article-card mb-40';

  const html = `
    <div class="${colClass}">
      <div class="post latest">
        <div class="post-media">
          <a href="${article.relativePath}">
            <img src="${article.image}" alt="${article.title}">
          </a>
        </div>
        <div class="post-details latest pb-20">
          <h4 class="uppercase pt-15 pb-15">
            <a href="${article.relativePath}">${article.title}</a>
          </h4>
          <div class="post-meta t-center pt-10 pb-10">
            <ul class="clearfix">
              <li class="article-tag"><span class="tag-label">${article.category}</span></li>
            </ul>
          </div>
          <p class="pt-15 pb-20">${article.description}</p>
          <a class="more" href="${article.relativePath}">read more <span>→</span></a>
        </div>
      </div>
    </div>
  `;

  return html;
}

/**
 * Load and display articles
 */
async function loadArticles() {
  const container = document.getElementById('articles-container');

  if (!container) {
    console.error('Articles container not found');
    return;
  }

  try {
    // Fetch articles index
    const response = await fetch('/articles-index.json');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      // No articles found
      container.innerHTML = `
        <div class="col-md-12 t-center">
          <p class="subtitle">No articles yet. Check back soon!</p>
          <p class="mt-20">
            <a class="but brd white" href="https://www.linkedin.com/in/seantechco" target="_blank">
              Follow on LinkedIn for Updates
            </a>
          </p>
        </div>
      `;
      return;
    }

    // Load all 5 articles - CSS handles responsive hiding
    const articlesToShow = data.articles.slice(0, 5);

    console.log(`📚 Loaded ${data.articles.length} articles, displaying up to 5`);

    // Clear loading message
    container.innerHTML = '';

    // Create article cards
    articlesToShow.forEach((article, index) => {
      const cardHtml = createArticleCard(article, index);
      container.insertAdjacentHTML('beforeend', cardHtml);
    });

    console.log('✅ Articles loaded successfully');

  } catch (error) {
    console.error('Error loading articles:', error);

    // Show error message with fallback
    container.innerHTML = `
      <div class="col-md-12 t-center">
        <p class="subtitle">Unable to load articles at this time.</p>
        <p class="mt-20">
          <a class="but brd white" href="blog.html">View All Articles</a>
        </p>
      </div>
    `;
  }
}

// Load articles when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadArticles);
} else {
  loadArticles();
}
