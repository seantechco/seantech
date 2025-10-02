const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.SITE_URL || 'https://seantech.co';
const ARTICLES_DIR = path.join(process.cwd(), 'article');
const OUTPUT_FILE = path.join(process.cwd(), 'articles-index.json');

/**
 * Extract metadata from HTML article file
 */
function extractArticleMetadata(htmlFilePath) {
  try {
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
    const $ = cheerio.load(htmlContent);

    // Extract metadata from <meta> tags
    const title = $('meta[property="og:title"]').attr('content')
      || $('title').text().replace(' - Sean Tech Consulting', '').trim()
      || 'Untitled Article';

    const description = $('meta[property="og:description"]').attr('content')
      || $('meta[name="description"]').attr('content')
      || '';

    const publishedDate = $('meta[name="article:published_time"]').attr('content')
      || new Date().toISOString().split('T')[0];

    const category = $('meta[name="article:category"]').attr('content')
      || 'Technology';

    const image = $('meta[property="og:image"]').attr('content')
      || 'img/blog/1.jpg';

    // Make image path relative if it's absolute
    let imagePath = image;
    if (image.startsWith('http')) {
      imagePath = image.replace(SITE_URL + '/', '').replace('https://seantech.co/', '');
    }

    const filename = path.basename(htmlFilePath);
    const relativePath = path.relative(process.cwd(), htmlFilePath).replace(/\\/g, '/');
    const articleUrl = `${SITE_URL}/${relativePath}`;

    return {
      title,
      description,
      publishedDate,
      category,
      image: imagePath,
      filename,
      relativePath,
      articleUrl
    };
  } catch (error) {
    console.error(`Error parsing ${htmlFilePath}:`, error.message);
    return null;
  }
}

/**
 * Check if file should be included in index
 */
function shouldIncludeFile(filePath) {
  const filename = path.basename(filePath);
  const relativePath = path.relative(ARTICLES_DIR, filePath);

  // Exclude template
  if (filename === 'article-template.html') {
    return false;
  }

  // Exclude drafts and archive directories
  if (relativePath.includes('drafts') || relativePath.includes('archive')) {
    return false;
  }

  // Only include .html files
  if (!filename.endsWith('.html')) {
    return false;
  }

  return true;
}

/**
 * Recursively scan directory for HTML files
 */
function scanDirectory(dir) {
  let articles = [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip drafts and archive directories
      if (entry.name === 'drafts' || entry.name === 'archive') {
        continue;
      }
      // Recursively scan subdirectories
      articles = articles.concat(scanDirectory(fullPath));
    } else if (entry.isFile()) {
      if (shouldIncludeFile(fullPath)) {
        articles.push(fullPath);
      }
    }
  }

  return articles;
}

/**
 * Main execution
 */
function main() {
  console.log('📚 Generating Articles Index');
  console.log('═'.repeat(50));

  // Check if articles directory exists
  if (!fs.existsSync(ARTICLES_DIR)) {
    console.log('⚠️  Articles directory not found, creating empty index');
    const emptyIndex = {
      generated: new Date().toISOString(),
      count: 0,
      articles: []
    };
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(emptyIndex, null, 2));
    return;
  }

  // Scan for articles
  console.log(`📁 Scanning: ${ARTICLES_DIR}`);
  const articleFiles = scanDirectory(ARTICLES_DIR);
  console.log(`📄 Found ${articleFiles.length} article(s)\n`);

  // Extract metadata from each article
  const articles = [];
  for (const filePath of articleFiles) {
    console.log(`   Processing: ${path.basename(filePath)}`);
    const metadata = extractArticleMetadata(filePath);
    if (metadata) {
      articles.push(metadata);
    }
  }

  // Sort by published date (newest first)
  articles.sort((a, b) => {
    return new Date(b.publishedDate) - new Date(a.publishedDate);
  });

  // Create index object
  const index = {
    generated: new Date().toISOString(),
    count: articles.length,
    articles: articles
  };

  // Write to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));

  console.log(`\n✅ Articles index generated`);
  console.log(`📊 Total articles: ${articles.length}`);
  console.log(`📄 Output: ${OUTPUT_FILE}`);

  // Display article list
  if (articles.length > 0) {
    console.log('\n📋 Articles in index:');
    articles.forEach((article, i) => {
      console.log(`   ${i + 1}. ${article.title} (${article.publishedDate})`);
    });
  }

  console.log('\n' + '═'.repeat(50));
}

main();
