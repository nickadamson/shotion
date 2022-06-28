import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { Database } from "@prisma/client";
import { Err } from "src/utils/types";

const prisma = getClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<Database | Database[] | Err>
) {
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
  res: NextApiResponse<Database | Err>;
}) {
  try {
    const database = await prisma.database.create({
      data: { ...databaseData },
    });

    res.status(200).json(database);
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error`, err: error });
  }
}
// GET /api/databases
async function handleGET({ res }: { res: NextApiResponse<Database[] | Err> }) {
  try {
    const allDatabases = await prisma.database.findMany();

    res.status(200).json(allDatabases);
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error`, err: error });
  }
}
