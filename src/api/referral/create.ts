import { type RequestHandler } from 'express';
import { type PrismaClient } from '@prisma/client';
import { type Transporter } from 'nodemailer';
import { z } from 'zod';

const bodySchema = z.object({
    referrerEmail: z.string().email("Must be an email."),
    referrerName: z.string().min(1, "Cannot be empty").max(15, "Cannot be longer than 15 characters"),
    referredEmail: z.string().email("Must be an email."),
    referredName: z.string().min(1, "Cannot be empty").max(15, "Cannot be longer than 15 characters"),
});

interface Dependencies {
    prisma: PrismaClient
    nodemailer: Transporter
}

const handler: (deps: Dependencies) => RequestHandler = (deps: Dependencies) => async (req, res) => {
    const parseResult = bodySchema.safeParse(req.body);

    if(!parseResult.success) {
        return res.status(400).json({
            msg: 'Error',
            error: parseResult.error
        });
    }

    const body = parseResult.data;

    try {
        const referral = await deps.prisma.referral.create({
            data: body
        });

        const emailText = `Hi ${body.referredName}, you have been referred to accredian by ${body.referrerName} (${body.referrerEmail}) and are eligible for a ₹10,000 discount!\n` +
                            `Follow this link to learn more: ${process.env.SITE_ORIGIN}/referral/${referral.id}`;

        await deps.nodemailer.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: body.referredEmail,
            subject: 'You have been referred to accredian!',
            text: emailText
        });

        return res.json({
            msg: 'Success',
            data: {
                referralUrl: `${process.env.SITE_ORIGIN}/referral/${referral.id}`
            }
        });
    } catch(err) {
        return res.status(500).json({
            msg: 'Error',
            error: err
        });
    }
};

export default handler;
