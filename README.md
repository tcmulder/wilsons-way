# Shelf Runner - Static Site

A React + Vite application configured to build as a static site.

## Development

```bash
npm install
npm run dev
```

## Building Static Site

To build the static site:

```bash
npm run build
```

This will create a `dist/` directory containing all the static files ready for deployment. The output is optimized and minified for production.

## Preview Production Build

To preview the production build locally:

```bash
npm run build
npm run preview
```

## Deployment

The `dist/` folder contains the complete static site and can be deployed to any static hosting service such as:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Any web server

Simply upload the contents of the `dist/` directory to your hosting provider.
