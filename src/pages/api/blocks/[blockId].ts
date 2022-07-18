import { Prisma as P, Block, Database, Page } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import getClient from "@/prisma/getClient";
import { ErrorMsg } from "src/pages/api/workspaces";

const { prisma, provider } = getClient();

type BlockChild = Pick<Database | Page | Block, "id" & "object" & "type">;

export interface ParsedBlock extends Omit<BlockWithRelations, "childrenDbs" & "childrenPages" & "childrenBlocks"> {
    children: BlockChild[];
}

type BlockWithRelationsPayload = P.BlockGetPayload<typeof blockIncludeRelations>;
type BlockWithRelations = Partial<BlockWithRelationsPayload>;

type ResponseData = ParsedBlock | Block | ErrorMsg;

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
            data = parseBlockJSON(data as Block);
        }

        res.status(200).json(formatChildren(data as Block) as ResponseData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}

// PUT /api/blocks/:id
async function handlePUT({
    blockId,
    blockData,
    res,
}: {
    blockId: string;
    blockData: Block | ParsedBlock;
    res: NextApiResponse<ResponseData>;
}) {
    try {
        if (provider === "sqlite") {
            blockData = stringifyBlockJSON(blockData as ParsedBlock);
        }

        const block = await updateBlock(blockId, blockData as P.BlockUpdateInput);

        res.status(200).json(block as ParsedBlock);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}

// DELETE /api/blocks/:id
async function handleDELETE({ blockId, res }: { blockId: string; res: NextApiResponse<ResponseData> }) {
    try {
        await updateBlock(blockId, { archived: true });

        res.status(200).json({
            message: `${blockId} archived successfully.`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
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

async function getBlockWithRelations(blockId: string): Promise<BlockWithRelations | null> {
    try {
        return await prisma.block.findUniqueOrThrow({
            where: { id: blockId },
            ...blockIncludeRelations,
        });
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function updateBlock(blockId: string, blockData: P.BlockUpdateInput) {
    try {
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
    } catch (error) {
        console.log(error);
        return null;
    }
}

export function formatChildren(data: BlockWithRelations): ParsedBlock {
    const formattedBlock: ParsedBlock = { ...data, children: [] };
    formattedBlock.children = [
        ...(data?.childrenDbs as Pick<Database, "id" & "object" & "type">[]),
        ...(data?.childrenPages as Pick<Page, "id" & "object" & "type">[]),
        ...(data?.childrenBlocks as Pick<Block, "id" & "object" & "type">[]),
    ];

    delete formattedBlock.childrenBlocks;
    delete formattedBlock.childrenPages;
    delete formattedBlock.childrenDbs;

    return formattedBlock;
}

// for sqlite
export function parseBlockJSON(block: Block | ParsedBlock): ParsedBlock {
    console.log(`parsing`);
    block.details = JSON.parse(block?.details as string) ?? undefined;
    return block as ParsedBlock;
}

export function stringifyBlockJSON(block: Block | ParsedBlock): ParsedBlock {
    console.log(`stringifying`);
    block.details = JSON.stringify(block?.details) ?? undefined;
    return block as ParsedBlock;
}
