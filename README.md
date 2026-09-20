# GS False Ceiling Works

## Development Setup

1. Clone the repository
2. Run \`npm install\`
3. Copy \`.env.example\` to \`.env\` and add your Supabase credentials
4. Run \`npm run dev\`

## Supabase Setup
1. Create a new Supabase project.
2. Go to SQL Editor and run the script found in \`supabase/schema.sql\`.
3. Disable Public Signups in Authentication Settings.
4. Manually create an Owner user in the Auth -> Users tab.
5. Copy that User's UUID and insert it into the \`app_owner\` table.
6. Create storage buckets named \`logos\` and \`works\`.

## Deployment
This project is built with Vite.
Deploy to Cloudflare Pages or Netlify by pushing to a GitHub repository and pointing the host to:
- Build command: \`npm run build\`
- Build output directory: \`dist\`

Make sure to set the Environment Variables \`VITE_SUPABASE_URL\` and \`VITE_SUPABASE_ANON_KEY\` in your hosting provider's dashboard.

Also, set the Redirect URLs in Supabase Auth to match your live domain.

### Keep Alive
Supabase free tier pauses after 1 week of inactivity. A GitHub Action has been added (\`.github/workflows/keep-alive.yml\`). You must set \`SUPABASE_URL\` and \`SUPABASE_ANON_KEY\` in your GitHub repository secrets to keep the database awake.
