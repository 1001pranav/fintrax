# E2E Tests

End-to-end tests for Fintrax application using Playwright.

## Setup

Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests (headless)
```bash
npm run test:e2e
```

### Run tests with UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

### Debug tests
```bash
npm run test:e2e:debug
```

### View test report
```bash
npm run test:e2e:report
```

## Test Files

- **`auth.spec.ts`** - Authentication flows (login, register, password reset)
- **`projects.spec.ts`** - Project management (CRUD operations)
- **`tasks.spec.ts`** - Task management (creation, editing, status changes)
- **`transactions.spec.ts`** - Financial transactions (income, expenses, savings, loans)
- **`dashboard.spec.ts`** - Dashboard rendering, navigation, and performance

## Test Structure

Each test file follows this pattern:

```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: navigate, authenticate, etc.
  });

  test('should do something', async ({ page }) => {
    // Test implementation
  });
});
```

## Configuration

Test configuration is in `playwright.config.ts`:

- **Base URL**: `http://localhost:3000` (configurable via `PLAYWRIGHT_BASE_URL` env var)
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure
- **Traces**: Captured on first retry

## Best Practices

1. **Use data-testid attributes** for reliable selectors
2. **Mock authentication** for faster tests
3. **Use test.skip()** for tests that require specific setup
4. **Wait for elements** using `await expect(element).toBeVisible()`
5. **Clean up data** after tests when possible

## CI Integration

Tests run automatically on:
- Push to `main`, `develop`, or `claude/**` branches
- Pull requests to `main` or `develop`

See `.github/workflows/e2e-tests.yml` for CI configuration.

## Troubleshooting

### Tests timing out
- Increase timeout in `playwright.config.ts`
- Check if dev server is running
- Verify network connectivity

### Flaky tests
- Add explicit waits: `await page.waitForTimeout(ms)`
- Use `waitForLoadState('networkidle')`
- Increase retry count

### Browser not found
- Run `npx playwright install`
- Or install specific browser: `npx playwright install chromium`

## Writing New Tests

1. Create new spec file in `e2e/` directory
2. Follow existing naming convention: `feature.spec.ts`
3. Use descriptive test names: `should create project successfully`
4. Add setup in `beforeEach` hook
5. Use conditional logic for optional features (with `test.skip()`)
6. Verify success with toasts, navigation, or element visibility

## Example Test

```typescript
test('should create a new project', async ({ page }) => {
  // Navigate
  await page.goto('/projects');

  // Open modal
  await page.getByRole('button', { name: /create project/i }).click();

  // Fill form
  await page.getByLabel(/project name/i).fill('Test Project');
  await page.getByLabel(/description/i).fill('Test Description');

  // Submit
  await page.getByRole('button', { name: /create/i }).click();

  // Verify success
  await expect(page.getByText('Test Project')).toBeVisible();
});
```

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Tests](https://playwright.dev/docs/debug)
