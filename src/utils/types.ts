import { View } from "@prisma/client";
import {
    ColumnSizingState,
    ColumnDef,
    VisibilityState,
    ColumnOrderState,
    ColumnResizeMode,
    FilterFn,
    FilterFnOption,
    FilterMeta,
    SortDirection,
    SortingState,
    SortingFn,
    SortingFnOption,
} from "@tanstack/react-table";
import { DatabaseWithRelations } from "src/pages/api/databases/[databaseId]";
import { FormattedPageWRelations } from "src/pages/api/pages/[pageId]";

export type ErrorMsg = {
    err?: string | Error;
    message?: string;
};
export type RTO = {
    type: "text";
    text: { content: string; link: string };
    annotations: {
        bold: boolean;
        italic: boolean;
        strikethrough: boolean;
        underline: boolean;
        code: boolean;
        color: string;
    };
    plainText: string;
    href: null;
};

export type DatabaseAction = {
    type: "COLUMN_VISIBILITY" | "COLUMN_ORDER";
    payload?: {
        newDb?: Partial<DatabaseWithRelations>;
        newState?: any;
    };
};

/**
 * @param tableWidth - the full width of the table, including ACTIONS column
 * @param columnWidths - an array of {columnId: columnWidth }
 */
export type TableSizingState = {
    tableWidth: number;
    columnWidths: ColumnSizingState[];
};

export type TableViewsMeta = Array<
    Partial<View> & {
        format: ParsedFormatting;
    }
>;

export type TableState = {
    data: FormattedPageWRelations[];
    columns: ColumnDef<FormattedPageWRelations>[];
    columnVisibility: VisibilityState;
    columnOrder: ColumnOrderState;
    tableSizing: TableSizingState;
    columnResizeMode: ColumnResizeMode;
    format: ParsedFormatting;
    views: TableViewsMeta;
};

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
            state: SortingState; // [];
            function: SortingFn<unknown>;
            option: SortingFnOption<unknown>;
        }>;
        columnVisibility: VisibilityState;
        tableSizing: TableSizingState;
    };
}
