import { connectToDatabase } from '../db/mongoose';
import UserModel from '../db/models/user.model';

/**
 * Track user activity
 * Updates both lastLogin (on first login) and lastActivity (on every API call/page view)
 * Activity is considered "current" if within the last 5 minutes
 */
export async function updateUserActivity(userId: string, isLoginEvent: boolean = false): Promise<Date | null> {
  try {
    await connectToDatabase();
    const now = new Date();
    
    const updateData: any = { lastActivity: now };
    
    // Only update lastLogin if this is an explicit login event (password verification)
    if (isLoginEvent) {
      updateData.lastLogin = now;
    }
    
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).lean().maxTimeMS(30000);
    
    if (updatedUser) {
      const eventType = isLoginEvent ? 'login' : 'activity';
      console.log(`[ActivityTracker] Updated ${eventType} for user ${userId}`);
      return now;
    }
    
    console.warn(`[ActivityTracker] User not found: ${userId}`);
    return null;
  } catch (error) {
    console.error('[ActivityTracker] Error updating activity:', error);
    // Don't throw - this should not block the user's request
    return null;
  }
}

/**
 * Check if a user is currently active (within last 5 minutes)
 */
export function isUserCurrentlyActive(user: any, thresholdMinutes: number = 5): boolean {
  if (!user) return false;
  
  const lastActivityTime = user.lastActivity || user.lastLogin;
  if (!lastActivityTime) return false;
  
  const lastActivityDate = new Date(lastActivityTime);
  const minutesSinceActivity = Math.floor((Date.now() - lastActivityDate.getTime()) / (1000 * 60));
  
  return minutesSinceActivity < thresholdMinutes;
}

/**
 * Track user login activity (legacy - now calls updateUserActivity with isLoginEvent flag)
 * Updates the lastLogin timestamp for a user
 * Falls back to createdAt if lastLogin is not available
 */
export async function updateUserLastLogin(userId: string): Promise<Date | null> {
  return updateUserActivity(userId, true);
}

/**
 * Get user's last activity time
 * Returns lastActivity if available, falls back to lastLogin, then createdAt
 */
export function getLastActivityTime(user: any): Date | null {
  if (!user) return null;
  
  // If lastActivity exists, use it (most recent indicator)
  if (user.lastActivity) {
    return new Date(user.lastActivity);
  }
  
  // Fallback to lastLogin
  if (user.lastLogin) {
    return new Date(user.lastLogin);
  }
  
  // Final fallback to createdAt (user's account creation date)
  if (user.createdAt) {
    return new Date(user.createdAt);
  }
  
  return null;
}

/**
 * Get user's last login time (explicit login events only)
 * Returns lastLogin if available, otherwise returns createdAt as fallback
 */
export function getLastLoginTime(user: any): Date | null {
  if (!user) return null;
  
  // If lastLogin exists, use it
  if (user.lastLogin) {
    return new Date(user.lastLogin);
  }
  
  // Fallback to createdAt (user's account creation date)
  if (user.createdAt) {
    return new Date(user.createdAt);
  }
  
  return null;
}

/**
 * Calculate days/hours since last activity
 * Returns a number or null if no activity info available
 */
export function getTimeSinceLastActivity(user: any): { value: number; unit: string } | null {
  const lastActivityTime = getLastActivityTime(user);
  
  if (!lastActivityTime) return null;
  
  const msAgo = Date.now() - lastActivityTime.getTime();
  const minutesAgo = Math.floor(msAgo / (1000 * 60));
  const hoursAgo = Math.floor(msAgo / (1000 * 60 * 60));
  const daysAgo = Math.floor(msAgo / (1000 * 60 * 60 * 24));
  
  if (minutesAgo < 1) {
    return { value: 0, unit: 'now' };
  } else if (minutesAgo < 60) {
    return { value: minutesAgo, unit: 'minute' };
  } else if (hoursAgo < 24) {
    return { value: hoursAgo, unit: 'hour' };
  } else {
    return { value: daysAgo, unit: 'day' };
  }
}

/**
 * Calculate days since last login
 * Returns the number of days, or null if no login info available
 */
export function getDaysSinceLastLogin(user: any): number | null {
  const lastLoginTime = getLastLoginTime(user);
  
  if (!lastLoginTime) return null;
  
  const daysDiff = Math.floor((Date.now() - lastLoginTime.getTime()) / (1000 * 60 * 60 * 24));
  return daysDiff;
}

/**
 * Get formatted activity status for UI display
 * Returns human-readable activity status with real-time "currently active" indicator
 */
export function getFormattedActivityStatus(user: any): {
  status: string;
  isCurrentlyActive: boolean;
  timeSinceActivity: { value: number; unit: string } | null;
  lastActivityDate: Date | null;
} {
  const lastActivityTime = getLastActivityTime(user);
  const currentlyActive = isUserCurrentlyActive(user, 5); // 5 minute threshold
  
  if (!lastActivityTime) {
    return {
      status: 'Never active',
      isCurrentlyActive: false,
      timeSinceActivity: null,
      lastActivityDate: null
    };
  }
  
  const timeSinceActivity = getTimeSinceLastActivity(user);
  
  let status = '';
  if (currentlyActive) {
    status = '🟢 Active now';
  } else if (timeSinceActivity) {
    const { value, unit } = timeSinceActivity;
    if (unit === 'now') {
      status = '🟢 Just now';
    } else if (unit === 'minute') {
      status = `🟢 ${value} ${value === 1 ? 'minute' : 'minutes'} ago`;
    } else if (unit === 'hour') {
      status = `🟡 ${value} ${value === 1 ? 'hour' : 'hours'} ago`;
    } else if (unit === 'day' && value <= 1) {
      status = '🟡 Today';
    } else if (unit === 'day' && value <= 2) {
      status = '🟡 Yesterday';
    } else if (unit === 'day' && value <= 7) {
      status = `🟡 ${value} days ago`;
    } else if (unit === 'day' && value <= 30) {
      status = `🟠 ${value} days ago`;
    } else {
      status = `🔴 ${value} days ago`;
    }
  }
  
  return {
    status,
    isCurrentlyActive: currentlyActive,
    timeSinceActivity,
    lastActivityDate: lastActivityTime
  };
}

/**
 * Get formatted login status for UI display (legacy - now uses activity)
 * Returns human-readable login status
 */
export function getFormattedLoginStatus(user: any): {
  status: string;
  daysAgo: number | null;
  hasEverLogged: boolean;
  lastLoginDate: Date | null;
} {
  // For backwards compatibility, now delegates to activity status
  const activityStatus = getFormattedActivityStatus(user);
  
  return {
    status: activityStatus.status,
    daysAgo: activityStatus.timeSinceActivity?.unit === 'day' ? activityStatus.timeSinceActivity.value : null,
    hasEverLogged: user.lastLogin ? true : false,
    lastLoginDate: getLastLoginTime(user)
  };
}

/**
 * Get engagement summary for a user
 */
export function getEngagementSummary(user: any) {
  const activityStatus = getFormattedActivityStatus(user);
  const accountAge = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    lastActivity: activityStatus.lastActivityDate,
    lastActivityStatus: activityStatus.status,
    isCurrentlyActive: activityStatus.isCurrentlyActive,
    timeSinceActivity: activityStatus.timeSinceActivity,
    accountAge,
    // Legacy fields for backwards compatibility
    lastLoginStatus: activityStatus.status,
  };
}
