# GENSTACKS Documentation

A standalone, beautifully designed documentation site for the GENSTACKS platform.

## Features

- Built with React, TypeScript, and TailwindCSS
- Uses shadcn UI components for consistent design
- Fully responsive and mobile-friendly
- Dark mode support
- Fast and optimized with Vite

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd docs
npm install
```

### Development

```bash
npm run dev
```

The documentation will be available at `http://localhost:5173`

### Building

```bash
npm run build
```

The build output will be in the `dist` directory.

### Preview

```bash
npm run preview
```

## Deployment

This documentation is configured to deploy on Vercel with the CNAME subdomain `docs.genstacks.fun`.

### Deploy with Vercel

1. Push the `genstacksapp` directory to your Git repository
2. Import the project to Vercel
3. In the Vercel dashboard:
   - Set Root Directory to `genstacksapp/docs`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add custom domain: `docs.genstacks.fun`

## Project Structure

```
docs/
├── src/
│   ├── components/
│   │   └── ui/              # shadcn UI components
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── pages/
│   │   └── Docs.tsx         # Main documentation page
│   ├── App.tsx
│   ├── main.tsx
│   ├── App.css
│   ├── index.css            # Global styles
│   └── globals.css          # Tailwind variables
├── public/                   # Static assets
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## License

© 2025 Genstacks. All rights reserved.
