import { Router } from 'express';
import { ChatbotController } from '../controllers/chatbot.controller';

const router = Router();
const chatbotController = new ChatbotController();

router.post('/message', chatbotController.sendMessage);

export const chatbotRouter = router;