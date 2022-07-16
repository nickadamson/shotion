import useSWR from "swr";
import { Block } from "@prisma/client";
import { fetcher } from "src/utils/api";
import { FormattedBlockWRelations } from "src/pages/api/blocks/[blockId]";

const useBlock = ({ blockId }: { blockId?: string }) => {
    const url = `/api/blocks${blockId ? `/${blockId}` : ""}`;
    const { data, error } = useSWR<FormattedBlockWRelations>(url, fetcher);

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
