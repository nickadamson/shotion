import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { View } from "@prisma/client";

const { prisma } = getClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { viewId } = req.query as { [key: string]: string };
    const viewData: View = req?.body ? JSON.parse(req.body) : null;

    switch (req.method) {
        case "GET":
            handleGET({ viewId, res });
            break;

        case "PUT":
            handlePUT({ viewId, viewData, res });
            break;

        case "DELETE":
            handleDELETE({ viewId, res });
            break;

        default:
            res.status(500).json({
                err: `The HTTP ${req.method} method is not supported at this route.
        Supported: GET/PUT/DELETE`,
            });
    }
}

// GET /api/views/:id
async function handleGET({ viewId, res }: { viewId: string; res: NextApiResponse }) {
    try {
        const data = await prisma.view.findUniqueOrThrow({
            where: { id: viewId },
        });

        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}

// PUT /api/views/:id
async function handlePUT({ viewId, viewData, res }: { viewId: string; viewData: View; res: NextApiResponse }) {
    try {
        const view = await prisma.view.update({
            where: {
                id: viewId,
            },
            data: { ...viewData },
        });

        res.status(200).json(view);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}

// DELETE /api/views/:id
async function handleDELETE({ viewId, res }: { viewId: string; res: NextApiResponse }) {
    try {
        const deletedView = await prisma.view.delete({
            where: { id: viewId },
        });

        res.status(200).json({
            message: `${deletedView.id} deleted successfully.`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}
