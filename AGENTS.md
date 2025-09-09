# AGENTS.md - Development Guide

## Build/Test Commands
- **Dev server**: `npm run dev` (frontend), `npm run dev` in `/backend` (Node.js API)
- **Build**: `npm run build` 
- **Lint**: `npm run lint`
- **Format**: `npx prettier --write .`
- **Type check**: `npx tsc --noEmit`
- **Backend test**: `npm run test` in `/backend` directory

## Architecture
- **Frontend**: Next.js 15.3.2 with App Router (`src/app/`)
- **Backend**: Express.js API server in `/backend/` with MongoDB/Mongoose
- **Components**: Shared components in `src/shared/`, feature components in `src/components/`
- **Styling**: Tailwind CSS v4 with custom design tokens, Framer Motion for animations
- **State**: React hooks, contexts in `src/contexts/`
- **Types**: TypeScript with strict mode, types in `src/types/`

## Code Style
- **Imports**: External libs first, then internal components (`@/`), utilities last
- **Styling**: Use `clsx` for conditional classes, HeadlessUI for accessible components
- **Components**: ForwardRef for reusable components, proper TypeScript interfaces
- **Formatting**: Prettier with semicolons off, single quotes, 120 char width, organized imports plugin
- **Files**: Use kebab-case for files, PascalCase for components
- **Error handling**: Try-catch blocks, proper error types, user-friendly messages
