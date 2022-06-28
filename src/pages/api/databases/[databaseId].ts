import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { Database } from "@prisma/client";
import { Err } from "src/utils/types";

const prisma = getClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<Database | Err>
) {
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
async function handleGET({
  databaseId,
  res,
}: {
  databaseId: string;
  res: NextApiResponse<Database | Err>;
}) {
  try {
    const database = await findByIdOrDatabasename(databaseId);

    if (database != null) {
      res.status(200).json(database);
    } else {
      res
        .status(404)
        .json({ message: `Database with id: ${databaseId} not found.` });
    }
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error`, err: error });
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
  res: NextApiResponse<Database | Err>;
}) {
  try {
    const database = await prisma.database.update({
      where: {
        id: databaseId,
      },
      data: databaseData,
    });

    res.status(200).json(database);
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error`, err: error });
  }
}

// DELETE /api/databases/:id
async function handleDELETE({
  databaseId,
  res,
}: {
  databaseId: string;
  res: NextApiResponse<Database | Err>;
}) {
  try {
    const deletedDatabase = await prisma.database.delete({
      where: { id: databaseId },
    });

    res.status(200).json({
      message: `${deletedDatabase.databasename} deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error`, err: error });
  }
}

// helpers
async function findByIdOrDatabasename(
  idOrDatabasename: string
): Promise<Database | null> {
  let database;

  try {
    database = await prisma.database.findUnique({
      where: { id: idOrDatabasename },
      rejectOnNotFound: true,
    });
  } catch (error) {
    try {
      database = await prisma.database.findUnique({
        where: { databasename: idOrDatabasename },
        rejectOnNotFound: true,
      });
    } catch (error) {}
  }

  return database;
}
