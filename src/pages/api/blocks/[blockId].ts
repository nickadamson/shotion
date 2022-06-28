import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { Block } from "@prisma/client";
import { Err } from "src/utils/types";

const prisma = getClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<Block | Err>
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
  res: NextApiResponse<Block | Err>;
}) {
  try {
    const block = await findByIdOrBlockname(blockId);

    if (block != null) {
      res.status(200).json(block);
    } else {
      res.status(404).json({ message: `Block with id: ${blockId} not found.` });
    }
  } catch (error) {
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
  res: NextApiResponse<Block | Err>;
}) {
  try {
    const block = await prisma.block.update({
      where: {
        id: blockId,
      },
      data: blockData,
    });

    res.status(200).json(block);
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error`, err: error });
  }
}

// DELETE /api/blocks/:id
async function handleDELETE({
  blockId,
  res,
}: {
  blockId: string;
  res: NextApiResponse<Block | Err>;
}) {
  try {
    const deletedBlock = await prisma.block.delete({
      where: { id: blockId },
    });

    res.status(200).json({
      message: `${deletedBlock.blockname} deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error`, err: error });
  }
}

// helpers
async function findByIdOrBlockname(
  idOrBlockname: string
): Promise<Block | null> {
  let block;

  try {
    block = await prisma.block.findUnique({
      where: { id: idOrBlockname },
      rejectOnNotFound: true,
    });
  } catch (error) {
    try {
      block = await prisma.block.findUnique({
        where: { blockname: idOrBlockname },
        rejectOnNotFound: true,
      });
    } catch (error) {}
  }

  return block;
}
