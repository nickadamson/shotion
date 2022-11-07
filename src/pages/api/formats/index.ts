import { Format } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import getClient from "@/prisma/getClient";
import { ErrorMsg } from "src/pages/api/workspaces";

const { prisma } = getClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse<Format | Format[] | ErrorMsg>) {
    const formatData: Format = req?.body ? JSON.parse(req.body) : null;

    switch (req.method) {
        case "GET":
            handleGET({ res });
            break;

        case "POST":
            console.log(req.body);
            handlePOST({ formatData, res });
            break;

        default:
            res.status(500).json({
                message: `The HTTP ${req.method} method is not supported at this route. Supported: POST/GET`,
            });
    }
}

// POST /api/formats
async function handlePOST({ formatData, res }: { formatData: Format; res: NextApiResponse<Format | ErrorMsg> }) {
    try {
        const format = await prisma.format.create({
            data: { ...formatData },
        });

        res.status(200).json(format);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}
// GET /api/formats
async function handleGET({ res }: { res: NextApiResponse<Format[] | ErrorMsg> }) {
    try {
        const allFormats = await prisma.format.findMany();

        res.status(200).json(allFormats);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}
