import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { Prisma as P, Database } from "@prisma/client";
import { ErrorMsg } from "src/utils/types";

const prisma = getClient();
const provider = (prisma as any)?._activeProvider;
// ^^ for (const [key, value] of Object.entries(prisma)) {
//     console.log(key);
//     if (key == "_activeProvider") {
//         console.log(value);
//     }
// }
// console.log(prisma?._activeProvider);

type ResponseData = DatabaseWithRelations | Database | ErrorMsg;

export default async function handle(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const { databaseId } = req.query as { [key: string]: string };
    const databaseData: Database = req?.body ? JSON.parse(req.body) : null;

    switch (req.method) {
        case "GET":
            handleGET({ databaseId, res });
            break;

        case "PUT":
            handlePUT({ databaseId, databaseData, res });
            break;

        case "DELETE":
            handleDELETE({ databaseId, res });
            break;

        default:
            res.status(500).json({
                err: `The HTTP ${req.method} method is not supported at this route.
        Supported: GET/PUT/DELETE`,
            });
    }
}

// GET /api/databases/:id
async function handleGET({ databaseId, res }: { databaseId: string; res: NextApiResponse<ResponseData> }) {
    try {
        const data = await getDatabaseWithRelations(databaseId);

        if (provider === "sqlite") {
            data.childrenPages.map((page) => {
                page.title = JSON.parse(page.title);
                page.icon = JSON.parse(page.icon);
                page.cover = JSON.parse(page.cover);
                page.propertyValues = JSON.parse(page.propertyValues);
            });

            data.views.map((view) => {
                let { format } = view;
                format.details = JSON.parse(format.details);
                format.order = JSON.parse(format.order);
            });
        }

        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error });
    }
}

// PUT /api/databases/:id
async function handlePUT({
    databaseId,
    databaseData,
    res,
}: {
    databaseId: string;
    databaseData: Database;
    res: NextApiResponse<ResponseData>;
}) {
    try {
        const data = await updateDatabase(databaseId, databaseData);

        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error });
    }
}

// DELETE /api/databases/:id
async function handleDELETE({ databaseId, res }: { databaseId: string; res: NextApiResponse<ResponseData> }) {
    try {
        const deletedDatabase = await updateDatabase(databaseId, {
            archived: true,
        });

        res.status(200).json({
            message: `${deletedDatabase.id} archived successfully.`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error });
    }
}

export type DatabaseWithRelations = P.DatabaseGetPayload<typeof dbIncludeRelations>;

const dbIncludeRelations = P.validator<P.DatabaseArgs>()({
    include: {
        properties: true,
        views: {
            include: {
                format: true,
            },
        },
        childrenPages: {
            where: { archived: false },
        },
    },
});

async function getDatabaseWithRelations(databaseId: string): Promise<DatabaseWithRelations> {
    return await prisma.database.findUniqueOrThrow({
        where: { id: databaseId },
        ...dbIncludeRelations,
    });
}

async function updateDatabase(databaseId: string, databaseData: P.DatabaseUpdateInput) {
    if (provider !== "sqlite") {
        return await prisma.database.update({
            where: {
                id: databaseId,
            },
            data: {
                object: databaseData?.object || undefined,
                isWorkspace: databaseData?.isWorkspace || undefined,
                isInline: databaseData?.isInline || undefined,
                archived: databaseData?.archived || undefined,
                type: databaseData?.type || undefined,
                title: databaseData?.title || undefined,
                description: databaseData?.description || undefined,
                icon: databaseData?.icon || undefined,
                cover: databaseData?.cover || undefined,
            },
        });
    } else {
        return await prisma.database.update({
            where: {
                id: databaseId,
            },
            data: {
                object: databaseData?.object || undefined,
                isWorkspace: databaseData?.isWorkspace || undefined,
                isInline: databaseData?.isInline || undefined,
                archived: databaseData?.archived || undefined,
                type: databaseData?.type || undefined,
                title: databaseData?.title ? JSON.stringify(databaseData?.title) : undefined,
                description: databaseData?.description ? JSON.stringify(databaseData?.description) : undefined,
                icon: databaseData?.icon ? JSON.stringify(databaseData?.icon) : undefined,
                cover: databaseData?.cover ? JSON.stringify(databaseData?.cover) : undefined,
            },
        });
    }
}
