import useSWR from "swr";
import { User } from "@prisma/client";
import { fetcher } from "src/utils/index";

const useUser = ({ userId }: { userId?: string }) => {
    const url = `/api/users${userId ? `/${userId}` : ""}`;
    const { data, error } = useSWR<User>(url, fetcher);

    const state = {
        isLoading: !error && !data,
        isError: error,
    };

    const updateUser = async (updated: User): Promise<boolean> => {
        try {
            await fetch(url, { method: "PUT", body: JSON.stringify(updated) });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteUser = async () => {
        try {
            await fetch(url, { method: "DELETE" });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const functions = {
        updateUser,
        deleteUser,
    };

    return {
        user: { ...data },
        ...state,
        ...functions,
    };
};

export default useUser;
