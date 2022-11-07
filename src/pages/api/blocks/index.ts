import { Block } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import getClient from "@/prisma/getClient";
import { ErrorMsg } from "src/pages/api/workspaces";

import { FormattedBlockWRelations, parseBlockJSON, stringifyBlockJSON } from "./[blockId]";

const { prisma, provider } = getClient();

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<FormattedBlockWRelations | FormattedBlockWRelations[] | ErrorMsg>
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
    blockData: Block | FormattedBlockWRelations;
    res: NextApiResponse<FormattedBlockWRelations | ErrorMsg>;
}) {
    try {
        if (provider === "sqlite") {
            blockData = stringifyBlockJSON(blockData);
        }

        const block = await prisma.block.create({
            data: { ...(blockData as Block) },
        });

        res.status(200).json(block as FormattedBlockWRelations);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}
// GET /api/blocks
async function handleGET({ res }: { res: NextApiResponse<FormattedBlockWRelations[] | ErrorMsg> }) {
    try {
        const allBlocks: Array<Block | FormattedBlockWRelations> = await prisma.block.findMany();

        if (provider === "sqlite") {
            allBlocks.forEach((block, i) => {
                allBlocks[i] = parseBlockJSON(block as FormattedBlockWRelations);
            });
        }

        res.status(200).json(allBlocks as FormattedBlockWRelations[]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}
