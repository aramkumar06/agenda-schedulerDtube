import {Router} from 'express';
import {schedulerRouter, logsRouter, uploadRouter, authRouter} from './routes/';
import {hasValidToken, isValidAccount, checkBody} from "./utils";

let router = Router();
// router.use('/cron', isValidAccountObject, schedulerRouter);
// router.use('/logs', isValidAccountObject, logsRouter);
router.use('/auth', authRouter);
router.use('/upload', hasValidToken, isValidAccount, uploadRouter);
router.use('/schedule', hasValidToken, isValidAccount, schedulerRouter);

export let apiRouter = router;

