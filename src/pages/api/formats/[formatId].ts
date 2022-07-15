import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { Format } from "@prisma/client";

const prisma = getClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
async function handleGET({
  formatId,
  res,
}: {
  formatId: string;
  res: NextApiResponse;
}) {
  try {
    const data = await prisma.format.findUniqueOrThrow({
      where: { id: formatId },
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error`, err: error });
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
    res.status(500).json({ message: `Internal Server Error`, err: error });
  }
}

// DELETE /api/formats/:id
async function handleDELETE({
  formatId,
  res,
}: {
  formatId: string;
  res: NextApiResponse;
}) {
  try {
    const deletedFormat = await prisma.format.delete({
      where: { id: formatId },
    });

    res.status(200).json({
      message: `${deletedFormat.id} deleted successfully.`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error`, err: error });
  }
}
