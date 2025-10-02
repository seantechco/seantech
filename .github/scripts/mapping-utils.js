const fs = require('fs');
const path = require('path');

const MAPPING_FILE = path.join(__dirname, 'article-linkedin-map.json');

/**
 * Load the article-to-LinkedIn mapping database
 */
function loadMapping() {
  try {
    if (!fs.existsSync(MAPPING_FILE)) {
      return {
        version: '1.0.0',
        lastUpdated: null,
        articles: []
      };
    }
    const data = fs.readFileSync(MAPPING_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading mapping file:', error.message);
    return {
      version: '1.0.0',
      lastUpdated: null,
      articles: []
    };
  }
}

/**
 * Save the mapping database
 */
function saveMapping(mapping) {
  try {
    mapping.lastUpdated = new Date().toISOString();
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2), 'utf-8');
    console.log(`💾 Mapping database saved: ${mapping.articles.length} articles tracked`);
  } catch (error) {
    console.error('Error saving mapping file:', error.message);
    throw error;
  }
}

/**
 * Find article entry by file path
 */
function findArticle(mapping, filePath) {
  return mapping.articles.find(a => a.file === filePath);
}

/**
 * Add or update article mapping
 */
function upsertArticle(mapping, articleData) {
  const existingIndex = mapping.articles.findIndex(a => a.file === articleData.file);

  if (existingIndex >= 0) {
    // Update existing entry
    mapping.articles[existingIndex] = {
      ...mapping.articles[existingIndex],
      ...articleData,
      lastUpdated: new Date().toISOString()
    };
    console.log(`✏️  Updated mapping: ${articleData.file}`);
  } else {
    // Add new entry
    mapping.articles.push({
      ...articleData,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    });
    console.log(`➕ Added mapping: ${articleData.file}`);
  }

  return mapping;
}

/**
 * Remove article mapping
 */
function removeArticle(mapping, filePath) {
  const originalLength = mapping.articles.length;
  mapping.articles = mapping.articles.filter(a => a.file !== filePath);

  if (mapping.articles.length < originalLength) {
    console.log(`🗑️  Removed mapping: ${filePath}`);
    return true;
  }

  console.log(`⚠️  Article not found in mapping: ${filePath}`);
  return false;
}

/**
 * Get LinkedIn post URN for an article
 */
function getLinkedInUrn(mapping, filePath) {
  const article = findArticle(mapping, filePath);
  return article ? article.linkedinPostUrn : null;
}

/**
 * Get all articles with a specific status
 */
function getArticlesByStatus(mapping, status) {
  return mapping.articles.filter(a => a.status === status);
}

/**
 * Get articles that need engagement sync
 * (returns articles not synced in the last 6 hours)
 */
function getArticlesNeedingSync(mapping, hoursThreshold = 6) {
  const threshold = new Date(Date.now() - hoursThreshold * 60 * 60 * 1000);

  return mapping.articles.filter(a => {
    if (a.status !== 'published') return false;
    if (!a.linkedinPostUrn) return false;
    if (!a.lastEngagementSync) return true;

    const lastSync = new Date(a.lastEngagementSync);
    return lastSync < threshold;
  });
}

/**
 * Update engagement metrics for an article
 */
function updateEngagement(mapping, filePath, engagement) {
  const article = findArticle(mapping, filePath);

  if (article) {
    article.engagement = engagement;
    article.lastEngagementSync = new Date().toISOString();
    console.log(`📊 Updated engagement for ${filePath}:`, engagement);
  }

  return mapping;
}

/**
 * Display mapping statistics
 */
function displayStats(mapping) {
  const stats = {
    total: mapping.articles.length,
    published: mapping.articles.filter(a => a.status === 'published').length,
    draft: mapping.articles.filter(a => a.status === 'draft').length,
    archived: mapping.articles.filter(a => a.status === 'archived').length,
    deleted: mapping.articles.filter(a => a.status === 'deleted').length
  };

  console.log('\n📊 Mapping Database Statistics:');
  console.log(`   Total articles: ${stats.total}`);
  console.log(`   Published: ${stats.published}`);
  console.log(`   Draft: ${stats.draft}`);
  console.log(`   Archived: ${stats.archived}`);
  console.log(`   Deleted: ${stats.deleted}`);
  console.log('');

  return stats;
}

module.exports = {
  loadMapping,
  saveMapping,
  findArticle,
  upsertArticle,
  removeArticle,
  getLinkedInUrn,
  getArticlesByStatus,
  getArticlesNeedingSync,
  updateEngagement,
  displayStats
};
