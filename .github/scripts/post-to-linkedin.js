const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { loadMapping, saveMapping, upsertArticle, getLinkedInUrn, displayStats } = require('./mapping-utils');

const LINKEDIN_API_BASE = 'https://api.linkedin.com';
const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const PERSON_URN = process.env.LINKEDIN_PERSON_URN;
const SITE_URL = process.env.SITE_URL || 'https://seantech.co';
const ARTICLES_CSV = process.env.ARTICLES || '';

/**
 * Extract metadata from HTML article file
 */
function extractArticleMetadata(htmlFilePath) {
  console.log(`📄 Parsing: ${htmlFilePath}`);

  const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
  const $ = cheerio.load(htmlContent);

  // Extract metadata from <meta> tags and page content
  const title = $('meta[property="og:title"]').attr('content')
    || $('title').text().replace(' - Sean Tech Consulting', '').trim()
    || 'New Article';

  const description = $('meta[property="og:description"]').attr('content')
    || $('meta[name="description"]').attr('content')
    || '';

  const publishedDate = $('meta[name="article:published_time"]').attr('content')
    || new Date().toISOString().split('T')[0];

  const category = $('meta[name="article:category"]').attr('content')
    || 'Technology';

  // Build full URL to the article
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
    publishedDate,
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

  // Format post with title, excerpt, and link
  let postText = `${title}\n\n`;

  if (description) {
    // Trim description to reasonable length for LinkedIn (250 chars)
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
 * Post to LinkedIn using REST API
 */
async function postToLinkedIn(metadata) {
  const statusEmoji = metadata.status === 'draft' ? '📝' : metadata.status === 'archived' ? '📦' : '🚀';
  console.log(`\n${statusEmoji} Posting to LinkedIn: ${metadata.title} [${metadata.lifecycleState}]`);

  const postText = createPostText(metadata);

  console.log('📝 Post preview:');
  console.log('─'.repeat(50));
  console.log(postText);
  console.log('─'.repeat(50));

  // LinkedIn REST API post structure
  const postData = {
    author: PERSON_URN,
    lifecycleState: metadata.lifecycleState,
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
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
    }
  };

  const headers = {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
    'LinkedIn-Version': '202304'
  };

  try {
    const response = await axios.post(
      `${LINKEDIN_API_BASE}/v2/ugcPosts`,
      postData,
      { headers }
    );

    console.log('✅ Posted successfully to LinkedIn');
    console.log(`📊 Post ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error posting to LinkedIn:', error.message);
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
  console.log('🔍 LinkedIn Article Poster');
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

  // Parse article paths from CSV
  if (!ARTICLES_CSV || ARTICLES_CSV.trim() === '') {
    console.log('ℹ️  No articles to post');
    return;
  }

  const articlePaths = ARTICLES_CSV.split(',').filter(p => p.trim());
  console.log(`📚 Found ${articlePaths.length} article(s) to post\n`);

  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  for (const articlePath of articlePaths) {
    try {
      const fullPath = path.join(process.cwd(), articlePath.trim());

      if (!fs.existsSync(fullPath)) {
        console.error(`⚠️  File not found: ${articlePath}`);
        failCount++;
        continue;
      }

      // Check if article already exists in mapping
      const existingUrn = getLinkedInUrn(mapping, articlePath.trim());
      if (existingUrn) {
        console.log(`⏭️  Skipping ${articlePath} - already posted (URN: ${existingUrn})`);
        skippedCount++;
        continue;
      }

      // Extract metadata and post
      const metadata = extractArticleMetadata(fullPath);
      const response = await postToLinkedIn(metadata);

      // Save to mapping database
      mapping = upsertArticle(mapping, {
        file: articlePath.trim(),
        linkedinPostUrn: response.id,
        status: metadata.status,
        lifecycleState: metadata.lifecycleState,
        postedAt: new Date().toISOString(),
        title: metadata.title,
        articleUrl: metadata.articleUrl
      });

      successCount++;

      // Rate limiting: wait 2 seconds between posts
      if (articlePaths.length > 1) {
        console.log('\n⏳ Waiting 2s before next post...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

    } catch (error) {
      console.error(`\n❌ Failed to post article: ${articlePath}`);
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
  console.log(`   ✅ Successfully posted: ${successCount}`);
  console.log(`   ⏭️  Skipped (already posted): ${skippedCount}`);
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
