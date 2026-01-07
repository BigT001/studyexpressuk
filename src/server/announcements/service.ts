import { Announcement, type IAnnouncement } from '../db/models/announcement.model';

export const announcementService = {
  async createAnnouncement(data: Partial<IAnnouncement>) {
    try {
      const announcement = new Announcement({
        ...data,
        isActive: true,
      });
      await announcement.save();
      console.log('✓ Announcement created:', announcement._id);
      return announcement;
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  },

  async listAnnouncements(limit = 50) {
    try {
      const announcements = await Announcement.find()
        .sort({ createdAt: -1 })
        .limit(limit);
      console.log(`✓ Listed ${announcements.length} announcements`);
      return announcements;
    } catch (error) {
      console.error('Error listing announcements:', error);
      throw error;
    }
  },

  async getAnnouncementById(id: string) {
    try {
      const announcement = await Announcement.findById(id);
      if (!announcement) throw new Error('Announcement not found');
      return announcement;
    } catch (error) {
      console.error('Error fetching announcement:', error);
      throw error;
    }
  },

  async updateAnnouncement(id: string, data: Partial<IAnnouncement>) {
    try {
      const announcement = await Announcement.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!announcement) throw new Error('Announcement not found');
      console.log('✓ Announcement updated:', id);
      return announcement;
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  },

  async deleteAnnouncement(id: string) {
    try {
      const result = await Announcement.findByIdAndDelete(id);
      if (!result) throw new Error('Announcement not found');
      console.log('✓ Announcement deleted:', id);
      return result;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  },

  async getActiveAnnouncements(audience: string) {
    try {
      const announcements = await Announcement.find({
        isActive: true,
        targetAudience: { $in: ['all', audience] },
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: { $gt: new Date() } },
        ],
      }).sort({ createdAt: -1 });
      return announcements;
    } catch (error) {
      console.error('Error fetching active announcements:', error);
      throw error;
    }
  },
};
