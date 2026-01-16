# Contributing to DineIn

Welcome to the DineIn engineering team! This document outlines the standards, workflows, and guidelines for contributing to the repository.

## 🚀 Getting Started

1. **Clone the repo**:
   ```bash
   git clone <repository-url>
   cd dinein
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start development environment**:
   ```bash
   npm run dev       # Frontend (http://localhost:5173)
   npx supabase start # Backend (Docker required)
   ```

---

## 🌳 Git Workflow

We follow a strict branching strategy to maintain stability.

### Branch Naming
- `feat/description`: New features (e.g., `feat/add-vendor-onboarding`)
- `fix/description`: Bug fixes (e.g., `fix/login-error`)
- `chore/description`: Maintenance, deps, docs (e.g., `chore/upgrade-vite`)
- `refactor/description`: Code restructuring without behavior change

### Commit Messages
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Formatting, missing semi-colons, etc
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `test:` Adding missing tests
- `chore:` Build process or aux tool changes

Example:
```text
feat(auth): add google connection to supabase login
```

---

##  pull Request Process

1. **Self-Review**: Review your own code before opening a PR.
2. **Title**: Use the Conventional Commit format.
3. **Description**: Explain *what* changed and *why*. Link related issues.
4. **Verification**:
   - Run `npm run typecheck -w apps/web`
   - Run `npm run lint`
   - Verify UI changes with screenshots if applicable.
5. **Reviewers**: Assign at least one reviewer.

---

## 💻 Coding Standards

### TypeScript
- **Strict Mode**: Enabled. No `any` unless absolutely necessary (and commented).
- **Interfaces**: Prefer `interface` over `type` for object definitions.
- **Enums**: Use string enums for clear debugging values.

### React
- **Functional Components**: Use `React.FC` or generic functions.
- **Hooks**: Custom hooks in `/hooks`. Logic should move out of UI components.
- **State**: Use React Query for server state, Context for global UI state.

### Styling (Tailwind CSS)
- Use our design tokens (Soft Liquid Glass).
- Avoid arbitrary values (`w-[123px]`). Use theme spacing.
- Mobile-first classes (`w-full md:w-1/2`).

---

## 🧪 Testing

- **Unit/Component**: `npm run test` (Vitest)
- **E2E**: `npm run test:e2e` (Playwright)

Before pushing, always run:
```bash
npm run typecheck && npm run lint
```
