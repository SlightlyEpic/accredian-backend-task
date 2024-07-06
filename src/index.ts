import 'dotenv/config';
import express from 'express';

import apiRouter from './api/apiRouter';
import { createPrismaClient } from './lib/prisma';
import { createNodemailer } from './lib/nodemailer';

const app = express();

const prisma = createPrismaClient();
const nodemailer = createNodemailer();

app.use(apiRouter({
    prisma,
    nodemailer,
}));

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
