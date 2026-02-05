import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import MessageModel from '@/server/db/models/message.model';
import { Announcement } from '@/server/db/models/announcement.model';
import mongoose from 'mongoose';

/**
 * Count unread messages for a specific user
 * Messages are considered unread if readAt is null/undefined
 */
export async function getUnreadMessageCount(userId: string | mongoose.Types.ObjectId): Promise<number> {
  try {
    await connectToDatabase();
    const count = await MessageModel.countDocuments({
      recipientId: userId,
      readAt: null,
    });
    return count || 0;
  } catch (error) {
    console.error('Error getting unread message count:', error);
    return 0;
  }
}

/**
 * Count unread announcements for a specific user filtered by role
 * Announcements are considered unread if the user ID is NOT in the readBy array
 * Also filters by targetAudience matching the user's role
 */
export async function getUnreadAnnouncementCount(
  userId: string | mongoose.Types.ObjectId,
  userRole?: 'INDIVIDUAL' | 'CORPORATE' | 'SUBADMIN' | 'ADMIN',
  userCreatedAt?: Date
): Promise<number> {
  try {
    await connectToDatabase();

    // Build the query filter
    const query: any = {
      isActive: true,
      readBy: { $ne: userId },
    };

    // Filter by targetAudience based on user role
    const isRestrictedRole = userRole === 'INDIVIDUAL' || userRole === 'CORPORATE';

    if (userRole === 'CORPORATE') {
      query.targetAudience = { $in: ['corporate', 'all'] };
    } else if (userRole === 'SUBADMIN') {
      query.targetAudience = { $in: ['subadmin', 'all'] };
    } else if (userRole === 'INDIVIDUAL') {
      query.targetAudience = { $in: ['students', 'all'] };
    } else if (userRole === 'ADMIN') {
      // Admins see all announcements
    }

    // Apply creation date filter for restricted roles (new users don't see old announcements)
    if (isRestrictedRole) {
      let joinDate = userCreatedAt;

      // If date not provided but needed, fetch user
      if (!joinDate) {
        const user = await UserModel.findById(userId).select('createdAt');
        if (user) {
          joinDate = user.createdAt;
        }
      }

      if (joinDate) {
        // Allow a small buffer (e.g. 1 minute)
        const dateFilter = new Date(joinDate);
        dateFilter.setMinutes(dateFilter.getMinutes() - 1);
        query.createdAt = { $gte: dateFilter };
      }
    }

    const count = await Announcement.countDocuments(query);
    return count || 0;
  } catch (error) {
    console.error('Error getting unread announcement count:', error);
    return 0;
  }
}

/**
 * Count total messages for a specific user (read or unread)
 */
export async function getTotalMessageCount(userId: string | mongoose.Types.ObjectId): Promise<number> {
  try {
    await connectToDatabase();
    const count = await MessageModel.countDocuments({
      recipientId: userId,
    });
    return count || 0;
  } catch (error) {
    console.error('Error getting total message count:', error);
    return 0;
  }
}

/**
 * Count total active announcements
 */
export async function getTotalAnnouncementCount(): Promise<number> {
  try {
    await connectToDatabase();
    const count = await Announcement.countDocuments({
      isActive: true,
    });
    return count || 0;
  } catch (error) {
    console.error('Error getting total announcement count:', error);
    return 0;
  }
}

/**
 * Get both unread message and announcement counts for a user
 * Returns counts for displaying in UI (usually unread counts)
 */
export async function getCommunicationCounts(
  userId: string | mongoose.Types.ObjectId,
  userRole?: 'INDIVIDUAL' | 'CORPORATE' | 'SUBADMIN' | 'ADMIN'
) {
  const [unreadMessages, unreadAnnouncements] = await Promise.all([
    getUnreadMessageCount(userId),
    getUnreadAnnouncementCount(userId, userRole),
  ]);

  return {
    unreadMessages,
    unreadAnnouncements,
  };
}
