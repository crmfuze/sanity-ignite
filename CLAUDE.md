# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `yarn next:build` (or `yarn built`)
- Dev: `yarn dev` (starts development server with auto-typegen)
- Lint: `yarn lint`
- Typecheck: `yarn typecheck`
- Test: `yarn test` (all tests)
- Single test: `yarn test src/path/to/test.ts` or `yarn test -t "test name pattern"`
- Sanity typegen: `yarn sanity:typegen`

## Code Style
- TypeScript with strict type checking
- Single quotes for strings, trailing commas
- 100 character line width limit
- React 19 with Next.js 15
- Path aliases: `@/*` maps to `./src/*`
- ESLint enforces import restrictions between Next.js and Sanity studio
- Tailwind CSS for styling
- Use Valibot for validation
- Test files in `__tests__` directories using Vitest
- Follow existing patterns for error handling (see utils/)
- Components organized by feature in modules/