# Contributing to the Buildkite Plugin for Backstage

First off, thanks for taking the time to contribute! 🎉

This document provides guidelines and best practices for contributing to the Buildkite plugin for Backstage. Following these guidelines helps communicate that you respect the time of the developers managing and developing this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

This project follows the [Backstage Code of Conduct](https://github.com/backstage/backstage/blob/master/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/backstage-plugin.git
   ```
3. Install dependencies:
   ```bash
   yarn install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Process

1. Start the development server:
   ```bash
   yarn start
   ```

2. Make your changes following our [coding standards](#coding-standards)

3. Test your changes:
   ```bash
   yarn test
   yarn lint
   ```

4. Build the plugin to verify production readiness:
   ```bash
   yarn build
   ```

## Pull Request Process

1. Update the README.md with details of significant changes to the interface or functionality

2. Ensure all tests pass and add new tests for new functionality

3. Update all relevant documentation

4. Follow the PR template when submitting your pull request

5. The PR must receive approval from at least one maintainer

6. Ensure your PR title follows [Conventional Commits](https://www.conventionalcommits.org/):
   - feat: A new feature
   - fix: A bug fix
   - docs: Documentation only changes
   - style: Changes that don't affect the meaning of the code
   - refactor: A code change that neither fixes a bug nor adds a feature
   - perf: A code change that improves performance
   - test: Adding missing tests or correcting existing tests
   - chore: Changes to the build process or auxiliary tools

## Coding Standards

### TypeScript

- Follow the existing TypeScript configuration
- Maintain type safety; avoid using `any`
- Use TypeScript's strict mode features
- Document complex types with JSDoc comments

### React

- Use functional components with hooks
- Follow React best practices for performance
- Maintain proper component organization
- Use proper prop typing
- Implement error boundaries where appropriate

### CSS/Styling

- Use Material-UI's styling solutions (`makeStyles`, `styled`)
- Follow existing theme conventions
- Use responsive design principles
- Maintain consistency with Backstage's design system

### Code Organization

Our project follows this structure:

```
src/
  ├── api/                    # API clients and interfaces
  │   ├── BuildkiteAPI.ts     # API interface definitions
  │   ├── BuildkiteClient.ts  # API implementation
  │   ├── Types.ts           # API-specific types
  │   └── index.ts           # API exports
  ├── components/            # React components
  │   ├── BuildPage/         # Example component structure
  │   │   ├── BuildPage.tsx  # Component implementation
  │   │   └── index.ts       # Component exports
  │   └── ...               # Other components follow same pattern
  ├── hooks/                # Custom React hooks
  │   └── useBuildkiteApi.ts # Buildkite API hook
  ├── state/                # State management
  │   ├── useBuilds.ts      # Build state management
  │   └── usePipelines.ts   # Pipeline state management
  ├── plugin.ts            # Plugin definition and configuration
  ├── plugin.test.ts       # Plugin tests
  ├── routes.ts            # Route definitions
  ├── utils.ts             # Utility functions
  ├── setupTests.ts        # Test configuration
  └── index.ts            # Public plugin exports
```

When contributing new features:
- Place new API-related code in the `api/` directory
- Add new components in `components/` following the established pattern:
  - Each component gets its own directory
  - Include a main component file (e.g., `ComponentName.tsx`)
  - Include an `index.ts` for exports
  - Add tests if applicable
- Place shared types in the appropriate `Types.ts` file
- Add new hooks in `hooks/` or state management in `state/`
- Update exports in relevant `index.ts` files

## Testing Guidelines

### Unit Tests

- Write tests for all new functionality
- Follow the existing test patterns
- Use meaningful test descriptions
- Test both success and failure cases
- Mock external dependencies appropriately

```typescript
describe('ComponentName', () => {
  it('should render successfully', () => {
    // Test implementation
  });

  it('should handle errors appropriately', () => {
    // Test implementation
  });
});
```

### Integration Tests

- Test component integration points
- Verify API interactions
- Test routing functionality
- Verify plugin registration

### Testing Utilities

We provide several testing utilities:

```typescript
import {
  setupRequestMockHandlers,
  renderInTestApp,
} from "@backstage/test-utils";
```

## Documentation

### Code Documentation

- Document all public APIs
- Use JSDoc comments for complex functions
- Include usage examples where appropriate
- Document known limitations or edge cases

### Component Documentation

- Document component props
- Include usage examples
- Document any required context or setup
- Note any performance considerations

### README Updates

When making significant changes:

1. Update the features section if adding new functionality
2. Update installation instructions if changing dependencies
3. Update configuration examples if changing options
4. Add any new troubleshooting items

## Review Process

All contributions go through a review process:

1. Code review by maintainers
2. CI checks must pass
3. Documentation review
4. Testing verification

## Getting Help

If you need help, you can:

- Open an issue with a detailed description
- Tag your PR with "help wanted" or "question"
- Comment on your PR with specific questions

Thank you for contributing to the Buildkite Plugin for Backstage! 🚀
