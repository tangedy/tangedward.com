import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const renderApp = (path = '/') => render(
  <MemoryRouter
    initialEntries={[path]}
    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
  >
    <App />
  </MemoryRouter>
);

test('navigates to projects with a shareable route', () => {
  renderApp();

  fireEvent.click(screen.getByRole('link', { name: 'Projects' }));

  expect(screen.getByRole('heading', { name: /selected work/i })).toBeInTheDocument();
  expect(document.title).toBe('Projects | Edward Tang');
});

test('keeps the contact page hidden', () => {
  renderApp('/contact');

  expect(screen.getByRole('heading', { name: 'Welcome!' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Contact' })).not.toBeInTheDocument();
});

test('displays the project selected from the project list', () => {
  renderApp('/projects');

  const recipeRadarSelector = screen.getByRole('button', { name: /recipe radar/i });
  fireEvent.click(recipeRadarSelector);

  expect(screen.getByRole('heading', { name: 'Recipe Radar' })).toBeInTheDocument();
  expect(screen.getByAltText('Recipe Radar project preview')).toBeInTheDocument();
  expect(recipeRadarSelector).toHaveAttribute('aria-pressed', 'true');
});

test('displays the MLee portfolio project beneath MinimalFinance', async () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  const originalFetch = global.fetch;
  const createObjectURL = jest.fn()
    .mockReturnValueOnce('blob:mlee-first-view')
    .mockReturnValueOnce('blob:mlee-second-view');
  const revokeObjectURL = jest.fn();

  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL });
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL });
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    blob: async () => new Blob(['mlee-preview']),
  }) as jest.Mock;

  const view = renderApp('/projects');

  const projectSelectors = screen.getAllByRole('button', { name: /minimalfinance|mlee portfolio site/i });
  expect(projectSelectors[0]).toHaveAccessibleName(/minimalfinance/i);
  expect(projectSelectors[1]).toHaveAccessibleName(/mlee portfolio site/i);

  fireEvent.click(projectSelectors[1]);

  expect(screen.getByRole('heading', { name: 'MLee Portfolio Site' })).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByAltText('MLee Portfolio Site project preview')).toHaveAttribute(
      'src',
      'blob:mlee-first-view'
    );
  });
  expect(screen.getByText('React, Vite, TypeScript, Tailwind')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /recipe radar/i }));
  fireEvent.click(projectSelectors[1]);

  await waitFor(() => {
    expect(screen.getByAltText('MLee Portfolio Site project preview')).toHaveAttribute(
      'src',
      'blob:mlee-second-view'
    );
  });
  expect(createObjectURL).toHaveBeenCalledTimes(2);
  expect(revokeObjectURL).toHaveBeenCalledWith('blob:mlee-first-view');

  view.unmount();
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: originalCreateObjectURL });
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: originalRevokeObjectURL });
  global.fetch = originalFetch;
});

test('opens and dismisses experience details from the keyboard', () => {
  jest.useFakeTimers();
  renderApp('/about');

  const experienceButton = screen.getByRole('button', { name: /backend developer intern/i });
  experienceButton.focus();
  fireEvent.click(experienceButton);

  expect(screen.getByRole('dialog', { name: 'Backend Developer Intern' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Close experience details' })).toHaveFocus();

  fireEvent.keyDown(document, { key: 'Escape' });
  act(() => jest.advanceTimersByTime(300));

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(experienceButton).toHaveFocus();
  jest.useRealTimers();
});
