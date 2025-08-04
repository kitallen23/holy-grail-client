# AGENTS.md - Development Guidelines

## Build/Lint/Test Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production (runs TypeScript check + Vite build)
- `pnpm lint` - Run ESLint on src/**/*.{ts,tsx}
- `pnpm preview` - Preview production build
- No test framework configured - verify changes manually

## Code Style Guidelines
- **Formatting**: Prettier with 4-space tabs, 100 char width, trailing commas, semicolons
- **Imports**: Use `@/` alias for src imports, group external libs first, then internal
- **Components**: Default exports, PascalCase filenames, functional components with TypeScript
- **Types**: Define interfaces for props/state, use `type` for unions, explicit return types for functions
- **Naming**: camelCase variables/functions, PascalCase components/types, SCREAMING_SNAKE_CASE constants
- **State**: Zustand stores in `/stores`, React Query for server state, custom hooks in `/hooks`
- **Styling**: CSS modules (.module.scss) + Tailwind classes, clsx for conditional classes
- **Error Handling**: Try/catch with console.error, toast notifications via sonner
- **File Structure**: Group by feature in `/routes`, shared components in `/components`, utilities in `/lib`

## Framework Stack
- React 19 + TypeScript + Vite + TanStack Router + TanStack Query + Zustand + Tailwind + Radix UI