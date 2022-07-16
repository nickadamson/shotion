import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { Block, Database, Page } from "@prisma/client";
import { ErrorMsg } from "src/utils/types";
import { FormattedPageWRelations, PageWithRelations } from "./[pageId]";

const { prisma, provider } = getClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse<Page | Page[] | ErrorMsg>) {
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
async function handlePOST({ pageData, res }: { pageData: Page; res: NextApiResponse<Page | ErrorMsg> }) {
    try {
        if (provider === "sqlite") {
            pageData = stringifyPageJSON(pageData);
        }

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
async function handleGET({ res }: { res: NextApiResponse<Page[] | ErrorMsg> }) {
    try {
        let allPages = await prisma.page.findMany();

        if (provider === "sqlite") {
            allPages.map((page, i) => {
                allPages[i] = parsePageJSON(page);
            });
        }

        res.status(200).json(allPages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error });
    }
}

export function formatChildren(data: PageWithRelations): FormattedPageWRelations {
    let formattedPage: FormattedPageWRelations = { ...data, children: [] };
    formattedPage["children"] = [
        ...(data?.childrenDbs as Pick<Database, "id" & "object" & "type">[]),
        ...(data?.childrenPages as Pick<Page, "id" & "object" & "type">[]),
        ...(data?.childrenBlocks as Pick<Block, "id" & "object" & "type">[]),
    ];

    delete data.childrenBlocks;
    delete data.childrenPages;
    delete data.childrenDbs;

    return formattedPage;
}

// for sqlite
export function parsePageJSON(page): FormattedPageWRelations {
    page["title"] = JSON.parse(page?.title ?? undefined);
    page["icon"] = JSON.parse(page?.icon ?? undefined);
    page["cover"] = JSON.parse(page?.cover ?? undefined);
    page["propertyValues"] = JSON.parse(page?.propertyValues ?? undefined);

    page["children"] =
        page?.children?.map((child) => {
            child["title"] = JSON.parse(child?.title ?? undefined);
            child["icon"] = JSON.parse(child?.icon ?? undefined);
            child["cover"] = JSON.parse(child?.cover ?? undefined);
            child["propertyValues"] = JSON.parse(child?.propertyValues ?? undefined);
            child["details"] = JSON.parse(child?.details ?? undefined);
        }) ?? undefined;

    page["format"] =
        {
            ...(page?.format ?? undefined),
            order: JSON?.parse(page?.format?.order) ?? undefined,
        } ?? undefined;

    return page;
}

export function stringifyPageJSON(page): FormattedPageWRelations {
    page["title"] = JSON.stringify(page?.title ?? undefined);
    page["icon"] = JSON.stringify(page?.icon ?? undefined);
    page["cover"] = JSON.stringify(page?.cover ?? undefined);
    page["propertyValues"] = JSON.stringify(page?.propertyValues ?? undefined);

    page["children"] =
        page?.children?.map((child) => {
            child["title"] = JSON.stringify(child?.title ?? undefined);
            child["icon"] = JSON.stringify(child?.icon ?? undefined);
            child["cover"] = JSON.stringify(child?.cover ?? undefined);
            child["propertyValues"] = JSON.stringify(child?.propertyValues ?? undefined);
            child["details"] = JSON.stringify(child?.details ?? undefined);
        }) ?? undefined;

    page["format"] =
        {
            ...(page?.format ?? undefined),
            order: JSON?.stringify(page?.format?.order) ?? undefined,
        } ?? undefined;

    return page;
}
