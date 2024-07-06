import express from 'express';
import cors from 'cors';
import { type Transporter } from 'nodemailer';
import { type PrismaClient } from '@prisma/client';

import referralUpdateHandler from './referral/update';
import referralCreateHandler from './referral/create';

interface ApiRouterDependencies {
    prisma: PrismaClient
    nodemailer: Transporter
}

const apiRouter = (deps: ApiRouterDependencies) => {
    const router = express.Router();

    router.use(cors({
        origin: process.env.SITE_ORIGIN,
    }))
    router.use(express.json());

    router.post('/referral/update', referralUpdateHandler(deps));
    router.post('/referral/create', referralCreateHandler(deps));

    return router;
}

export default apiRouter;
