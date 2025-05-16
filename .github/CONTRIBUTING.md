# Contributing to Corp-Astro Server

Thank you for your interest in contributing to the Corp-Astro Server project! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue tracker to avoid duplicates. When you create a bug report, include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots if applicable
- Include details about your environment (OS, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Explain why this enhancement would be useful to most Corp-Astro users
- List some other applications where this enhancement exists, if applicable

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your pull request whenever possible
- Follow the TypeScript and JavaScript styleguides
- Include adequate tests
- Document new code based on the Documentation Styleguide
- End all files with a newline

## Development Workflow

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/Corp_Astro_Server_Trial.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Run tests: `npm test`
6. Commit your changes: `git commit -am 'Add some feature'`
7. Push to the branch: `git push origin feature/your-feature-name`
8. Submit a pull request

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### TypeScript Styleguide

- Use 2 spaces for indentation
- Prefer `const` over `let` when possible
- Use PascalCase for classes, interfaces, types, and enums
- Use camelCase for variables, functions, and methods
- Use meaningful variable names
- Add appropriate JSDoc comments for public APIs
- Use TypeScript's strict mode

### Documentation Styleguide

- Use [Markdown](https://guides.github.com/features/mastering-markdown/) for documentation
- Reference methods and classes in markdown with backticks: \`Class.method()\`
- Use fenced code blocks with the appropriate language

## Additional Notes

### Issue and Pull Request Labels

| Label name | Description |
| --- | --- |
| `bug` | Confirmed bugs or reports likely to be bugs |
| `enhancement` | Feature requests |
| `documentation` | Documentation improvements |
| `good-first-issue` | Good for newcomers |
| `help-wanted` | Extra attention is needed |
| `wontfix` | Will not be worked on |

## Thank You!

Your contributions to open source, large or small, make projects like this possible. Thank you for taking the time to contribute.
