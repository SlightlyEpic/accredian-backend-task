import { type RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

interface Dependencies {
    prisma: PrismaClient
}

const bodySchema = z.object({
    id: z.coerce.number().nonnegative("Invalid id")
});

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
        const referral = await deps.prisma.referral.findUnique({
            where: {
                id: body.id
            }
        });

        if(!referral || !referral.pending) {
            return res.status(400).json({
                msg: 'Error',
                error: 'Invalid id'
            });
        }

        await deps.prisma.referral.update({
            data: {
                pending: false
            },
            where: {
                id: body.id
            }
        });

        return res.json({
            msg: 'Success',
            referrerName: referral.referrerName,
            referredName: referral.referredName,
        });
    } catch(err) {
        return res.status(500).json({
            msg: 'Error',
            error: err
        });
    }
}

export default handler;
