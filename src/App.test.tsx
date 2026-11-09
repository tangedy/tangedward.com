import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { artworks, galleryRows } from './artworks';

const renderApp = (path = '/') => render(
  <MemoryRouter
    initialEntries={[path]}
    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
  >
    <App />
  </MemoryRouter>
);

beforeEach(() => {
  window.localStorage.removeItem('home-greeting');
  jest.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => undefined);
  jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
  jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('navigates to projects with a shareable route', async () => {
  renderApp();

  fireEvent.click(screen.getByRole('link', { name: 'Projects' }));

  expect(await screen.findByRole('heading', { name: /selected work/i })).toBeInTheDocument();
  expect(document.title).toBe('Projects | Edward Tang');
});

test('keeps the contact page hidden', async () => {
  renderApp('/contact');

  expect(screen.getByRole('heading', { name: 'Welcome!' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Contact' })).not.toBeInTheDocument();
});

test('alternates the home greeting on each visit', async () => {
  const firstVisit = renderApp();
  expect(screen.getByRole('heading', { name: 'Welcome!' })).toBeInTheDocument();
  firstVisit.unmount();

  renderApp();
  expect(screen.getByRole('heading', { name: 'Huān-yíng!' })).toBeInTheDocument();
});

test('unlocks the easter egg by typing the secret phrase', async () => {
  renderApp('/about');
  await screen.findByRole('heading', { name: 'About me' });

  'easter egg'.split('').forEach((key) => fireEvent.keyDown(window, { key }));

  expect(await screen.findByRole('heading', { name: 'A crow has hatched!' })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'An 8-bit crow dancing' })).toBeInTheDocument();
  expect(document.title).toBe('A Secret Has Hatched | Edward Tang');
});

test('unlocks the easter egg without a space in the secret phrase', async () => {
  renderApp('/projects');
  await screen.findByRole('heading', { name: /selected work/i });

  'easteregg'.split('').forEach((key) => fireEvent.keyDown(window, { key }));

  expect(await screen.findByRole('heading', { name: 'A crow has hatched!' })).toBeInTheDocument();
});

test('serves the easter egg at its direct route', async () => {
  renderApp('/easteregg');

  expect(await screen.findByRole('heading', { name: 'A crow has hatched!' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Back home' })).toHaveAttribute('href', '/');
});

test('displays the project selected from the project list', async () => {
  renderApp('/projects');

  const recipeRadarSelector = await screen.findByRole('button', { name: /recipe radar/i });
  fireEvent.click(recipeRadarSelector);

  expect(screen.getByRole('heading', { name: 'Recipe Radar' })).toBeInTheDocument();
  expect(screen.getByAltText('Recipe Radar project preview')).toBeInTheDocument();
  expect(recipeRadarSelector).toHaveAttribute('aria-pressed', 'true');
});

test('displays the MLee portfolio project beneath MinimalFinance', async () => {
  renderApp('/projects');

  const preloadedVideo = await screen.findByLabelText('MLee Portfolio Site project preview');
  expect(preloadedVideo).toHaveAttribute('src', '/project assets/matthewproject2-fast.mp4');
  expect(preloadedVideo).toHaveAttribute('preload', 'auto');
  expect(preloadedVideo).not.toBeVisible();
  expect(HTMLMediaElement.prototype.load).toHaveBeenCalled();

  const projectSelectors = screen.getAllByRole('button', { name: /minimalfinance|mlee portfolio site/i });
  expect(projectSelectors[0]).toHaveAccessibleName(/minimalfinance/i);
  expect(projectSelectors[1]).toHaveAccessibleName(/mlee portfolio site/i);

  fireEvent.click(projectSelectors[1]);

  expect(screen.getByRole('heading', { name: 'MLee Portfolio Site' })).toBeInTheDocument();
  const firstVideo = screen.getByLabelText('MLee Portfolio Site project preview');
  expect(firstVideo).toBe(preloadedVideo);
  expect(firstVideo).toBeVisible();
  expect(firstVideo).toHaveAttribute('src', '/project assets/matthewproject2-fast.mp4');
  expect(firstVideo).toHaveAttribute('poster', '/project assets/matthewproject2-poster.webp');
  expect(firstVideo).toHaveAttribute('autoplay');
  expect(firstVideo).toHaveAttribute('loop');
  expect(firstVideo).toHaveProperty('muted', true);
  expect(screen.getByText('React, Vite, TypeScript, Tailwind')).toBeInTheDocument();

  (firstVideo as HTMLVideoElement).currentTime = 8;
  fireEvent.click(screen.getByRole('button', { name: /recipe radar/i }));
  fireEvent.click(projectSelectors[1]);

  const restartedVideo = screen.getByLabelText('MLee Portfolio Site project preview');
  expect(restartedVideo).toBe(firstVideo);
  expect(restartedVideo).toHaveProperty('currentTime', 0);
});

test('opens and dismisses experience details from the keyboard', async () => {
  renderApp('/about');
  const experienceButton = await screen.findByRole('button', { name: /software analyst co-op/i });
  jest.useFakeTimers();
  experienceButton.focus();
  fireEvent.click(experienceButton);

  expect(screen.getByRole('dialog', { name: 'Software Analyst Co-op' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Close experience details' })).toHaveFocus();

  fireEvent.keyDown(document, { key: 'Escape' });
  act(() => jest.advanceTimersByTime(300));

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(experienceButton).toHaveFocus();
  jest.useRealTimers();
});

test('opens the project named in a shared link', async () => {
  renderApp('/projects?project=recipe-radar');

  expect(await screen.findByRole('heading', { name: 'Recipe Radar' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /recipe radar/i })).toHaveAttribute('aria-pressed', 'true');
});

test('falls back to the first project for an unknown project link', async () => {
  renderApp('/projects?project=does-not-exist');

  expect(await screen.findByRole('heading', { name: 'MinimalFinance' })).toBeInTheDocument();
});

test('moves through the project list with the arrow keys', async () => {
  renderApp('/projects');

  const firstSelector = await screen.findByRole('button', { name: /minimalfinance/i });
  firstSelector.focus();

  fireEvent.keyDown(firstSelector, { key: 'ArrowDown' });
  const secondSelector = screen.getByRole('button', { name: /fitstealer/i });
  expect(secondSelector).toHaveFocus();
  expect(secondSelector).toHaveAttribute('aria-pressed', 'true');

  fireEvent.keyDown(secondSelector, { key: 'End' });
  expect(screen.getByRole('heading', { name: 'Pixelize' })).toBeInTheDocument();

  fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' });
  expect(screen.getByRole('heading', { name: 'MinimalFinance' })).toBeInTheDocument();
});

test('lists Art after Projects in the navigation', async () => {
  renderApp();

  const navLabels = screen.getAllByRole('link').map((link) => link.textContent);
  expect(navLabels.slice(0, 4)).toEqual(['Home', 'About', 'Projects', 'Art']);

  fireEvent.click(screen.getByRole('link', { name: 'Art' }));
  expect(await screen.findByRole('button', { name: 'Symphony, 2024' })).toBeInTheDocument();
  expect(document.title).toBe('Art | Edward Tang');
});

test('opens an artwork preview and steps through with the keyboard', async () => {
  renderApp('/art');

  const symphonyTile = await screen.findByRole('button', { name: 'Symphony, 2024' });
  jest.useFakeTimers();
  symphonyTile.focus();
  fireEvent.click(symphonyTile);
  expect(screen.getByRole('dialog', { name: 'Symphony' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Close artwork' })).toHaveFocus();

  fireEvent.keyDown(document, { key: 'ArrowRight' });
  expect(screen.getByRole('dialog', { name: 'A Morning in Kensington' })).toBeInTheDocument();

  fireEvent.keyDown(document, { key: 'Escape' });
  act(() => jest.advanceTimersByTime(300));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(symphonyTile).toHaveFocus();
  jest.useRealTimers();
});

test('opens the artwork named in a shared link', async () => {
  renderApp('/art?piece=gaze');

  const dialog = await screen.findByRole('dialog', { name: 'Gaze' });
  expect(within(dialog).getByRole('link', { name: /artstation/i }))
    .toHaveAttribute('href', 'https://www.artstation.com/artwork/YG4yB6');
});

test('places every artwork in the gallery layout exactly once', () => {
  const placed = galleryRows.flat(2);

  expect([...placed].sort()).toEqual(artworks.map((artwork) => artwork.slug).sort());
});

test('fades an art tile in once its image has loaded', async () => {
  renderApp('/art');

  const tile = await screen.findByRole('button', { name: 'Scroll, 2025' });
  expect(tile).not.toHaveClass('is-loaded');

  fireEvent.load(tile.querySelector('img') as HTMLImageElement);
  expect(tile).toHaveClass('is-loaded');
});

test('lists experiences newest first without Waddlewell', async () => {
  renderApp('/about');

  await screen.findByRole('button', { name: /software engineer intern/i });
  const titles = screen.getAllByRole('button', { name: /intern|co-op|developer/i })
    .map((button) => button.querySelector('h3')?.textContent);

  expect(titles).toEqual([
    'Software Engineer Intern',
    'AI/ML Developer',
    'Software Developer Co-op',
    'Software Analyst Co-op',
    'Frontend Developer',
  ]);
  expect(screen.getByText('University of Waterloo Reality Labs')).toBeInTheDocument();
  expect(screen.queryByText(/waddlewell/i)).not.toBeInTheDocument();
  expect(screen.getByText('TD Bank')).toBeInTheDocument();
});

test('shows a loading shimmer until an experience photo arrives', async () => {
  renderApp('/about');

  fireEvent.click(await screen.findByRole('button', { name: /software analyst co-op/i }));
  const photo = screen.getByAltText('Software Analyst Co-op');
  const frame = photo.parentElement as HTMLElement;

  expect(frame).toHaveClass('skeleton');
  expect(frame).not.toHaveClass('is-loaded');
  fireEvent.load(photo);
  expect(frame).toHaveClass('is-loaded');
});

test('shows the pho photo and summary for the Software Developer Co-op', async () => {
  renderApp('/about');

  fireEvent.click(await screen.findByRole('button', { name: /software developer co-op/i }));

  const dialog = screen.getByRole('dialog', { name: 'Software Developer Co-op' });
  expect(within(dialog).getByText(/automate end-to-end testing/i)).toBeInTheDocument();
  expect(within(dialog).getByText('Pho with all the interns on the last day!')).toBeInTheDocument();
  expect(within(dialog).getByAltText('Software Developer Co-op'))
    .toHaveAttribute('srcset', expect.stringContaining('/experience/ops-pho-1200.webp 1200w'));
});

test('drops the skills section and labels testimonials', async () => {
  renderApp('/about');

  expect(await screen.findByRole('heading', { name: 'Testimonials' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'About me' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /skills/i })).not.toBeInTheDocument();
});

test('advances to the next testimonial when the active bar finishes filling', async () => {
  renderApp('/about');

  const first = (await screen.findByText(/consistently delivered outstanding results/i)).closest('figure');
  const second = screen.getByText(/outstanding performance throughout his co-op term/i).closest('figure');
  expect(screen.getByText('— Manager, Solutions Delivery')).toBeInTheDocument();
  expect(first).toHaveClass('is-active');
  expect(screen.queryByText(/0\d \/ 0\d/)).not.toBeInTheDocument();

  const rotator = first?.parentElement as HTMLElement;
  // The first testimonial rides in with the section's fade-in; the switch animation waits for a change.
  expect(rotator).not.toHaveClass('has-switched');

  fireEvent.animationEnd(screen.getByTestId('testimonial-progress'));
  expect(second).toHaveClass('is-active');
  expect(first).not.toHaveClass('is-active');
  expect(rotator).toHaveClass('has-switched');

  fireEvent.animationEnd(screen.getByTestId('testimonial-progress'));
  expect(first).toHaveClass('is-active');
});

test('pauses the testimonial fill while hovered and jumps from a bar', async () => {
  renderApp('/about');

  const secondBar = await screen.findByRole('button', { name: 'Show testimonial 2' });
  const rotator = secondBar.closest('.testimonials') as HTMLElement;

  fireEvent.mouseEnter(rotator);
  expect(rotator).toHaveClass('is-paused');
  fireEvent.mouseLeave(rotator);
  expect(rotator).not.toHaveClass('is-paused');

  fireEvent.click(secondBar);
  expect(secondBar).toHaveAttribute('aria-pressed', 'true');
  expect(secondBar.querySelector('[data-testid="testimonial-progress"]')).toBeInTheDocument();
  expect(screen.getByText(/outstanding performance throughout his co-op term/i).closest('figure')).toHaveClass('is-active');
});

test('lists FitStealer right under MinimalFinance with its own link', async () => {
  renderApp('/projects?project=fitstealer');

  expect(await screen.findByRole('heading', { name: 'FitStealer' })).toBeInTheDocument();
  expect(screen.getByAltText('FitStealer project preview')).toHaveAttribute('src', '/project assets/FitStealer.webp');
  expect(screen.getByRole('link', { name: /view code/i }))
    .toHaveAttribute('href', 'https://github.com/Hack-the-North-2026/HacktheNorth2026');
  expect(screen.getByText(/computer vision/i)).toBeInTheDocument();

  const selectorTitles = Array.from(document.querySelectorAll('.project-selector-title')).map((el) => el.textContent);
  expect(selectorTitles.slice(0, 3)).toEqual(['MinimalFinance', 'FitStealer', 'MLee Portfolio Site']);
});

test('shows the Reality Labs photo and summary', async () => {
  renderApp('/about');

  fireEvent.click(await screen.findByRole('button', { name: /ai\/ml developer/i }));

  const dialog = screen.getByRole('dialog', { name: 'AI/ML Developer' });
  expect(within(dialog).getByText(/siamese neural network/i)).toBeInTheDocument();
  expect(within(dialog).getByAltText('AI/ML Developer'))
    .toHaveAttribute('srcset', expect.stringContaining('/experience/reality-labs-1200.webp 1200w'));
  expect(within(dialog).getByText('Our gesture recognition in action!')).toBeInTheDocument();
});

