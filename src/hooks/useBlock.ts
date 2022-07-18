import { Block } from "@prisma/client";
import useSWR from "swr";

import { ParsedBlock } from "src/pages/api/blocks/[blockId]";
import { fetcher } from "src/utils/api";

const useBlock = ({ blockId }: { blockId?: string }) => {
    const url = `/api/blocks${blockId ? `/${blockId}` : ""}`;
    const { data, error } = useSWR<ParsedBlock>(url, fetcher);

    const state = {
        isLoading: !error && !data,
        isError: error,
    };

    const updateBlock = async (updated: Partial<Block>): Promise<boolean> => {
        try {
            await fetch(url, { method: "PUT", body: JSON.stringify(updated) });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteBlock = async () => {
        try {
            await fetch(url, { method: "DELETE" });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const functions = {
        updateBlock,
        deleteBlock,
    };

    return {
        block: data,
        ...state,
        ...functions,
    };
};

export default useBlock;
