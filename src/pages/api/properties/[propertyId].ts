import { Property, PROPERTYTYPE } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import getClient from "@/prisma/getClient";

const { prisma } = getClient();

interface SelectOptions {
    name: string;
    color: string;
}

interface PropertyDetails {
    options?: SelectOptions[]; // select/multiselect
    object?: "database" | "page"; // relation
    id?: string; // relation
    info?: string; // other
}

export interface ParsedProperty {
    id: string;
    object: "property";
    type: PROPERTYTYPE;
    name: string;
    details: PropertyDetails;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { propertyId } = req.query as { [key: string]: string };
    const propertyData: Property = req?.body ? JSON.parse(req.body) : null;

    switch (req.method) {
        case "GET":
            handleGET({ propertyId, res });
            break;

        case "PUT":
            handlePUT({ propertyId, propertyData, res });
            break;

        case "DELETE":
            handleDELETE({ propertyId, res });
            break;

        default:
            res.status(500).json({
                err: `The HTTP ${req.method} method is not supported at this route.
        Supported: GET/PUT/DELETE`,
            });
    }
}

// GET /api/properties/:id
async function handleGET({ propertyId, res }: { propertyId: string; res: NextApiResponse }) {
    try {
        const data = await prisma.property.findUniqueOrThrow({
            where: { id: propertyId },
        });

        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}

// PUT /api/properties/:id
async function handlePUT({
    propertyId,
    propertyData,
    res,
}: {
    propertyId: string;
    propertyData: Property;
    res: NextApiResponse;
}) {
    try {
        const property = await prisma.property.update({
            where: {
                id: propertyId,
            },
            data: { ...propertyData },
        });

        res.status(200).json(property);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}

// DELETE /api/properties/:id
async function handleDELETE({ propertyId, res }: { propertyId: string; res: NextApiResponse }) {
    try {
        const deletedProperty = await prisma.property.delete({
            where: { id: propertyId },
        });

        res.status(200).json({
            message: `${deletedProperty.id} deleted successfully.`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error`, err: error as string });
    }
}
