import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AppProvider } from '@/context/AppContext';
import { GoodVibesStudioView } from '@/components/GoodVibesStudioView';

describe('GoodVibesStudioView (BECOMING v0.8)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // Mock HTMLCanvasElement.getContext
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      createLinearGradient: vi.fn().mockReturnValue({
        addColorStop: vi.fn(),
      }),
      fillRect: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      fillText: vi.fn(),
      beginPath: vi.fn(),
      closePath: vi.fn(),
      roundRect: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: 'center',
    } as unknown as CanvasRenderingContext2D);

    HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,mockpng');
  });

  it('renders good vibes studio, preview card, and 5 template selectors', () => {
    render(
      <AppProvider>
        <GoodVibesStudioView />
      </AppProvider>
    );

    expect(screen.getByTestId('good-vibes-view')).toBeInTheDocument();
    expect(screen.getByTestId('goodvibes-card-preview')).toBeInTheDocument();
    expect(screen.getByTestId('goodvibes-template-sunrise')).toBeInTheDocument();
    expect(screen.getByTestId('goodvibes-template-twilight')).toBeInTheDocument();
    expect(screen.getByTestId('goodvibes-template-moss')).toBeInTheDocument();
    expect(screen.getByTestId('goodvibes-template-dawn')).toBeInTheDocument();
    expect(screen.getByTestId('goodvibes-template-cosmic')).toBeInTheDocument();
  });

  it('switches templates when clicked', () => {
    render(
      <AppProvider>
        <GoodVibesStudioView />
      </AppProvider>
    );

    const cosmicBtn = screen.getByTestId('goodvibes-template-cosmic');
    fireEvent.click(cosmicBtn);
    expect(cosmicBtn).toHaveClass('border-indigo-500');
  });

  it('switches content types and updates preview text', () => {
    render(
      <AppProvider>
        <GoodVibesStudioView />
      </AppProvider>
    );

    const achievementBtn = screen.getByTestId('goodvibes-content-type-achievement');
    fireEvent.click(achievementBtn);

    const preview = screen.getByTestId('goodvibes-card-preview');
    expect(preview).toHaveTextContent(/Stage|Milestone/i);
  });

  it('toggles watermark branding', () => {
    render(
      <AppProvider>
        <GoodVibesStudioView />
      </AppProvider>
    );

    const watermarkCheckbox = screen.getByTestId('watermark-toggle');
    expect(watermarkCheckbox).toBeChecked();
    fireEvent.click(watermarkCheckbox);
    expect(watermarkCheckbox).not.toBeChecked();
  });

  it('copies card text to clipboard when copy button is clicked', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <AppProvider>
        <GoodVibesStudioView />
      </AppProvider>
    );

    const copyBtn = screen.getByTestId('goodvibes-copy-btn');
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalled();
  });
});
