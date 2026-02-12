# Technical Interview Test - Next.js Application

Welcome! This is a technical assessment to evaluate your ability to work with a modern Next.js application, write tests, and contribute to a production-ready codebase.

## 📋 Your Task

Your mission is to:

1. **Set up the development environment** using Dev Containers
2. **Consume a public API** to display dynamic data on the home page
3. **Fix any bugs** you encounter
4. **Write tests** to ensure your code works correctly
5. **Create a Pull Request** with your changes
6. **Ensure all CI checks pass** ✅

## 🚀 Environment Setup

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or [Rancher Desktop](https://rancherdesktop.io/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Dev Containers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Getting Started with Dev Containers

1. **Clone this repository**

   ```bash
   git clone <repository-url>
   cd interview_test
   ```

2. **Open in VS Code**

   ```bash
   code .
   ```

3. **Reopen in Container**
   - Press `F1` (or `Ctrl+Shift+P` / `Cmd+Shift+P`)
   - Type and select: **"Dev Containers: Reopen in Container"**
   - Wait for the container to build (first time takes 2-3 minutes)

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🧪 Running Tests

### Unit Tests (Jest + React Testing Library)

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### End-to-End Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npx playwright install --with-deps

# Run Playwright tests
npx playwright test

# Run Playwright tests in UI mode (recommended for debugging)
npx playwright test --ui

# Run Playwright tests in headed mode
npx playwright test --headed
```

### Type Checking

```bash
npm run test:ts
```

## ✅ Making Your CI Green

Your Pull Request must pass all CI checks. Here's what the CI pipeline validates:

### Main CI Pipeline (`ci.yml`)

1. **Build** - Application must build successfully

   ```bash
   npm run build
   ```

2. **Formatting** - Code must be properly formatted

   ```bash
   npm run format:check
   # To auto-fix formatting issues:
   npm run format
   ```

3. **Linting** - Code must pass ESLint checks

   ```bash
   npm run lint
   ```

4. **Type Checking** - TypeScript must compile without errors

   ```bash
   npm run test:ts
   ```

5. **Unit Tests** - All tests must pass with coverage

   ```bash
   npm test -- --coverage
   ```

6. **SonarQube Scan** - Code quality analysis (automated)

### Playwright CI Pipeline (`playwright.yml`)

7. **E2E Tests** - Playwright tests must pass
   ```bash
   npx playwright test
   ```

## 📝 Your Assignment

### Part 1: Consume a Public API

Integrate a public API into the home page to display dynamic content. Some suggestions:

- **Weather API**: [OpenWeather](https://openweathermap.org/api) - Display current weather
- **News API**: [NewsAPI](https://newsapi.org/) - Show latest headlines
- **Random User API**: [RandomUser.me](https://randomuser.me/) - Display user profiles
- **Dog API**: [Dog API](https://dog.ceo/dog-api/) - Show random dog images
- **Pokémon API**: [PokéAPI](https://pokeapi.co/) - Display Pokémon data
- **Quotes API**: [Quotable](https://github.com/lukePeavey/quotable) - Show inspirational quotes

Choose any public API you're comfortable with. Your implementation should:

- Fetch data from the API
- Display the data in a user-friendly format
- Handle loading states
- Handle error states
- Be styled appropriately (using Tailwind CSS)

### Part 2: Fix Bugs

As you work through the project, you may encounter bugs. Your task includes:

- Identifying and documenting any bugs you find
- Fixing the bugs
- Adding tests to prevent regressions

### Part 3: Write Tests

Your changes must include:

- **Unit Tests**: Test your components and API integration
- **E2E Tests**: Add Playwright tests for your new functionality

Place unit tests alongside your components (e.g., `component.test.tsx`).
Place E2E tests in the `e2e/` directory.

### Part 4: Create a Pull Request

1. **Create a new branch**

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Commit your changes** (we use conventional commits)

   ```bash
   git add .
   git commit -m "feat: add weather API integration"
   ```

3. **Push your branch**

   ```bash
   git push origin feat/your-feature-name
   ```

4. **Open a Pull Request** on GitHub
   - Describe what you built
   - Explain your API choice
   - Document any bugs you fixed
   - Include screenshots if applicable

## 📁 Project Structure

```
├── app/              # Next.js App Router pages
├── e2e/              # Playwright E2E tests
├── public/           # Static assets
├── .devcontainer/    # Dev Container configuration
├── .github/          # GitHub Actions workflows
└── coverage/         # Test coverage reports (generated)
```

## 🛠️ Available Scripts

| Command                 | Description                  |
| ----------------------- | ---------------------------- |
| `npm run dev`           | Start development server     |
| `npm run build`         | Build production application |
| `npm start`             | Start production server      |
| `npm run lint`          | Run ESLint                   |
| `npm run format`        | Format code with Prettier    |
| `npm run format:check`  | Check code formatting        |
| `npm test`              | Run unit tests               |
| `npm run test:watch`    | Run tests in watch mode      |
| `npm run test:coverage` | Run tests with coverage      |
| `npm run test:ts`       | Type check TypeScript        |

## 🤔 Need Help?

### 📚 Project Documentation

- [Quick Reference Card](docs/QUICK_REFERENCE.md) - Commands and tips cheat sheet
- [Contributing Guide](docs/CONTRIBUTING.md) - Detailed development guide
- [API Integration Examples](docs/API_INTEGRATION_EXAMPLES.md) - Code patterns
- [Documentation Hub](docs/) - All documentation

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📊 Evaluation Criteria

You will be evaluated on:

1. **Code Quality** - Clean, readable, and maintainable code
2. **Testing** - Comprehensive unit and E2E tests
3. **Problem Solving** - How you approach and solve problems
4. **API Integration** - Proper error handling and state management
5. **CI/CD** - All CI checks passing
6. **Communication** - Clear PR description and code comments
7. **Best Practices** - Following React, TypeScript, and Next.js conventions

Good luck! 🚀
