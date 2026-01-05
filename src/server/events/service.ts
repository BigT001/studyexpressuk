import { connectToDatabase } from '../db/mongoose';
import EventModel, { IEvent } from '../db/models/event.model';

export async function createEvent(data: Partial<IEvent>) {
  await connectToDatabase();
  const ev = await EventModel.create(data);
  return ev.toObject();
}

export async function listEvents(limit = 50) {
  await connectToDatabase();
  return EventModel.find().limit(limit).lean();
}
