import { render, screen } from '@testing-library/react';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';

describe('test harness sanity', () => {
  it('renders into jsdom and asserts with jest-dom matchers', () => {
    render(createElement('div', { 'data-testid': 'sanity' }, 'harness ok'));

    expect(screen.getByTestId('sanity')).toHaveTextContent('harness ok');
  });
});
