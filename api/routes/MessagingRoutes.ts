import express from 'express';
import MessagingController from "../controllers/MessagingController";

const router = express.Router();

// Start or get conversation
router.post('/conversation/start', MessagingController.startConversation);

// Sending message
router.post('/message/send', MessagingController.sendMessage);

// Conversations list
router.get('/admin/conversations/:admin_id', MessagingController.getAdminConversations);
router.get('/user/conversations/:user_id', MessagingController.getUserConversations);

// Messages in conversation
router.get('/messages/:conversation_id', MessagingController.getMessages);

// Mark read
router.patch('/message/read/:message_id', MessagingController.markAsRead);
export default router;
