const axios = require('axios');
const { loadMapping, saveMapping, getLinkedInUrn, upsertArticle, displayStats } = require('./mapping-utils');

const LINKEDIN_API_BASE = 'https://api.linkedin.com';
const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const DELETED_ARTICLES_CSV = process.env.DELETED_ARTICLES || '';

/**
 * Delete a LinkedIn post by URN
 */
async function deleteLinkedInPost(postUrn) {
  console.log(`\n🗑️  Deleting LinkedIn post: ${postUrn}`);

  const headers = {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'X-Restli-Protocol-Version': '2.0.0',
    'LinkedIn-Version': '202304'
  };

  try {
    await axios.delete(
      `${LINKEDIN_API_BASE}/v2/ugcPosts/${encodeURIComponent(postUrn)}`,
      { headers }
    );

    console.log('✅ Successfully deleted from LinkedIn');
    return true;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('ℹ️  Post already deleted or not found on LinkedIn');
      return true; // Consider 404 as success (idempotent)
    }

    console.error('❌ Error deleting from LinkedIn:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🗑️  LinkedIn Article Deleter');
  console.log('═'.repeat(50));

  // Validate credentials
  if (!ACCESS_TOKEN) {
    console.error('❌ Missing LINKEDIN_ACCESS_TOKEN');
    process.exit(1);
  }

  // Load mapping database
  let mapping = loadMapping();
  displayStats(mapping);

  // Parse deleted article paths from CSV
  if (!DELETED_ARTICLES_CSV || DELETED_ARTICLES_CSV.trim() === '') {
    console.log('ℹ️  No articles to delete');
    return;
  }

  const deletedPaths = DELETED_ARTICLES_CSV.split(',').filter(p => p.trim());
  console.log(`📚 Found ${deletedPaths.length} article(s) to delete\n`);

  let successCount = 0;
  let failCount = 0;
  let notFoundCount = 0;

  for (const articlePath of deletedPaths) {
    try {
      const path = articlePath.trim();
      console.log(`\n📄 Processing: ${path}`);

      // Look up LinkedIn post URN
      const linkedinUrn = getLinkedInUrn(mapping, path);

      if (!linkedinUrn) {
        console.log('⚠️  Article not found in mapping database - nothing to delete');
        notFoundCount++;
        continue;
      }

      // Delete from LinkedIn
      await deleteLinkedInPost(linkedinUrn);

      // Update mapping database to mark as deleted
      mapping = upsertArticle(mapping, {
        file: path,
        linkedinPostUrn: linkedinUrn,
        status: 'deleted',
        lifecycleState: 'DELETED',
        deletedAt: new Date().toISOString()
      });

      successCount++;

      // Rate limiting: wait 1 second between deletions
      if (deletedPaths.length > 1) {
        console.log('\n⏳ Waiting 1s before next deletion...\n');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (error) {
      console.error(`\n❌ Failed to delete article: ${articlePath}`);
      console.error(error.message);
      failCount++;
    }
  }

  // Save mapping database
  if (successCount > 0) {
    saveMapping(mapping);
  }

  // Summary
  console.log('\n' + '═'.repeat(50));
  console.log('📊 Summary:');
  console.log(`   ✅ Successfully deleted: ${successCount}`);
  console.log(`   ⚠️  Not found in mapping: ${notFoundCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log('═'.repeat(50));

  displayStats(mapping);

  if (failCount > 0) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
