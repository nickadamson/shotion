import { Prisma as P, Page, Database, Block } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import getClient from "@/prisma/getClient";
import { ParsedFormat } from "src/pages/api/formats/[formatId]";
import { ErrorMsg } from "src/pages/api/workspaces";

const { prisma, provider } = getClient();

export type PageChild = Pick<Database | Page | Block, "id" & "object" & "type">;

export type ParsedPage = Omit<PageWithRelations, "format" & "childrenDbs" & "childrenPages" & "childrenBlocks"> & {
    format: ParsedFormat;
    children: Array<PageChild>;
};

export type PageWithRelations = P.PageGetPayload<typeof pageIncludeRelations>;

type ResponseData = ParsedPage | Page | ErrorMsg;

export default async function handle(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const { pageId } = req.query as { [key: string]: string };
    const pageData: ParsedPage | Partial<Page> = req?.body ? JSON.parse(req.body) : null;

    switch (req.method) {
        case "GET":
            handleGET({ pageId, res });
            break;

        case "PUT":
            handlePUT({ pageId, pageData, res });
            break;

        case "DELETE":
            handleDELETE({ pageId, res });
            break;

        default:
            res.status(500).json({
                err: `The HTTP ${req.method} method is not supported at this route.
        Supported: GET/PUT/DELETE`,
            });
    }
}

// GET /api/pages/:id
async function handleGET({ pageId, res }: { pageId: string; res: NextApiResponse<ResponseData> }) {
    try {
        let data = await getPageWithRelations(pageId);

        if (provider === "sqlite") {
            data = parsePageJSON(data);
        }

        res.status(200).json(formatChildren(data));
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}

// PUT /api/pages/:id
async function handlePUT({
    pageId,
    pageData,
    res,
}: {
    pageId: string;
    pageData: ParsedPage | Partial<Page>;
    res: NextApiResponse<ResponseData>;
}) {
    try {
        console.log({ pageData });
        console.log(1);
        if (provider === "sqlite") {
            pageData = stringifyPageJSON(pageData as ParsedPage);
        }
        console.log(2);
        const data = await updatePage(pageId, pageData as Partial<Page>);

        console.log(3);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}

// DELETE /api/pages/:id
async function handleDELETE({ pageId, res }: { pageId: string; res: NextApiResponse<ResponseData> }) {
    try {
        const deletedPage = await updatePage(pageId, { archived: true });

        res.status(200).json({
            message: `${deletedPage.id} archived successfully.`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}

const pageIncludeRelations = P.validator<P.PageArgs>()({
    include: {
        format: true,
        childrenDbs: {
            select: {
                id: true,
                object: true,
                type: true,
            },
        },
        childrenPages: {
            select: {
                id: true,
                object: true,
                type: true,
            },
        },
        childrenBlocks: {
            select: {
                id: true,
                object: true,
                type: true,
            },
        },
    },
});

async function getPageWithRelations(pageId: string): Promise<PageWithRelations> {
    return prisma.page.findUniqueOrThrow({
        where: { id: pageId },
        ...pageIncludeRelations,
    });
}

async function updatePage(pageId: string, pageData: P.PageUpdateInput) {
    return prisma.page.update({
        where: {
            id: pageId,
        },
        data: {
            object: pageData?.object || undefined,
            isWorkspace: pageData?.isWorkspace || undefined,
            archived: pageData?.archived || undefined,
            type: pageData?.type || undefined,
            title: pageData?.title || undefined,
            icon: pageData?.icon || undefined,
            cover: pageData?.cover || undefined,
            propertyValues: pageData?.propertyValues || undefined,
        },
    });
}

export function formatChildren(data: PageWithRelations): ParsedPage {
    const formattedPage = { ...data, children: [] };
    formattedPage.children = [
        ...(data?.childrenDbs as Pick<Database, "id" & "object" & "type">[]),
        ...(data?.childrenPages as Pick<Page, "id" & "object" & "type">[]),
        ...(data?.childrenBlocks as Pick<Block, "id" & "object" & "type">[]),
    ];

    delete data.childrenBlocks;
    delete data.childrenPages;
    delete data.childrenDbs;

    return formattedPage as ParsedPage;
}

// for sqlite
export function parsePageJSON(page: PageWithRelations | ParsedPage): ParsedPage {
    const parsed = {
        ...page,
        title: JSON.parse((page?.title as string) ?? undefined),
        icon: JSON.parse((page?.icon as string) ?? undefined),
        cover: JSON.parse((page?.cover as string) ?? undefined),
        propertyValues: JSON.parse((page?.propertyValues as string) ?? undefined),
        format: {
            ...page?.format,
            order: JSON?.parse((page?.format?.order as string) ?? undefined),
        },
    };

    return parsed as ParsedPage;
}

export function stringifyPageJSON(page: ParsedPage): Partial<Page> {
    const stringified = {
        ...page,
        title: JSON.stringify(page?.title ?? undefined),
        icon: JSON.stringify(page?.icon ?? undefined),
        cover: JSON.stringify(page?.cover ?? undefined),
        propertyValues: JSON.stringify(page?.propertyValues ?? undefined),
        format: {
            ...(page?.format ?? undefined),
            order: JSON?.stringify(page?.format?.order) ?? undefined,
        },
    };

    return stringified as Partial<Page>;
}
