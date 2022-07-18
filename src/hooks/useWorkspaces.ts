import { BLOCKTYPE } from "@prisma/client";
import useSWR from "swr";

import { ParsedPage } from "src/pages/api/pages/[pageId]";
import { fetcher } from "src/utils/api";
import { RTO } from "src/utils/types";

export interface Workspace {
    object: string;
    id: string;
    type: BLOCKTYPE;
    isInline?: boolean;
    title: RTO;
    childrenPages: ParsedPage[];
}

const useWorkspaces = () => {
    const url = `/api/workspaces`;
    const { data, error } = useSWR<Workspace[]>(url, fetcher);

    const state = {
        spacesLoading: !error && !data,
        spacesError: error,
    };

    return {
        workspaces: data,
        ...state,
    };
};

export default useWorkspaces;
