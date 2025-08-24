# Vercel Deployment Setup

## Prerequisites
- Vercel account
- GitHub repository connected to Vercel

## Deployment Steps

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: add Vercel deployment config"
   git push origin main
   ```

2. **Import Project in Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Import Project"
   - Select your GitHub repository
   - Choose the `Frontend` folder as the root directory

3. **Configure Build Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build:vercel`
   - **Output Directory**: `dist/spa`

4. **Environment Variables**:
   Set these in Vercel Dashboard → Project Settings → Environment Variables:
   ```
   VITE_API_URL=your-backend-api-url
   ```

   For testing with your local backend:
   ```
   VITE_API_URL=http://localhost:5050/api
   ```

## File Structure
```
Frontend/
├── vercel.json          # Vercel configuration
├── vite.config.ts       # Main Vite config (for SPA)
├── vite.config.server.ts # Server config (not used in Vercel)
├── package.json         # Build scripts
└── dist/spa/           # Build output (auto-generated)
```

## Build Commands
- `npm run build:vercel` - Build for Vercel deployment
- `npm run build:client` - Build client only
- `npm run build` - Build both client and server (for local development)

## Configuration Files

### vercel.json
- Configures build command and output directory
- Sets up SPA routing (all routes → index.html)
- Optimizes static asset caching

### vite.config.ts
- Main Vite configuration for SPA build
- Sets output directory to `dist/spa`
- Configures path aliases

## Notes
- The frontend will be deployed as a static SPA
- You'll need a separate backend deployment for the API
- All routes are handled client-side (SPA routing)
