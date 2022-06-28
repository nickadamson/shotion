// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { Err } from "src/utils/types";

type Data = {
  provider: string;
};

const prisma = getClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Err>
) {
  try {
    const provider = (prisma as any)?._activeProvider;
    console.log(`Prisma successfully connected to ${provider} database.`);
    res.status(200).json({ provider: provider });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    res.status(500).json({ err: `Internal Server Error` });
  }
}
