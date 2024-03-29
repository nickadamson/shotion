import { Property } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import getClient from "@/prisma/getClient";
import { ErrorMsg } from "src/pages/api/workspaces";

const { prisma } = getClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse<Property | Property[] | ErrorMsg>) {
    const propertyData: Property = req?.body ? JSON.parse(req.body) : null;

    switch (req.method) {
        case "GET":
            handleGET({ res });
            break;

        case "POST":
            handlePOST({ propertyData, res });
            break;

        default:
            res.status(500).json({
                message: `The HTTP ${req.method} method is not supported at this route. Supported: POST/GET`,
            });
    }
}

// POST /api/properties
async function handlePOST({
    propertyData,
    res,
}: {
    propertyData: Property;
    res: NextApiResponse<Property | ErrorMsg>;
}) {
    try {
        const property = await prisma.property.create({
            data: { ...propertyData },
        });

        res.status(200).json(property);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}
// GET /api/properties
async function handleGET({ res }: { res: NextApiResponse<Property[] | ErrorMsg> }) {
    try {
        const allProperties = await prisma.property.findMany();

        res.status(200).json(allProperties);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}
