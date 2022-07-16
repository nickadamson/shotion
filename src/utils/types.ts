import { TableSizingState } from "@/hooks/useDatabaseReducer";

export type ErrorMsg = {
    err?: string;
    message?: string;
};
export type RTO =  {
    type: "text",
    text: { content: string, link: string },
    annotations: {
        bold: boolean,
        italic: boolean,
        strikethrough: boolean,
        underline: boolean,
        code: boolean,
        color: string,
    },
    plainText: string,
    href: null,
},

// export type PropertyType = PROPERTYTYPE | "title" | "text" | "number" | "select" | "multiSelect" | "date" | "person" | "file" | "checkbox" | "url" | "email" | "phoneNumber" | "formula" | "relation" | "createdTime" | "createdBy" | "lastEditedTime" | "lastEditedBy" | "other";

import {
    ColumnOrderState,
    ColumnSizingState,
    FilterFn,
    FilterFnOption,
    FilterMeta,
    SortDirection,
    SortingFn,
    SortingFnOption,
    SortingState,
    VisibilityState,
} from "@tanstack/react-table";

export interface ParsedFormatting {
    id?: string;
    // page
    order: ColumnOrderState; 
    // database
    details: {
        order: ColumnOrderState;
        filters: Array<{
            function?: FilterFn<unknown>;
            option?: FilterFnOption<unknown>;
            meta?: FilterMeta;
        }>;
        sorts: Array<{
            direction: SortDirection;
            state: SortingState; //[];
            function: SortingFn<unknown>;
            option: SortingFnOption<unknown>;
        }>;
        columnVisibility: VisibilityState;
        tableSizing: TableSizingState;
    };
}
