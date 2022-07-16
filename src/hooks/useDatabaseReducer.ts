import TableActions from "@/components/Database/Views/Table/TableActions";
import { View } from "@prisma/client";
import {
    ColumnDef,
    ColumnOrderState,
    ColumnResizeMode,
    ColumnSizingState,
    VisibilityState,
} from "@tanstack/react-table";
import { DatabaseWithRelations } from "src/pages/api/databases/[databaseId]";
import { FormattedPageWRelations } from "src/pages/api/pages/[pageId]";
import { ParsedFormatting } from "src/utils/types";

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
    tableWidth: Number;
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

export const accessorFunction = ({ originalRow, propertyId, index, type, details }) => {
    switch (type) {
        case "title":
            return originalRow?.title?.plainText;
        case "text":
            return originalRow?.propertyValues[`${propertyId}`].plainText;
        case "select":
            console.log(originalRow);
            return originalRow.propertyValues[`${propertyId}`].selectedOption;
        default:
            return JSON.stringify(originalRow.propertyValues[`${propertyId}`]);
    }
};

export const initTableState = (db: any): TableState => {
    const columns = getTableColumnsFromDbProperties(db.properties);

    const defaultView = {
        ...db.views?.map((view) => {
            if (view.default) {
                return view;
            }
        })[0],
    };
    const { format } = defaultView;

    const { columnOrder, columnVisibility, tableSizing } = format.details;

    return {
        format: format as ParsedFormatting,
        data: [...db.childrenPages],
        columns,
        columnOrder,
        tableSizing,
        columnVisibility,
        columnResizeMode: "onEnd",
        views: db.views,
    };
};

export const dbReducer = (state: any, action: DatabaseAction) => {
    switch (action.type) {
        case "debounce":
            console.log("not implemented yet1");
        default:
            console.log("not implemented yet");
            return state;
    }
};

const getTableColumnsFromDbProperties = (properties): ColumnDef<FormattedPageWRelations>[] => {
    let columns = properties?.map((property) => {
        return {
            id: `${property?.id}`,
            name: `${property?.name}`,
            type: property.type,
            details: property?.details,
            accessorKey: `${property.id}`,
            accessorFn: (originalRow, index) =>
                accessorFunction({
                    originalRow: originalRow,
                    propertyId: property.id,
                    index: index,
                    type: property.type,
                    details: property?.details,
                }),
        };
    });

    columns.push({
        id: "actions", // TableActions display column
    });

    return columns;
};
