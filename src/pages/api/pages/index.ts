import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { Page } from "@prisma/client";
import { ErrorMsg } from "src/utils/types";

const prisma = getClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse<Page | Page[] | Err>) {
    const pageData: Page = req?.body ? JSON.parse(req.body) : null;

    switch (req.method) {
        case "GET":
            handleGET({ res });
            break;

        case "POST":
            console.log(req.body);
            handlePOST({ pageData, res });
            break;

        default:
            res.status(500).json({
                message: `The HTTP ${req.method} method is not supported at this route. Supported: POST/GET`,
            });
    }
}

// POST /api/pages
async function handlePOST({ pageData, res }: { pageData: Page; res: NextApiResponse<Page | Err> }) {
    try {
        const page = await prisma.page.create({
            data: { ...pageData },
        });

        res.status(200).json(page);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error });
    }
}
// GET /api/pages
async function handleGET({ res }: { res: NextApiResponse<Page[] | Err> }) {
    try {
        const allPages = await prisma.page.findMany();

        res.status(200).json(allPages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error });
    }
}
