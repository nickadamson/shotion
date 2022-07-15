import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { Prisma as P } from "@prisma/client";
import { ErrorMsg } from "src/utils/types";

const prisma = getClient();

export type WorkspaceResponseData =
  | Array<DatabaseSelect | PageSelect>
  | ErrorMsg;

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<WorkspaceResponseData>
) {
  console.log("workspaces GET");
  switch (req.method) {
    case "GET":
      handleGET({ res });
      break;

    default:
      res.status(500).json({
        message: `The HTTP ${req.method} method is not supported at this route. Supported: GET`,
      });
  }
}

// GET /api/workspaces
async function handleGET({
  res,
}: {
  res: NextApiResponse<WorkspaceResponseData>;
}) {
  try {
    let dbs = await getWorkspaceDbs();
    let pages = await getWorkspacePages();

    const data = [...dbs, ...pages];
    console.log(data);

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error`, err: error });
  }
}

export type DatabaseSelect = P.DatabaseGetPayload<typeof dbSelections>;
export type PageSelect = P.PageGetPayload<typeof pageSelections>;

const dbSelections = P.validator<P.DatabaseFindManyArgs>()({
  where: {
    isWorkspace: true,
  },
  select: {
    id: true,
    object: true,
    isInline: true,
    type: true,
  },
});

const pageSelections = P.validator<P.PageFindManyArgs>()({
  where: {
    isWorkspace: true,
  },
  select: {
    id: true,
    object: true,
    type: true,
  },
});

async function getWorkspaceDbs(): Promise<DatabaseSelect[]> {
  return await prisma.database.findMany({
    ...dbSelections,
  });
}

async function getWorkspacePages(): Promise<PageSelect[]> {
  return await prisma.page.findMany({
    ...pageSelections,
  });
}
