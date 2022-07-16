import { DatabaseWithRelations } from "./../pages/api/databases/[databaseId]";
import useSWR from "swr";
import { Database } from "@prisma/client";
import { fetcher } from "src/utils/api";

const useDatabase = ({ databaseId }: { databaseId?: string }) => {
    const url = `/api/databases/${databaseId}`;
    const { data, error } = useSWR<DatabaseWithRelations>(url, fetcher);

    const state = {
        isLoading: !error && !data,
        isError: error,
    };

    const updateDatabase = async (updated: Partial<Database>): Promise<boolean> => {
        try {
            await fetch(url, { method: "PUT", body: JSON.stringify(updated) });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteDatabase = async () => {
        try {
            await fetch(url, { method: "DELETE" });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const functions = {
        updateDatabase,
        deleteDatabase,
    };

    return {
        database: data,
        ...state,
        ...functions,
    };
};

export default useDatabase;
