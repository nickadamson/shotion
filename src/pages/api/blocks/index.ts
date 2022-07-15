import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { Block } from "@prisma/client";
import { ErrorMsg } from "src/utils/types";

const prisma = getClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<Block | Block[] | Err>
) {
  const blockData: Block = req?.body ? JSON.parse(req.body) : null;

  switch (req.method) {
    case "GET":
      handleGET({ res });
      break;

    case "POST":
      handlePOST({ blockData, res });
      break;

    default:
      res.status(500).json({
        message: `The HTTP ${req.method} method is not supported at this route. Supported: POST/GET`,
      });
  }
}

// POST /api/blocks
async function handlePOST({
  blockData,
  res,
}: {
  blockData: Block;
  res: NextApiResponse<Block | Err>;
}) {
  try {
    const block = await prisma.block.create({
      data: { ...blockData },
    });

    res.status(200).json(block);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error`, err: error });
  }
}
// GET /api/blocks
async function handleGET({ res }: { res: NextApiResponse<Block[] | Err> }) {
  try {
    const allBlocks = await prisma.block.findMany();

    res.status(200).json(allBlocks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error`, err: error });
  }
}
