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
    databaseData: Database | DatabaseWithRelations;
    res: NextApiResponse<Database | ErrorMsg>;
}) {
    try {
        if (provider === "sqlite") {
            databaseData = stringifyDbJSON(databaseData as DatabaseWithRelations);
        }

        const database = await prisma.database.create({
            data: { ...(databaseData as Database) },
        });

        res.status(200).json(database);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}
// GET /api/databases
async function handleGET({ res }: { res: NextApiResponse<Database[] | ErrorMsg> }) {
    try {
        let allDatabases = await prisma.database.findMany();

        if (provider === "sqlite") {
            allDatabases.map((db, i) => {
                allDatabases[i] = parseDbJSON(db as DatabaseWithRelations);
            });
        }

        res.status(200).json(allDatabases);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}
