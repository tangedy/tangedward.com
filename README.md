# tangedward.com

Edward Tang's portfolio, built with React and TypeScript.

## Local Development

```bash
npm install
npm start
```

The development site runs at `http://localhost:3000`.

## Routes

- `/` - Home
- `/about` - Background, skills, and experience
- `/projects` - Selected work
- `/contact` - Contact links

## Validation

```bash
npm test -- --watchAll=false
npm run build
```

## Deployment

The site is configured for Vercel. `vercel.json` sends client-side routes to the React entry point so direct visits and refreshes work correctly.