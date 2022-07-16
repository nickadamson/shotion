// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { ErrorMsg } from "src/utils/types";

type Data = {
    provider: string;
};

const { provider } = getClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | ErrorMsg>) {
    try {
        console.log(`Prisma successfully connected to ${provider} database.`);
        res.status(200).json({ provider: provider });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        res.status(500).json({ err: `Internal Server Error` });
    }
}
