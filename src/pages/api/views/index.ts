import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { View } from "@prisma/client";
import { ErrorMsg } from "src/utils/types";

const prisma = getClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<View | View[] | Err>
) {
  const viewData: View = req?.body ? JSON.parse(req.body) : null;

  switch (req.method) {
    case "GET":
      handleGET({ res });
      break;

    case "POST":
      handlePOST({ viewData, res });
      break;

    default:
      res.status(500).json({
        message: `The HTTP ${req.method} method is not supported at this route. Supported: POST/GET`,
      });
  }
}

// POST /api/views
async function handlePOST({
  viewData,
  res,
}: {
  viewData: View;
  res: NextApiResponse<View | Err>;
}) {
  try {
    const view = await prisma.view.create({
      data: { ...viewData },
    });

    res.status(200).json(view);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error`, err: error });
  }
}
// GET /api/views
async function handleGET({ res }: { res: NextApiResponse<View[] | Err> }) {
  try {
    const allViews = await prisma.view.findMany();

    res.status(200).json(allViews);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error`, err: error });
  }
}
