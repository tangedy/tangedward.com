import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
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
