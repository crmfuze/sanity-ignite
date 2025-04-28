# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Development Commands
- `yarn dev` - Run development environment (Next.js + Sanity typegen watcher)
- `yarn test` - Run Vitest tests
- `yarn test <file.test.ts>` - Run specific test file

## Code Style Guidelines
- **Formatting**: Single quotes, trailing commas, 100 char line length, semicolons
- **Styling**: Use TailwindCSS for styling with clsx/tailwind-merge for conditional classes
- **Imports**: Use absolute imports from project root; restricted imports between app/studio
- **Components**: React components in separate files matching component name
- **TypeScript**: Strict types, define interfaces/types in separate files when reused
- **Sanity Schema**: Use defineType/defineField, export named const matching filename
- **GROQ Queries**: Use SCREAMING_SNAKE_CASE, one line per filter/attribute
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Error Handling**: Meaningful error messages, use dedicated error components