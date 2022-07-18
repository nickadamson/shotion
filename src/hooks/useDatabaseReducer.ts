import { PROPERTYTYPE } from "@prisma/client";
import { mutate } from "swr";
import { ScopedMutator } from "swr/dist/types";

import { ParsedDatabase } from "src/pages/api/databases/[databaseId]";
import { ParsedPage } from "src/pages/api/pages/[pageId]";
import { formatRTO } from "src/utils";
import { deletePage, postNewPage, updatePage } from "src/utils/api";

export const ACTIONS = {
    DEBOUNCE: "debounce",
    UPDATE_DATA: "update_data",
    NEW_PAGE: "new_page",
    DELETE_PAGE: "delete_page",
    COLUMN_VISIBILITY: "col_vis",
    COLUMN_ORDER: "col_order",
};

export interface DatabaseAction {
    type: "debounce" | "update_data" | "new_page" | "delete_page" | "col_vis" | "col_order";
    payload?: {
        id?: string;
        mutate?: ScopedMutator<any>;
        newDb?: Partial<ParsedDatabase>;
        newPage?: Partial<ParsedPage>;
        newState?: any;
        newCell?: { row: ParsedPage; propertyId: string; value: unknown; columnType: PROPERTYTYPE };
    };
}

export const dbReducer = (state: any, action: DatabaseAction) => {
    switch (action.type) {
        case ACTIONS.DEBOUNCE: {
            return {
                ...state,
                database: { ...action.payload.newDb },
            };
        }
        case ACTIONS.UPDATE_DATA: {
            const { row, propertyId, columnType, value } = action.payload.newCell;
            console.log({ state, row, propertyId, value });

            const newState = { ...state };
            let updatedPage;

            if (columnType === "title") {
                newState.database.childrenPages = newState.database.childrenPages.map((page) => {
                    if (page.id === row.id) {
                        page.title = formatRTO({
                            ...page.title,
                            text: { content: value },
                            plainText: value,
                        });
                        updatedPage = page;
                    }
                    return page;
                });
            } else {
                newState.database.childrenPages = newState.database.childrenPages.map((page) => {
                    if (page.id === row.id) {
                        page.propertyValues = {
                            ...page.propertyValues,
                            [`${propertyId}`]: value,
                        };
                        updatedPage = page;
                    }
                    return page;
                });
            }

            updatePage({ ...updatedPage });
            return {
                ...newState,
            };
        }

        case ACTIONS.NEW_PAGE: {
            postNewPage({ ...action.payload.newPage });

            setTimeout(() => {
                mutate(`/api/databases/${state.database.id}`);
            }, 100);

            return {
                ...state,
                columnVisibility: { ...action?.payload?.newState },
            };
        }
        case ACTIONS.DELETE_PAGE: {
            deletePage({ id: action.payload.id });

            setTimeout(async () => {
                const newDb = await mutate(`/api/databases/${state.database.id}`);
            }, 100);

            return {
                ...state,
                columnVisibility: { ...action?.payload?.newState },
            };
        }
        case ACTIONS.COLUMN_VISIBILITY: {
            console.log("not implemented yet1");
            return {
                ...state,
                columnVisibility: { ...action?.payload?.newState },
            };
        }
        case ACTIONS.COLUMN_ORDER: {
            console.log("not implemented yet2");
            return {
                ...state,
                columnVisibility: { ...action?.payload?.newState },
            };
        }

        default:
            console.log(action.type, " not implemented yet");
            return state;
    }
};
