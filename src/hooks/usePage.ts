import { FormattedPageWRelations } from "./../pages/api/pages/[pageId]";
import useSWR from "swr";
import { Page } from "@prisma/client";
import { fetcher } from "src/utils/index";

const usePage = ({ pageId }: { pageId: string }) => {
  const url = `/api/pages/${pageId}`;
  const { data, error } = useSWR<FormattedPageWRelations>(url, fetcher);

  const state = {
    isLoading: !error && !data,
    isError: error,
  };

  const updatePage = async (updated: Partial<Page>): Promise<boolean> => {
    try {
      await fetch(url, { method: "PUT", body: JSON.stringify(updated) });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const deletePage = async () => {
    try {
      await fetch(url, { method: "DELETE" });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const functions = {
    updatePage,
    deletePage,
  };

  return {
    page: data,
    ...state,
    ...functions,
  };
};

export default usePage;
