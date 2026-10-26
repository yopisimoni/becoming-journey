import { describe, it, expect } from 'vitest';
import { ECHOES_STORIES, NATURE_CANVAS_SCENES } from '@/lib/stories/echoesData';

describe('Echoes of Shared Humanity & Nature Canvas', () => {
  it('contains 5 timeless parables of overcoming and patience', () => {
    expect(ECHOES_STORIES).toHaveLength(5);
    const ids = ECHOES_STORIES.map((s) => s.id);
    expect(ids).toContain('bamboo');
    expect(ids).toContain('the_potter');
    expect(ids).toContain('quitting_smoke');
    expect(ids).toContain('the_wall');
    expect(ids).toContain('two_wolves');
  });

  it('each story has complete narrative and an empowering takeaway', () => {
    ECHOES_STORIES.forEach((story) => {
      expect(story.title).toBeTruthy();
      expect(story.theme).toBeTruthy();
      expect(story.narrative.length).toBeGreaterThan(1);
      expect(story.takeaway).toBeTruthy();
      expect(story.authorOrOrigin).toBeTruthy();
    });
  });

  it('contains curated peaceful nature scenes for contemplation mode', () => {
    expect(NATURE_CANVAS_SCENES.length).toBeGreaterThanOrEqual(4);
    NATURE_CANVAS_SCENES.forEach((scene) => {
      expect(scene.id).toBeTruthy();
      expect(scene.name).toBeTruthy();
      expect(scene.gradient).toBeTruthy();
      expect(scene.accentColor).toBeTruthy();
    });
  });
});
