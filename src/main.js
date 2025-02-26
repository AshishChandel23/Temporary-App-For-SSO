import express from 'express';
import authRouter from './auth/index';

const router = express();

router.use('/auth', authRouter);

export default router;