# 🚀 Quick Start: Get Your LinkedIn Tokens

You're almost there! You just need to get your **OAuth Access Token** and **Person URN**.

---

## ⚡ Fast Track (5 minutes)

### Step 1: Run the Token Helper
```bash
npm run get-token
```

This will guide you through the process and open the OAuth tool.

---

### Step 2: Get Your Access Token

**Quick Link:** https://www.linkedin.com/developers/tools/oauth

1. **Select your app:** "Sean Tech Website Integration" (or whatever you named it)
2. **Select scopes** (check these boxes):
   - ☑️ `openid`
   - ☑️ `profile`
   - ☑️ `w_member_social`
3. **Click:** "Request Access Token"
4. **Authorize** when prompted
5. **Copy** the access token (starts with `AQV...`)

---

### Step 3: Get Your Person URN

Open PowerShell/Terminal and run:

```bash
# Replace YOUR_TOKEN with the token from Step 2
curl -X GET "https://api.linkedin.com/v2/userinfo" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response will look like:**
```json
{
  "sub": "aBcD1234567890",  <-- This is your Person URN!
  "name": "Sean Tech",
  ...
}
```

The `sub` value is your person ID. Your Person URN is: `urn:li:person:aBcD1234567890`

---

### Step 4: Update `.env` File

Edit `.env` and replace the placeholders:

```env
LINKEDIN_ACCESS_TOKEN=AQV...your_actual_token_here
LINKEDIN_PERSON_URN=urn:li:person:aBcD1234567890
```

---

### Step 5: Test It!

```bash
npm run sync-linkedin
```

You should see:
```
✅ Profile data fetched
✅ Fetched X posts
✅ LinkedIn data synced successfully
```

Check that `data/linkedin.json` was created!

---

## 🔍 Troubleshooting

### "Invalid token" error
- Your app might not have the required products enabled
- Go to: https://www.linkedin.com/developers/apps → Your App → Products tab
- Request: "Sign In with LinkedIn using OpenID Connect" + "Share on LinkedIn"

### "No posts found"
- Make sure you have public posts on your LinkedIn profile
- The API only fetches posts you've created, not shared content

### "Access denied"
- Make sure all 3 scopes are selected: `openid`, `profile`, `w_member_social`
- Re-generate the access token with all scopes checked

---

## ✅ Once It Works

### Add to GitHub Secrets
1. Go to: https://github.com/[your-username]/seantech/settings/secrets/actions
2. Click "New repository secret"
3. Add two secrets:
   - Name: `LINKEDIN_ACCESS_TOKEN` | Value: `AQV...`
   - Name: `LINKEDIN_PERSON_URN` | Value: `urn:li:person:...`

### Commit and Deploy
```bash
git add .
git commit -m "LinkedIn integration ready"
git push origin gh-pages
```

### Trigger First Sync
1. Go to: Actions tab on GitHub
2. Select "Sync LinkedIn Data"
3. Click "Run workflow"
4. Wait ~30 seconds
5. Check that `data/linkedin.json` appears in your repo

---

## 🎉 You're Live!

Visit **https://seantech.co** and your LinkedIn posts will be displayed!

The site will auto-update daily at midnight UTC with your latest posts.

---

**Need help?** Check `LINKEDIN_SETUP.md` for detailed instructions.
