import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { Prisma as P, Database } from "@prisma/client";
import { ErrorMsg } from "src/utils/types";

const { prisma, provider } = getClient();

export type DatabaseWithRelations = P.DatabaseGetPayload<typeof dbIncludeRelations>;

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
        let data = await getDatabaseWithRelations(databaseId);

        if (provider === "sqlite") {
            data = parseDbJSON(data);
        }

        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
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
        if (provider === "sqlite") {
            databaseData = stringifyDbJSON(databaseData as DatabaseWithRelations);
        }

        const data = await updateDatabase(databaseId, databaseData);

        res.status(200).json(data as ResponseData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}

// DELETE /api/databases/:id
async function handleDELETE({ databaseId, res }: { databaseId: string; res: NextApiResponse<ResponseData> }) {
    try {
        await updateDatabase(databaseId, {
            archived: true,
        });

        res.status(200).json({
            message: `${databaseId} archived successfully.`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}

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

async function updateDatabase(databaseId: string, databaseData: P.DatabaseUpdateInput): Promise<Database | null> {
    if (provider !== "sqlite") {
        try {
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
        } catch (error) {
            console.log(error);
            return null;
        }
    } else {
        try {
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
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

// for sqlite
export function parseDbJSON(db: DatabaseWithRelations): DatabaseWithRelations {
    db.title = JSON.parse(db?.title as string) ?? undefined;
    db.description = JSON.parse(db?.description as string) ?? undefined;
    db.icon = JSON.parse(db?.icon as string) ?? undefined;
    db.cover = JSON.parse(db?.cover as string) ?? undefined;

    db.properties =
        db?.properties?.map((property) => ({
            ...property,
            details: JSON.parse(property?.details as string) ?? undefined,
        })) ?? undefined;

    db.childrenPages =
        db?.childrenPages?.map((page) => {
            page.title = JSON.parse(page?.title as string) ?? undefined;
            page.icon = JSON.parse(page?.icon as string) ?? undefined;
            page.cover = JSON.parse(page?.cover as string) ?? undefined;
            page.propertyValues = JSON.parse(page?.propertyValues as string) ?? undefined;
            return page;
        }) ?? undefined;

    db.views =
        db?.views?.map((view) => {
            if (view?.format) {
                const { format } = view;
                view.format.details = JSON.parse(format?.details as string) ?? undefined;
                view.format.order = JSON.parse(format?.order as string) ?? undefined;
            }
            return view;
        }) ?? undefined;

    return db;
}

export function stringifyDbJSON(db: DatabaseWithRelations): DatabaseWithRelations {
    db.title = JSON.stringify(db?.title as string) ?? undefined;
    db.description = JSON.stringify(db?.description as string) ?? undefined;
    db.icon = JSON.stringify(db?.icon as string) ?? undefined;
    db.cover = JSON.stringify(db?.cover as string) ?? undefined;

    db.properties =
        db?.properties?.map((property) => ({
            ...property,
            details: JSON.stringify(property?.details as string) ?? undefined,
        })) ?? undefined;

    db.childrenPages =
        db?.childrenPages?.map((page) => {
            page.title = JSON.stringify(page?.title as string) ?? undefined;
            page.icon = JSON.stringify(page?.icon as string) ?? undefined;
            page.cover = JSON.stringify(page?.cover as string) ?? undefined;
            page.propertyValues = JSON.stringify(page?.propertyValues as string) ?? undefined;
            return page;
        }) ?? undefined;

    db.views =
        db?.views?.map((view) => {
            if (view?.format) {
                const { format } = view;
                format.details = JSON.stringify(format?.details as string) ?? undefined;
                format.order = JSON.stringify(format?.order as string) ?? undefined;
            }
            return view;
        }) ?? undefined;

    return db;
}
