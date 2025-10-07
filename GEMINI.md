# Gemini Project Context

This document provides context for the Gemini AI assistant to understand the project structure, technologies, and development conventions.

## Project Overview

This is a learning project for a C# backend developer transitioning to a full-stack role. The repository contains a comprehensive learning roadmap and two React applications.

*   **Learning Roadmap:** A series of markdown files (e.g., `1단계_개발환경설정.md`) that guide the user through building a modern React application.
*   **`my-first-react-app`:** The primary application built following the learning roadmap. It's a feature-rich Todo application.
*   **`my-second-react-app`:** An alternative version of the application, likely for exploring different libraries or architectural patterns.

### `my-first-react-app`

This is a modern React application built with the following technologies:

*   **Framework:** React 19
*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4 with shadcn/ui
*   **Routing:** React Router v6
*   **State Management:**
    *   Zustand for client-side state
    *   TanStack Query for server-side state
*   **Form Management:** React Hook Form with Zod for validation
*   **API Communication:** Axios

### `my-second-react-app`

This project is similar to `my-first-react-app` but uses **TanStack Router** instead of React Router.

## Building and Running

### `my-first-react-app`

To run this project locally:

1.  Navigate to the `my-first-react-app` directory.
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`

Other available scripts:

*   `npm run build`: Builds the application for production.
*   `npm run lint`: Lints the codebase.
*   `npm run preview`: Previews the production build.

### `my-second-react-app`

To run this project locally:

1.  Navigate to the `my-second-react-app` directory.
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`

Other available scripts:

*   `npm run build`: Builds the application for production.
*   `npm run lint`: Lints the codebase.
*   `npm run preview`: Previews the production build.
*   `npm run typecheck`: Runs the TypeScript compiler to check for type errors.

## Development Conventions

*   **Code Style:** The project uses ESLint for code linting. Configuration can be found in `eslint.config.js`.
*   **Path Aliases:** The `@` alias is configured to point to the `src` directory for cleaner import paths.
*   **State Management:** A clear separation is maintained between client-side state (Zustand) and server-side state (TanStack Query).
*   **API Layer:** API calls are centralized in the `src/api` directory.
*   **Component Structure:** Components are organized by feature and type (e.g., `layout`, `ui`, `auth`).
*   **Routing:** Routes are defined in `src/App.tsx` and include protected routes for authenticated users.
