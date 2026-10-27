import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { LivingLightIdentity } from '@/components/motion/LivingLightIdentity';

describe('LivingLightIdentity Component (v0.9.3)', () => {
  it('renders correctly as an image by default with accessible label', () => {
    render(<LivingLightIdentity size={240} ariaLabel="Test Living Light" />);
    const img = screen.getByRole('img', { name: /Test Living Light/i });
    expect(img).toBeInTheDocument();
  });

  it('generates unique SVG gradient and filter IDs across multiple component instances', () => {
    const { container } = render(
      <div>
        <LivingLightIdentity size={100} ariaLabel="Instance 1" />
        <LivingLightIdentity size={100} ariaLabel="Instance 2" />
      </div>
    );

    const linearGradients = container.querySelectorAll('linearGradient');
    expect(linearGradients.length).toBeGreaterThan(0);

    const ids = Array.from(linearGradients).map((g) => g.getAttribute('id'));
    const uniqueIds = new Set(ids);
    // All gradient IDs across both instances must be 100% unique
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('becomes keyboard accessible when onSymbolClick is provided', () => {
    const handleClick = vi.fn();
    render(
      <LivingLightIdentity
        size={200}
        ariaLabel="Interactive Symbol"
        onSymbolClick={handleClick}
      />
    );

    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('tabIndex', '0');

    // Trigger via Enter key
    fireEvent.keyDown(btn, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Trigger via Space key
    fireEvent.keyDown(btn, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);

    // Trigger via click
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it('renders simplified mode for small icons with distinct compact gradients', () => {
    const { container } = render(
      <LivingLightIdentity size={32} simplified={true} ariaLabel="Compact Icon" />
    );
    const img = screen.getByRole('img', { name: /Compact Icon/i });
    expect(img).toBeInTheDocument();

    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThanOrEqual(3);
    expect(container.querySelector('.becoming-orbit-flow')).toBeNull();
  });

  it('respects reducedMotion by applying animation: none', () => {
    const { container } = render(
      <LivingLightIdentity size={200} reducedMotion={true} ariaLabel="Reduced Motion" />
    );
    expect(container.querySelector('.becoming-orbit-flow')).toBeNull();
    expect(container.querySelector('.becoming-orbit-ribbon')).toBeNull();
  });
});
