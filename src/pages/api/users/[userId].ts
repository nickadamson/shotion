import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { User } from "@prisma/client";
import { ErrorMsg } from "src/utils/types";

const prisma = getClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse<User | Err>) {
    const { userId } = req.query as { [key: string]: string };
    const userData: User = req?.body ? JSON.parse(req.body) : null;

    switch (req.method) {
        case "GET":
            handleGET({ userId, res });
            break;

        case "PUT":
            handlePUT({ userId, userData, res });
            break;

        case "DELETE":
            handleDELETE({ userId, res });
            break;

        default:
            res.status(500).json({
                err: `The HTTP ${req.method} method is not supported at this route.
        Supported: GET/PUT/DELETE`,
            });
    }
}

// GET /api/users/:id
async function handleGET({ userId, res }: { userId: string; res: NextApiResponse<User | Err> }) {
    try {
        const user = await findByIdOrUsername(userId);

        if (user != null) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: `User with id: ${userId} not found.` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error });
    }
}

// PUT /api/users/:id
async function handlePUT({
    userId,
    userData,
    res,
}: {
    userId: string;
    userData: User;
    res: NextApiResponse<User | Err>;
}) {
    try {
        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: userData,
        });

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error });
    }
}

// DELETE /api/users/:id
async function handleDELETE({ userId, res }: { userId: string; res: NextApiResponse<User | Err> }) {
    try {
        const deletedUser = await prisma.user.delete({
            where: { id: userId },
        });

        res.status(200).json({
            message: `${deletedUser.username} deleted successfully.`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error });
    }
}

// helpers
async function findByIdOrUsername(idOrUsername: string): Promise<User | null> {
    let user;

    try {
        user = await prisma.user.findUnique({
            where: { id: idOrUsername },
            rejectOnNotFound: true,
        });
    } catch (error) {
        try {
            user = await prisma.user.findUnique({
                where: { username: idOrUsername },
                rejectOnNotFound: true,
            });
        } catch (error) {}
    }

    return user;
}
