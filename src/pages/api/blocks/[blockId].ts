import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { Prisma as P, Block, Database, Page } from "@prisma/client";
import { ErrorMsg } from "src/utils/types";

const prisma = getClient();

type ResponseData = FormattedBlockWRelations | Block | ErrorMsg;

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { blockId } = req.query as { [key: string]: string };
  const blockData: Block = req?.body ? JSON.parse(req.body) : null;

  switch (req.method) {
    case "GET":
      handleGET({ blockId, res });
      break;

    case "PUT":
      handlePUT({ blockId, blockData, res });
      break;

    case "DELETE":
      handleDELETE({ blockId, res });
      break;

    default:
      res.status(500).json({
        err: `The HTTP ${req.method} method is not supported at this route.
        Supported: GET/PUT/DELETE`,
      });
  }
}

// GET /api/blocks/:id
async function handleGET({
  blockId,
  res,
}: {
  blockId: string;
  res: NextApiResponse;
}) {
  try {
    const data = await getBlockWithRelations(blockId);

    res.status(200).json(formatChildren(data));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error`, err: error });
  }
}

// PUT /api/blocks/:id
async function handlePUT({
  blockId,
  blockData,
  res,
}: {
  blockId: string;
  blockData: Block;
  res: NextApiResponse;
}) {
  try {
    const block = await updateBlock(blockId, blockData);

    res.status(200).json(block);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error`, err: error });
  }
}

// DELETE /api/blocks/:id
async function handleDELETE({
  blockId,
  res,
}: {
  blockId: string;
  res: NextApiResponse;
}) {
  try {
    const deletedBlock = await updateBlock(blockId, { archived: true });

    res.status(200).json({
      message: `${deletedBlock.id} archived successfully.`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error`, err: error });
  }
}

type BlockWithRelations = P.BlockGetPayload<typeof blockIncludeRelations>;

const blockIncludeRelations = P.validator<P.BlockArgs>()({
  include: {
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

async function getBlockWithRelations(
  blockId: string
): Promise<BlockWithRelations> {
  return await prisma.block.findUniqueOrThrow({
    where: { id: blockId },
    ...blockIncludeRelations,
  });
}

type Child = Pick<Database | Page | Block, "id" & "object" & "type">;

export type FormattedBlockWRelations = Omit<
  BlockWithRelations,
  "childrenDbs" & "childrenPages" & "childrenBlocks"
> & { children: Array<Child> };

function formatChildren(data: BlockWithRelations): FormattedBlockWRelations {
  let formattedBlock: FormattedBlockWRelations = { ...data, children: [] };
  formattedBlock["children"] = [
    ...(data?.childrenDbs as Pick<Database, "id" & "object" & "type">[]),
    ...(data?.childrenPages as Pick<Page, "id" & "object" & "type">[]),
    ...(data?.childrenBlocks as Pick<Block, "id" & "object" & "type">[]),
  ];

  delete data.childrenBlocks;
  delete data.childrenPages;
  delete data.childrenDbs;

  return formattedBlock;
}

async function updateBlock(blockId: string, blockData: P.BlockUpdateInput) {
  return await prisma.block.update({
    where: {
      id: blockId,
    },
    data: {
      archived: blockData?.archived || undefined,
      type: blockData?.type || undefined,
      details: blockData?.details || undefined,
    },
  });
}
