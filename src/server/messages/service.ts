import { GroupMessage, type IGroupMessage } from '../db/models/message.model';

export const messageService = {
  async sendMessage(data: Partial<IGroupMessage>) {
    try {
      const message = new GroupMessage({
        ...data,
        status: 'sent',
        sentAt: new Date(),
      });
      await message.save();
      console.log('✓ Message sent:', message._id);
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async saveDraftMessage(data: Partial<IGroupMessage>) {
    try {
      const message = new GroupMessage({
        ...data,
        status: 'draft',
      });
      await message.save();
      console.log('✓ Draft message saved:', message._id);
      return message;
    } catch (error) {
      console.error('Error saving draft:', error);
      throw error;
    }
  },

  async listMessages(limit = 50) {
    try {
      const messages = await GroupMessage.find()
        .sort({ createdAt: -1 })
        .limit(limit);
      console.log(`✓ Listed ${messages.length} messages`);
      return messages;
    } catch (error) {
      console.error('Error listing messages:', error);
      throw error;
    }
  },

  async getMessageById(id: string) {
    try {
      const message = await GroupMessage.findById(id);
      if (!message) throw new Error('Message not found');
      return message;
    } catch (error) {
      console.error('Error fetching message:', error);
      throw error;
    }
  },

  async updateMessage(id: string, data: Partial<IGroupMessage>) {
    try {
      const message = await GroupMessage.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!message) throw new Error('Message not found');
      console.log('✓ Message updated:', id);
      return message;
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  },

  async deleteMessage(id: string) {
    try {
      const result = await GroupMessage.findByIdAndDelete(id);
      if (!result) throw new Error('Message not found');
      console.log('✓ Message deleted:', id);
      return result;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },
  // Fetch all messages between two users (admin and user)
  async getConversation(userA: string, userB: string) {
    try {
      // Use MessageModel for direct messages
      const MessageModel = (await import('../db/models/message.model')).default;
      const messages = await MessageModel.find({
        $or: [
          { senderId: userA, recipientId: userB },
          { senderId: userB, recipientId: userA }
        ]
      })
        .populate('senderId', 'firstName lastName email role profileImage')
        .populate('recipientId', 'firstName lastName email role profileImage')
        .sort({ createdAt: 1 });
      return messages;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }
};
