import { describe, it, expect, beforeAll } from 'vitest';
import setup from '../integration/setup';
import { createEvent, listEvents } from '../../src/server/events/service';

beforeAll(async () => {
  await setup();
}, 30000); // Increase timeout for MongoDB setup

describe('Events Service (integration)', () => {
  it('creates and lists events', async () => {
    const ev = await createEvent({ title: `Event ${Date.now()}`, description: 'Test event' });
    expect(ev).toHaveProperty('title');

    const events = await listEvents(10);
    expect(Array.isArray(events)).toBe(true);
    expect(events.some((e: any) => e.title === ev.title)).toBe(true);
  });
});
