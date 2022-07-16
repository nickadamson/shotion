import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { Prisma as P, Page, Database, Block } from "@prisma/client";
import { ErrorMsg } from "src/utils/types";
import { formatChildren, parsePageJSON } from ".";

const { prisma, provider } = getClient();

export type PageChild = Pick<Database | Page | Block, "id" & "object" & "type">;

export type FormattedPageWRelations = Omit<PageWithRelations, "childrenDbs" & "childrenPages" & "childrenBlocks"> & {
    children: Array<PageChild>;
};

export type PageWithRelations = P.PageGetPayload<typeof pageIncludeRelations>;

type ResponseData = FormattedPageWRelations | Page | ErrorMsg;

export default async function handle(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const { pageId } = req.query as { [key: string]: string };
    const pageData: Page = req?.body ? JSON.parse(req.body) : null;

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
        res.status(500).json({ message: `Internal Server Error`, err: error });
    }
}

// PUT /api/pages/:id
async function handlePUT({
    pageId,
    pageData,
    res,
}: {
    pageId: string;
    pageData: Page;
    res: NextApiResponse<ResponseData>;
}) {
    try {
        if (provider === "sqlite") {
            pageData = parsePageJSON(pageData);
        }
        const data = await updatePage(pageId, pageData);

        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error });
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
        res.status(500).json({ message: `Internal Server Error`, err: error });
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
    return await prisma.page.findUniqueOrThrow({
        where: { id: pageId },
        ...pageIncludeRelations,
    });
}

async function updatePage(pageId: string, pageData: P.PageUpdateInput) {
    return await prisma.page.update({
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
