import { Prisma as P } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import getClient from "@/prisma/getClient";

export type ErrorMsg = {
    err?: string | Error;
    message?: string;
};

export type WorkspaceResponseData = Array<DatabaseSelect | PageSelect> | ErrorMsg;

const { prisma, provider } = getClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse<WorkspaceResponseData>) {
    switch (req.method) {
        case "GET":
            console.log("get");
            await handleGET({ res });
            break;

        default:
            res.status(500).json({
                message: `The HTTP ${req.method} method is not supported at this route. Supported: GET`,
            });
    }
}

// GET /api/workspaces
async function handleGET({ res }: { res: NextApiResponse<WorkspaceResponseData> }) {
    try {
        const dbs = await getWorkspaceDbs();
        const pages = await getWorkspacePages();
        console.log({ dbs, pages });

        const data = [...dbs, ...pages];
        if (provider === "sqlite") {
            data.map((obj, i) => {
                data[i].title = JSON.parse(data[i].title);
            });
        }
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}

export type DatabaseSelect = P.DatabaseGetPayload<typeof dbSelections>;
export type PageSelect = P.PageGetPayload<typeof pageSelections>;

const dbSelections = P.validator<P.DatabaseFindManyArgs>()({
    where: {
        isWorkspace: true,
    },
    select: {
        id: true,
        object: true,
        isInline: true,
        type: true,
        title: true,
    },
});

const pageSelections = P.validator<P.PageFindManyArgs>()({
    where: {
        isWorkspace: true,
    },
    select: {
        id: true,
        object: true,
        type: true,
        title: true,
        childrenPages: true,
    },
});

async function getWorkspaceDbs(): Promise<DatabaseSelect[]> {
    try {
        return await prisma.database.findMany({
            ...dbSelections,
        });
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function getWorkspacePages(): Promise<PageSelect[]> {
    try {
        return await prisma.page.findMany({
            ...pageSelections,
        });
    } catch (error) {
        console.log(error);
        return [];
    }
}
