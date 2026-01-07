import { EmailNotification, type IEmailNotification } from '../db/models/email-notification.model';

export const emailService = {
  async createEmailNotification(data: Partial<IEmailNotification>) {
    try {
      const email = new EmailNotification({
        ...data,
        status: 'draft',
      });
      await email.save();
      console.log('✓ Email notification created:', email._id);
      return email;
    } catch (error) {
      console.error('Error creating email notification:', error);
      throw error;
    }
  },

  async sendEmailNotification(id: string) {
    try {
      const email = await EmailNotification.findByIdAndUpdate(
        id,
        {
          status: 'sending',
          sentAt: new Date(),
        },
        { new: true }
      );
      if (!email) throw new Error('Email notification not found');
      
      // Simulate sending (in production, integrate with actual email service)
      console.log('✓ Email notification sending:', id);
      
      // Update status to sent
      const updated = await EmailNotification.findByIdAndUpdate(
        id,
        {
          status: 'sent',
          successCount: email.recipientCount || 0,
        },
        { new: true }
      );
      return updated;
    } catch (error) {
      console.error('Error sending email:', error);
      await EmailNotification.findByIdAndUpdate(id, { status: 'failed' });
      throw error;
    }
  },

  async listEmails(limit = 50) {
    try {
      const emails = await EmailNotification.find()
        .sort({ createdAt: -1 })
        .limit(limit);
      console.log(`✓ Listed ${emails.length} email notifications`);
      return emails;
    } catch (error) {
      console.error('Error listing emails:', error);
      throw error;
    }
  },

  async getEmailById(id: string) {
    try {
      const email = await EmailNotification.findById(id);
      if (!email) throw new Error('Email notification not found');
      return email;
    } catch (error) {
      console.error('Error fetching email:', error);
      throw error;
    }
  },

  async updateEmail(id: string, data: Partial<IEmailNotification>) {
    try {
      const email = await EmailNotification.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!email) throw new Error('Email notification not found');
      console.log('✓ Email updated:', id);
      return email;
    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  },

  async deleteEmail(id: string) {
    try {
      const result = await EmailNotification.findByIdAndDelete(id);
      if (!result) throw new Error('Email notification not found');
      console.log('✓ Email deleted:', id);
      return result;
    } catch (error) {
      console.error('Error deleting email:', error);
      throw error;
    }
  },
};
