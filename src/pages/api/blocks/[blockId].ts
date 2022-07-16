import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { Prisma as P, Block, Database, Page } from "@prisma/client";
import { ErrorMsg } from "src/utils/types";
import { formatChildren, parseBlockJSON, stringifyBlockJSON } from ".";

const { prisma, provider } = getClient();

export type BlockChild = Pick<Database | Page | Block, "id" & "object" & "type">;

export type FormattedBlockWRelations = Omit<BlockWithRelations, "childrenDbs" & "childrenPages" & "childrenBlocks"> & {
    children: Array<BlockChild>;
};

export type BlockWithRelations = P.BlockGetPayload<typeof blockIncludeRelations>;

type ResponseData = FormattedBlockWRelations | Block | ErrorMsg;

export default async function handle(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
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
async function handleGET({ blockId, res }: { blockId: string; res: NextApiResponse<ResponseData> }) {
    try {
        let data = await getBlockWithRelations(blockId);

        if (provider === "sqlite") {
            data = parseBlockJSON(data);
        }

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
    res: NextApiResponse<ResponseData>;
}) {
    try {
        if (provider === "sqlite") {
            blockData = stringifyBlockJSON(blockData);
        }

        const block = await updateBlock(blockId, blockData);

        res.status(200).json(block);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error });
    }
}

// DELETE /api/blocks/:id
async function handleDELETE({ blockId, res }: { blockId: string; res: NextApiResponse<ResponseData> }) {
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

async function getBlockWithRelations(blockId: string): Promise<BlockWithRelations> {
    return await prisma.block.findUniqueOrThrow({
        where: { id: blockId },
        ...blockIncludeRelations,
    });
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
