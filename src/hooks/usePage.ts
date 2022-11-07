import { Page } from "@prisma/client";
import useSWR from "swr";

import { fetcher } from "src/utils/api";
import { RTO } from "src/utils/types";

import { ParsedPage } from "../pages/api/pages/[pageId]";

const usePage = ({ pageId }: { pageId: string }) => {
    const url = `/api/pages/${pageId}`;
    const { data, error } = useSWR<ParsedPage>(url, fetcher);

    const state = {
        isLoading: !error && !data,
        isError: error,
    };

    return {
        page: data,
        ...state,
    };
};

export default usePage;
