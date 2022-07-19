import { Database, Prisma as P } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import getClient from "@/prisma/getClient";
import { ErrorMsg } from "src/pages/api/workspaces";

import { ParsedPage } from "../pages/[pageId]";
import { ParsedProperty } from "../properties/[propertyId]";
import { ParsedView } from "../views/[viewId]";

const { prisma, provider } = getClient();

type DatabaseWRelations = P.DatabaseGetPayload<typeof dbIncludeRelations>;

type IntermediaryDatabase = Pick<
    DatabaseWRelations,
    "id" & "object" & "cover" & "icon" & "isWorkspace" & "isInline" & "type" & "title" & "description"
> & {
    id: string;
    isInline: boolean;
};

export type ParsedDatabase = IntermediaryDatabase & {
    properties: ParsedProperty[];
    views: ParsedView[];
    childrenPages: ParsedPage[];
};

type ResponseData = ParsedDatabase | Database | ErrorMsg;

export default async function handle(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const { databaseId } = req.query as { [key: string]: string };
    const databaseData: ParsedDatabase | Partial<Database> = req?.body ? JSON.parse(req.body) : null;

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
        let data: DatabaseWRelations | ParsedDatabase = await getDatabaseWithRelations(databaseId);

        if (provider === "sqlite") {
            data = parseDbJSON(data as DatabaseWRelations);
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
    databaseData: ParsedDatabase | Partial<Database>;
    res: NextApiResponse<ResponseData>;
}) {
    try {
        if (provider === "sqlite") {
            databaseData = stringifyDbJSON(databaseData as ParsedDatabase);
        }

        const data = await updateDatabase(databaseId, databaseData as Partial<Database>);

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

async function getDatabaseWithRelations(databaseId: string): Promise<DatabaseWRelations> {
    return prisma.database.findUniqueOrThrow({
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
export function parseDbJSON(db: DatabaseWRelations): ParsedDatabase {
    console.log(db);
    console.log(1);
    const title = JSON.parse(db.title);
    console.log(2);
    const description = JSON.parse(db.description);
    console.log(3);
    const icon = JSON.parse(db.icon);
    console.log(4);
    const cover = JSON.parse(db.cover);
    console.log(5);
    const properties = db?.properties?.map((property) => ({
        ...property,
        details: JSON?.parse((property?.details as string) ?? undefined),
    }));
    console.log(6);
    const childrenPages = db?.childrenPages?.map((page) => {
        const parsedPage = {
            ...page,
            title: JSON.parse((page?.title as string) ?? undefined),
            icon: JSON.parse((page?.icon as string) ?? undefined),
            cover: JSON.parse((page?.cover as string) ?? undefined),
            propertyValues: JSON.parse((page?.propertyValues as string) ?? undefined),
        };
        return { ...parsedPage };
    });
    console.log(7);
    const views = db?.views?.map((view) => {
        const parsedView = {
            ...view,
            format: {
                ...view.format,
                details: JSON.parse((view?.format?.details as string) ?? undefined),
            },
        };

        return parsedView;
    });
    console.log(8);
    const parsed = {
        ...db,
        title: JSON.parse(db?.title as string) ?? undefined,
        description: JSON.parse(db?.description as string) ?? undefined,
        icon: JSON.parse(db?.icon as string) ?? undefined,
        cover: JSON.parse(db?.cover as string) ?? undefined,

        properties: db?.properties?.map((property) => ({
            ...property,
            details: JSON.parse((property?.details as string) ?? undefined),
        })),

        childrenPages: db?.childrenPages?.map((page) => {
            const parsedPage = {
                ...page,
                title: JSON.parse((page?.title as string) ?? undefined),
                icon: JSON.parse((page?.icon as string) ?? undefined),
                cover: JSON.parse((page?.cover as string) ?? undefined),
                propertyValues: JSON.parse((page?.propertyValues as string) ?? undefined),
            };
            return { ...parsedPage };
        }),

        views: db?.views?.map((view) => {
            const parsedView = {
                ...view,
                format: {
                    ...view.format,
                    details: JSON.parse((view?.format?.details as string) ?? undefined),
                },
            };

            return parsedView;
        }),
    };

    return parsed as ParsedDatabase;
}

export function stringifyDbJSON(db: ParsedDatabase): Partial<Database> {
    const stringified = {
        ...db,
        title: JSON.stringify(db?.title as string) ?? undefined,
        description: JSON.stringify(db?.description as string) ?? undefined,
        icon: JSON.stringify(db?.icon as string) ?? undefined,
        cover: JSON.stringify(db?.cover as string) ?? undefined,
        properties: db?.properties?.map((property) => ({
            ...property,
            details: JSON.stringify(property?.details as string) ?? undefined,
        })),
        childrenPages: db?.childrenPages?.map((page) => {
            const stringifiedPage = {
                ...page,
                title: JSON.stringify((page?.title as string) ?? undefined),
                icon: JSON.stringify((page?.icon as string) ?? undefined),
                cover: JSON.stringify((page?.cover as string) ?? undefined),
                propertyValues: JSON.stringify((page?.propertyValues as string) ?? undefined),
            };
            return { ...stringifiedPage };
        }),

        views: db?.views?.map((view) => {
            const stringifiedView = {
                ...view,
                format: {
                    ...view.format,
                    details: JSON.stringify((view?.format?.details as string) ?? undefined),
                },
            };

            return { ...stringifiedView };
        }),
    };

    return stringified as Partial<Database>;
}
