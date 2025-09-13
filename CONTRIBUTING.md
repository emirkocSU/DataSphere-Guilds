# Contributing to DataSphere Guilds

First off, thank you for considering contributing to DataSphere Guilds! It's people like you that make this such a great community. We welcome any type of contribution, not only code. You can help with:

*   **Quality Control**: Filing issues and bugs, helping us reproduce them, or fixing them.
*   **User Experience**: Proposing new features or improvements to existing ones.
*   **Documentation**: Writing and improving the documentation.
*   **Community**: Answering questions in our Discord or other community channels.

## Table of Contents

1.  [Prerequisites](#prerequisites)
2.  [Getting Started](#getting-started)
3.  [Development Workflow](#development-workflow)
4.  [Coding Guidelines](#coding-guidelines)
5.  [Testing](#testing)
6.  [Submitting Changes](#submitting-changes)
7.  [Code of Conduct](#code-of-conduct)

## Prerequisites

*   Node.js (LTS version)
*   Yarn (Classic or Berry)
*   Expo CLI
*   Git
*   An editor with ESLint and Prettier support (like VS Code)

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** to your local machine:
    ```bash
    git clone https://github.com/YOUR_USERNAME/datasphere-guilds.git
    cd datasphere-guilds
    ```
3.  **Install dependencies**:
    ```bash
    yarn install
    ```
4.  **Set up environment variables**:
    Copy `.env.example` to a new file named `.env` and fill in the required values.
    ```bash
    cp .env.example .env
    ```
5.  **Run the application**:
    ```bash
    expo start
    ```

## Development Workflow

1.  **Create a new branch** from the `main` branch for your feature or bug fix. Please use a descriptive name.
    *   For features: `feature/your-feature-name`
    *   For bug fixes: `fix/bug-description`
    ```bash
    git checkout -b feature/new-auth-flow
    ```
2.  **Make your changes**. Write clean, well-documented code.
3.  **Ensure all tests pass** and that you've added new tests for your changes.
4.  **Commit your changes** using a conventional commit message format. This is important for our release process.
    *   Examples: `feat: Add biometric login option`, `fix: Correct validation error on login screen`
    ```bash
    git commit -m "feat: Add awesome new feature"
    ```
5.  **Push your branch** to your fork on GitHub.
    ```bash
    git push origin feature/new-auth-flow
    ```
6.  **Open a Pull Request** (PR) to the `main` branch of the original repository.
    *   Provide a clear title and description for your PR.
    *   Link any relevant issues by using keywords like `Closes #123`.

## Coding Guidelines

*   **Style**: We use Prettier for automated code formatting and ESLint for linting. Please ensure your editor is configured to use them. Run `yarn lint` and `yarn format` before committing.
*   **TypeScript**: We use TypeScript across the entire codebase. Use strong types and avoid `any` where possible.
*   **Components**: Follow the Atomic Design methodology for structuring UI components (`atoms`, `molecules`, `organisms`).
*   **State Management**: We use Redux Toolkit for global state. For local state, use React hooks.
*   **API Calls**: Use the RTK Query services defined in `src/services/api`.
*   **Naming Conventions**:
    *   Components: `PascalCase` (e.g., `TaskCard.tsx`)
    *   Files/Folders: `kebab-case` (e.g., `task-details`)
    *   Variables/Functions: `camelCase` (e.g., `getUserProfile`)

## Testing

We use Jest with React Native Testing Library for unit and integration tests.

*   **Run all tests**: `yarn test`
*   **Run tests in watch mode**: `yarn test:watch`
*   **Check test coverage**: `yarn test:coverage`

All new features and bug fixes must be accompanied by tests. We aim for a minimum of 90% test coverage for all new code.

## Submitting Changes

*   Push your changes to a topic branch in your fork of the repository.
*   Open a pull request to the `main` branch.
*   The core team will review your PR. We may suggest some changes or improvements.
*   Once your PR is approved and all checks have passed, it will be merged.

## Code of Conduct

We have a [Code of Conduct](./CODE_OF_CONDUCT.md) that we expect all contributors to adhere to. Please read it before contributing.
