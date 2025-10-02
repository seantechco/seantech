const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { loadMapping, saveMapping, getLinkedInUrn, findArticle, upsertArticle, displayStats } = require('./mapping-utils');

const LINKEDIN_API_BASE = 'https://api.linkedin.com';
const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const PERSON_URN = process.env.LINKEDIN_PERSON_URN;
const SITE_URL = process.env.SITE_URL || 'https://seantech.co';
const UPDATED_ARTICLES_CSV = process.env.UPDATED_ARTICLES || '';

/**
 * Extract metadata from HTML article file
 */
function extractArticleMetadata(htmlFilePath) {
  console.log(`📄 Parsing: ${htmlFilePath}`);

  const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
  const $ = cheerio.load(htmlContent);

  const title = $('meta[property="og:title"]').attr('content')
    || $('title').text().replace(' - Sean Tech Consulting', '').trim()
    || 'New Article';

  const description = $('meta[property="og:description"]').attr('content')
    || $('meta[name="description"]').attr('content')
    || '';

  const category = $('meta[name="article:category"]').attr('content')
    || 'Technology';

  const filename = path.basename(htmlFilePath);
  const articleUrl = `${SITE_URL}/article/${filename}`;

  // Determine lifecycle state based on file path
  const isDraft = htmlFilePath.includes('/drafts/') || htmlFilePath.includes('\\drafts\\');
  const isArchived = htmlFilePath.includes('/archive/') || htmlFilePath.includes('\\archive\\');

  let lifecycleState = 'PUBLISHED';
  let status = 'published';

  if (isDraft) {
    lifecycleState = 'DRAFT';
    status = 'draft';
  } else if (isArchived) {
    lifecycleState = 'ARCHIVED';
    status = 'archived';
  }

  return {
    title,
    description,
    category,
    articleUrl,
    filename,
    lifecycleState,
    status
  };
}

/**
 * Create LinkedIn post text
 */
function createPostText(metadata) {
  const { title, description, articleUrl, category } = metadata;

  let postText = `${title}\n\n`;

  if (description) {
    const excerpt = description.length > 250
      ? description.substring(0, 247) + '...'
      : description;
    postText += `${excerpt}\n\n`;
  }

  postText += `Read the full article: ${articleUrl}\n\n`;
  postText += `#${category.replace(/\s+/g, '')} #TechConsulting`;

  return postText;
}

/**
 * Update LinkedIn post
 */
async function updateLinkedInPost(postUrn, metadata) {
  console.log(`\n✏️  Updating LinkedIn post: ${postUrn}`);
  console.log(`   Title: ${metadata.title}`);
  console.log(`   Status: ${metadata.lifecycleState}`);

  const postText = createPostText(metadata);

  console.log('\n📝 Updated post preview:');
  console.log('─'.repeat(50));
  console.log(postText);
  console.log('─'.repeat(50));

  // Prepare update payload
  // LinkedIn PATCH allows updating specific fields
  const updateData = {
    patch: {
      $set: {
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: postText
            },
            shareMediaCategory: 'ARTICLE',
            media: [
              {
                status: 'READY',
                originalUrl: metadata.articleUrl,
                title: {
                  text: metadata.title
                },
                description: {
                  text: metadata.description || metadata.title
                }
              }
            ]
          }
        },
        lifecycleState: metadata.lifecycleState
      }
    }
  };

  const headers = {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
    'LinkedIn-Version': '202304'
  };

  try {
    // LinkedIn UPDATE endpoint
    await axios.post(
      `${LINKEDIN_API_BASE}/v2/ugcPosts/${encodeURIComponent(postUrn)}`,
      updateData,
      {
        headers,
        params: { action: 'update' }
      }
    );

    console.log('✅ Successfully updated on LinkedIn');
    return true;
  } catch (error) {
    console.error('❌ Error updating LinkedIn post:', error.message);
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
  console.log('✏️  LinkedIn Article Updater');
  console.log('═'.repeat(50));

  // Validate credentials
  if (!ACCESS_TOKEN || !PERSON_URN) {
    console.error('❌ Missing LinkedIn credentials');
    console.error('   Required: LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSON_URN');
    process.exit(1);
  }

  // Load mapping database
  let mapping = loadMapping();
  displayStats(mapping);

  // Parse updated article paths from CSV
  if (!UPDATED_ARTICLES_CSV || UPDATED_ARTICLES_CSV.trim() === '') {
    console.log('ℹ️  No articles to update');
    return;
  }

  const updatedPaths = UPDATED_ARTICLES_CSV.split(',').filter(p => p.trim());
  console.log(`📚 Found ${updatedPaths.length} article(s) to update\n`);

  let successCount = 0;
  let failCount = 0;
  let notFoundCount = 0;

  for (const articlePath of updatedPaths) {
    try {
      const path = articlePath.trim();
      const fullPath = require('path').join(process.cwd(), path);

      if (!fs.existsSync(fullPath)) {
        console.error(`⚠️  File not found: ${path}`);
        failCount++;
        continue;
      }

      // Look up LinkedIn post URN
      const linkedinUrn = getLinkedInUrn(mapping, path);

      if (!linkedinUrn) {
        console.log(`⚠️  Article not found in mapping database: ${path}`);
        console.log('   Tip: This article may need to be posted first (not updated)');
        notFoundCount++;
        continue;
      }

      // Extract updated metadata
      const metadata = extractArticleMetadata(fullPath);

      // Update on LinkedIn
      await updateLinkedInPost(linkedinUrn, metadata);

      // Update mapping database
      const existing = findArticle(mapping, path);
      mapping = upsertArticle(mapping, {
        ...existing,
        file: path,
        linkedinPostUrn: linkedinUrn,
        status: metadata.status,
        lifecycleState: metadata.lifecycleState,
        title: metadata.title,
        articleUrl: metadata.articleUrl,
        lastUpdated: new Date().toISOString()
      });

      successCount++;

      // Rate limiting: wait 2 seconds between updates
      if (updatedPaths.length > 1) {
        console.log('\n⏳ Waiting 2s before next update...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

    } catch (error) {
      console.error(`\n❌ Failed to update article: ${articlePath}`);
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
  console.log(`   ✅ Successfully updated: ${successCount}`);
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
