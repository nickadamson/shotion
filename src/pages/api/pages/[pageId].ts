import type { NextApiRequest, NextApiResponse } from "next";
import getClient from "@/prisma/getClient";
import { Page } from "@prisma/client";
import { Err } from "src/utils/types";

const prisma = getClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<Page | Err>
) {
  const { pageId } = req.query as { [key: string]: string };
  const pageData: Page = req?.body ? JSON.parse(req.body) : null;

  switch (req.method) {
    case "GET":
      handleGET({ pageId, res });
      break;

    case "PUT":
      handlePUT({ pageId, pageData, res });
      break;

    case "DELETE":
      handleDELETE({ pageId, res });
      break;

    default:
      res.status(500).json({
        err: `The HTTP ${req.method} method is not supported at this route.
        Supported: GET/PUT/DELETE`,
      });
  }
}

// GET /api/pages/:id
async function handleGET({
  pageId,
  res,
}: {
  pageId: string;
  res: NextApiResponse<Page | Err>;
}) {
  try {
    const page = await findByIdOrPagename(pageId);

    if (page != null) {
      res.status(200).json(page);
    } else {
      res.status(404).json({ message: `Page with id: ${pageId} not found.` });
    }
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error`, err: error });
  }
}

// PUT /api/pages/:id
async function handlePUT({
  pageId,
  pageData,
  res,
}: {
  pageId: string;
  pageData: Page;
  res: NextApiResponse<Page | Err>;
}) {
  try {
    const page = await prisma.page.update({
      where: {
        id: pageId,
      },
      data: pageData,
    });

    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error`, err: error });
  }
}

// DELETE /api/pages/:id
async function handleDELETE({
  pageId,
  res,
}: {
  pageId: string;
  res: NextApiResponse<Page | Err>;
}) {
  try {
    const deletedPage = await prisma.page.delete({
      where: { id: pageId },
    });

    res.status(200).json({
      message: `${deletedPage.pagename} deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error`, err: error });
  }
}

// helpers
async function findByIdOrPagename(idOrPagename: string): Promise<Page | null> {
  let page;

  try {
    page = await prisma.page.findUnique({
      where: { id: idOrPagename },
      rejectOnNotFound: true,
    });
  } catch (error) {
    try {
      page = await prisma.page.findUnique({
        where: { pagename: idOrPagename },
        rejectOnNotFound: true,
      });
    } catch (error) {}
  }

  return page;
}
