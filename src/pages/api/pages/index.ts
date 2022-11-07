import { Page } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import getClient from "@/prisma/getClient";
import { ErrorMsg } from "src/pages/api/workspaces";

import { PageWithRelations, ParsedPage, parsePageJSON, stringifyPageJSON } from "./[pageId]";

const { prisma, provider } = getClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse<Page | Page[] | ErrorMsg>) {
    const pageData: Partial<Page> = req?.body ? JSON.parse(req.body) : null;

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
async function handlePOST({ pageData, res }: { pageData: Partial<Page>; res: NextApiResponse<Page | ErrorMsg> }) {
    try {
        if (provider === "sqlite") {
            pageData = stringifyPageJSON(pageData as ParsedPage);
        }

        const page = await prisma.page.create({
            data: { ...pageData },
        });

        res.status(200).json(page);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}
// GET /api/pages
async function handleGET({ res }: { res: NextApiResponse<Page[] | ErrorMsg> }) {
    try {
        const allPages = await prisma.page.findMany();

        if (provider === "sqlite") {
            allPages.map((page, i) => {
                allPages[i] = parsePageJSON(page as PageWithRelations);
            });
        }

        res.status(200).json(allPages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}
