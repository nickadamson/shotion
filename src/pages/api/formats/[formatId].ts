import { Format, Prisma as P } from "@prisma/client";
import {
    ColumnOrderState,
    FilterFn,
    FilterFnOption,
    FilterMeta,
    SortDirection,
    SortingFn,
    SortingFnOption,
    SortingState,
    VisibilityState,
} from "@tanstack/react-table";
import type { NextApiRequest, NextApiResponse } from "next";

import getClient from "@/prisma/getClient";

const { prisma } = getClient();

export interface ParsedFormat {
    id: string;
    object: "format";
    // page
    order?: ColumnOrderState;
    // database
    details?: {
        columnOrder: ColumnOrderState;
        columnVisibility: VisibilityState;
        tableSizing: {
            tableWidth: number;
            columnWidths: {
                [x: string]: number;
            }[];
        };
        filters: Array<{
            function?: FilterFn<unknown>;
            option?: FilterFnOption<unknown>;
            meta?: FilterMeta;
        }>;
        sorts: Array<{
            direction: SortDirection;
            state: SortingState; // [];
            function: SortingFn<unknown>;
            option: SortingFnOption<unknown>;
        }>;
    };
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { formatId } = req.query as { [key: string]: string };
    const formatData: Format = req?.body ? JSON.parse(req.body) : null;

    switch (req.method) {
        case "GET":
            handleGET({ formatId, res });
            break;

        case "PUT":
            handlePUT({ formatId, formatData, res });
            break;

        case "DELETE":
            handleDELETE({ formatId, res });
            break;

        default:
            res.status(500).json({
                err: `The HTTP ${req.method} method is not supported at this route.
        Supported: GET/PUT/DELETE`,
            });
    }
}

// GET /api/formats/:id
async function handleGET({ formatId, res }: { formatId: string; res: NextApiResponse }) {
    try {
        const data = await prisma.format.findUniqueOrThrow({
            where: { id: formatId },
        });

        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `Internal Server Error`,
            err: error as string,
        });
    }
}

// PUT /api/formats/:id
async function handlePUT({
    formatId,
    formatData,
    res,
}: {
    formatId: string;
    formatData: Format;
    res: NextApiResponse;
}) {
    try {
        const format = await prisma.format.update({
            where: {
                id: formatId,
            },
            data: { ...formatData },
        });

        res.status(200).json(format);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `Internal Server Error`,
            err: error as string,
        });
    }
}

// DELETE /api/formats/:id
async function handleDELETE({ formatId, res }: { formatId: string; res: NextApiResponse }) {
    try {
        const deletedFormat = await prisma.format.delete({
            where: { id: formatId },
        });

        res.status(200).json({
            message: `${deletedFormat.id} deleted successfully.`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `Internal Server Error`,
            err: error as string,
        });
    }
}

// for sqlite
export function parseFormatJSON(format: Format): ParsedFormat {
    console.log(`parsing`);
    const parsed = {
        ...format,
        order: JSON?.parse((format?.order as string) ?? undefined),
        details: JSON?.parse((format?.details as string) ?? undefined),
    };

    return parsed as ParsedFormat;
}

export function stringifyFormatJSON(format: ParsedFormat): Partial<Format> {
    console.log(`stringifying`);
    const stringified = {
        ...format,
        order: (JSON?.stringify(format?.order) as P.JsonValue) ?? undefined,
        details: (JSON?.stringify(format?.details) as P.JsonValue) ?? undefined,
    };
    return stringified as Partial<Format>;
}
