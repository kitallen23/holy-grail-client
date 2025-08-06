# Holy Grail

A web application to help Diablo 2 players track their progress through the Holy Grail challenge - the self-imposed quest to collect every unique and set item in the game.

## Features

- **Item Catalogue** - Browse and search through all unique and set items
- **Runeword Catalogue** - Complete reference for all runewords
- **Holy Grail Checklist** - Track your collection progress with an interactive checklist

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- TanStack Router
- shadcn/ui

## Getting Started

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- pnpm

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd holy-grail
```

2. Install dependencies

```bash
pnpm install
```

3. Start the development server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# API Configuration
VITE_API_URL=http://localhost:3000
```

## Building for Production

```bash
pnpm build
```

Built files will be output to the `dist/` directory.

## Deployment

<!-- TODO: Add deployment instructions -->

## Contributing

<!-- TODO: Add contributing guidelines -->

## Acknowledgments

<!-- TODO: Add credits and acknowledgments -->

## License

ISC
