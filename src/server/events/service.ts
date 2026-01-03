import { connectToDatabase } from '../db/mongoose';
import EventModel from '../db/models/event.model';

export async function createEvent(data: Partial<{ title: string; description?: string; type?: string; access?: string; startDate?: Date; endDate?: Date; capacity?: number; createdBy?: string; metadata?: any }>) {
  await connectToDatabase();
  const ev = await EventModel.create(data as any);
  return ev.toObject();
}

export async function listEvents(limit = 50) {
  await connectToDatabase();
  return EventModel.find().limit(limit).lean();
}
