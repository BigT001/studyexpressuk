import { Announcement, type IAnnouncement } from '../db/models/announcement.model';
import NotificationModelInstance from '../db/models/notification.model';
import User from '../db/models/user.model';

export const announcementService = {
  async createAnnouncement(data: Partial<IAnnouncement>) {
    try {
      console.log('📝 Creating announcement with data:', JSON.stringify(data));
      const announcement = new Announcement({
        ...data,
        isActive: true,
      });
      console.log('📝 Announcement instance created, saving...');
      await announcement.save();
      console.log('✓ Announcement saved:', announcement._id);

      // Create notifications for targeted users
      console.log('📬 Dispatching notifications...');
      await this.dispatchNotifications(announcement);
      console.log('✓ Notifications dispatched');

      return announcement;
    } catch (error: any) {
      console.error('❌ Error creating announcement:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  },

  async dispatchNotifications(announcement: IAnnouncement) {
    try {
      console.log('📬 Dispatch notifications starting for:', announcement.title);
      console.log('📬 Target audience:', announcement.targetAudience);
      console.log('📬 Announcement type/priority:', announcement.type);
      
      // Determine target audience
      const roleMap: Record<string, string | null> = {
        'all': null,
        'individual': 'INDIVIDUAL',
        'corporate': 'CORPORATE',
        'subadmin': 'SUB_ADMIN',
      };

      const query: Record<string, string> = {};
      const targetRole = roleMap[announcement.targetAudience || 'all'];
      console.log('📬 Target role mapped to:', targetRole);
      if (targetRole) {
        query.role = targetRole;
      }

      // Find all users in target audience
      console.log('📬 Finding users with query:', JSON.stringify(query));
      const recipients = await User.find(query).select('_id');
      console.log(`📬 Found ${recipients.length} recipients for announcement`);

      if (recipients.length === 0) {
        console.log('⚠️  No recipients found, skipping notification dispatch');
        return [];
      }

      // Map announcement type to priority
      const priorityMap: Record<string, 'normal' | 'high' | 'urgent'> = {
        'info': 'normal',
        'success': 'normal',
        'warning': 'high',
        'urgent': 'urgent',
      };

      // Create notifications for each recipient
      console.log('📬 Creating notification promises...');
      const notificationPromises = recipients.map((recipient) => {
        console.log('📬 Creating notification for user:', recipient._id);
        return NotificationModelInstance.create({
          userId: recipient._id,
          type: 'announcement',
          title: announcement.title,
          body: announcement.content,
          content: announcement.content,
          priority: priorityMap[announcement.type] || 'normal',
          status: 'unread',
          createdAt: new Date(),
        });
      });

      console.log('📬 Awaiting all notification promises...');
      const createdNotifications = await Promise.all(notificationPromises);
      console.log(`✓ Created ${createdNotifications.length} notifications for announcement`);

      return createdNotifications;
    } catch (error: any) {
      console.error('❌ Error dispatching notifications:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      // Don't throw - notification dispatch failure shouldn't block announcement creation
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
