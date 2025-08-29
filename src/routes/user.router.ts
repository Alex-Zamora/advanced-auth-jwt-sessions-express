import { Router } from 'express';
import { authentication } from '@middlewares/auth.middleware';
import { getUsersController } from '@controllers/user.controller';

const router = Router();

router.get('/users', authentication, getUsersController);

export default router;
