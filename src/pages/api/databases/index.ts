import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { Database } from "@prisma/client";
import { ErrorMsg } from "src/utils/types";
import { DatabaseWithRelations } from "./[databaseId]";

const { prisma, provider } = getClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse<Database | Database[] | ErrorMsg>) {
    const databaseData: Database = req?.body ? JSON.parse(req.body) : null;

    switch (req.method) {
        case "GET":
            handleGET({ res });
            break;

        case "POST":
            handlePOST({ databaseData, res });
            break;

        default:
            res.status(500).json({
                message: `The HTTP ${req.method} method is not supported at this route. Supported: POST/GET`,
            });
    }
}

// POST /api/databases
async function handlePOST({
    databaseData,
    res,
}: {
    databaseData: Database;
    res: NextApiResponse<Database | ErrorMsg>;
}) {
    try {
        if (provider === "sqlite") {
            databaseData = stringifyDbJSON(databaseData);
        }

        const database = await prisma.database.create({
            data: { ...databaseData },
        });

        res.status(200).json(database);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error });
    }
}
// GET /api/databases
async function handleGET({ res }: { res: NextApiResponse<Database[] | ErrorMsg> }) {
    try {
        let allDatabases = await prisma.database.findMany();

        if (provider === "sqlite") {
            allDatabases.map((db, i) => {
                allDatabases[i] = parseDbJSON(db);
            });
        }

        res.status(200).json(allDatabases);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error });
    }
}

// for sqlite
export function parseDbJSON(db): DatabaseWithRelations {
    db["title"] = JSON.parse(db?.title ?? undefined);
    db["description"] = JSON.parse(db?.description ?? undefined);
    db["icon"] = JSON.parse(db?.icon ?? undefined);
    db["cover"] = JSON.parse(db?.cover ?? undefined);

    db["properties"] =
        db?.properties?.map((property) => {
            return {
                ...property,
                details: JSON.parse(property?.details ?? undefined),
            };
        }) ?? undefined;

    db["childrenPages"] =
        db?.childrenPages?.map((page) => {
            page["title"] = JSON.parse(page?.title ?? undefined);
            page["icon"] = JSON.parse(page?.icon ?? undefined);
            page["cover"] = JSON.parse(page?.cover ?? undefined);
            page["propertyValues"] = JSON.parse(page?.propertyValues ?? undefined);
        }) ?? undefined;

    db["views"] =
        db?.views?.map((view) => {
            let { format } = view;
            format["details"] = JSON.parse(format?.details ?? undefined);
            format["order"] = JSON.parse(format?.order ?? undefined);
        }) ?? undefined;

    return db;
}

export function stringifyDbJSON(db): DatabaseWithRelations {
    db["title"] = JSON.stringify(db?.title ?? undefined);
    db["description"] = JSON.stringify(db?.description ?? undefined);
    db["icon"] = JSON.stringify(db?.icon ?? undefined);
    db["cover"] = JSON.stringify(db?.cover ?? undefined);

    db["properties"] =
        db?.properties?.map((property) => {
            return {
                ...property,
                details: JSON.stringify(property?.details ?? undefined),
            };
        }) ?? undefined;

    db["childrenPages"] =
        db?.childrenPages?.map((page) => {
            page["title"] = JSON.stringify(page?.title ?? undefined);
            page["icon"] = JSON.stringify(page?.icon ?? undefined);
            page["cover"] = JSON.stringify(page?.cover ?? undefined);
            page["propertyValues"] = JSON.stringify(page?.propertyValues ?? undefined);
        }) ?? undefined;

    db["views"] =
        db?.views?.map((view) => {
            let { format } = view;
            format["details"] = JSON.stringify(format?.details ?? undefined);
            format["order"] = JSON.stringify(format?.order ?? undefined);
        }) ?? undefined;

    return db;
}
