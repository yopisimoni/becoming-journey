import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveMediaItem,
  getMediaItem,
  getAllMediaItems,
  deleteMediaItem,
  clearAllMedia,
} from '@/lib/storage/mediaDb';

describe('BCM-009: Local Media Storage (IndexedDB / Memory)', () => {
  beforeEach(async () => {
    await clearAllMedia();
  });

  it('saves an image file and retrieves it by id', async () => {
    const file = new File(['fake-image-bits'], 'sunset.jpg', { type: 'image/jpeg' });
    const record = await saveMediaItem(file);

    expect(record).toBeDefined();
    expect(record.id).toContain('media_');
    expect(record.type).toBe('image');
    expect(record.name).toBe('sunset.jpg');

    const fetched = await getMediaItem(record.id);
    expect(fetched).toBeDefined();
    expect(fetched?.id).toBe(record.id);
    expect(fetched?.name).toBe('sunset.jpg');
  });

  it('saves a video file and correctly tags type as video', async () => {
    const file = new File(['fake-video-bits'], 'stream.mp4', { type: 'video/mp4' });
    const record = await saveMediaItem(file);

    expect(record.type).toBe('video');
    expect(record.name).toBe('stream.mp4');

    const all = await getAllMediaItems();
    expect(all.length).toBe(1);
    expect(all[0].type).toBe('video');
  });

  it('deletes an individual media item', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const record = await saveMediaItem(file);

    await deleteMediaItem(record.id);
    const fetched = await getMediaItem(record.id);
    expect(fetched).toBeNull();
  });

  it('clears all stored media records during data wipe', async () => {
    const file1 = new File(['1'], '1.png', { type: 'image/png' });
    const file2 = new File(['2'], '2.png', { type: 'image/png' });
    await saveMediaItem(file1);
    await saveMediaItem(file2);

    expect((await getAllMediaItems()).length).toBe(2);

    await clearAllMedia();
    expect((await getAllMediaItems()).length).toBe(0);
  });
});
