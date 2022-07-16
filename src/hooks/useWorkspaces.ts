import useSWR from "swr";
import { fetcher } from "src/utils/api";
import { Database, Page } from "@prisma/client";
import { DatabaseSelect, PageSelect } from "src/pages/api/workspaces";

const useWorkspaces = () => {
    const url = `/api/workspaces`;
    const { data, error } = useSWR<(DatabaseSelect | PageSelect)[]>(url, fetcher);

    const createNewWorkspace = async (newWorkspace: Partial<Database | Page>): Promise<Database | Page | undefined> => {
        let response: Response | undefined;
        try {
            switch (newWorkspace.object) {
                case "database":
                    response = await fetch("api/databases", {
                        method: "POST",
                        body: JSON.stringify(newWorkspace),
                    });

                    break;
                case "page":
                    response = await fetch("api/pages", {
                        method: "POST",
                        body: JSON.stringify(newWorkspace),
                    });

                    break;
            }

            return (response as Response).json();
        } catch (error) {
            console.log(error);
        }
    };

    const functions = {
        createNewWorkspace,
    };

    const state = {
        spacesLoading: !error && !data,
        spacesError: error,
    };

    return {
        workspaces: data,
        ...functions,
        ...state,
    };
};

export default useWorkspaces;
