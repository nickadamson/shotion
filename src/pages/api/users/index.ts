import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import getClient from "@/prisma/getClient";
import { ErrorMsg } from "src/pages/api/workspaces";

const { prisma } = getClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse<User | User[] | ErrorMsg>) {
    const userData: User = req?.body ? JSON.parse(req.body) : null;

    switch (req.method) {
        case "GET":
            handleGET({ res });
            break;

        case "POST":
            handlePOST({ userData, res });
            break;

        default:
            res.status(500).json({
                message: `The HTTP ${req.method} method is not supported at this route. Supported: POST/GET`,
            });
    }
}

// POST /api/users
async function handlePOST({ userData, res }: { userData: User; res: NextApiResponse<User | ErrorMsg> }) {
    try {
        const user = await prisma.user.create({
            data: { ...userData },
        });

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}
// GET /api/users
async function handleGET({ res }: { res: NextApiResponse<User[] | ErrorMsg> }) {
    try {
        const allUsers = await prisma.user.findMany();

        res.status(200).json(allUsers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}
