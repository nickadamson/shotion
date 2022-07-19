/* eslint-disable import/no-cycle */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import {
    ColumnDef,
    ColumnOrderState,
    ColumnResizeMode,
    ColumnSizingState,
    flexRender,
    getCoreRowModel,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import { Dispatch, FC, useEffect, useState } from "react";

// import { DatabaseAction } from "@/hooks/useDatabaseReducer";
import { ParsedDatabase } from "src/pages/api/databases/[databaseId]";
import { ParsedFormat } from "src/pages/api/formats/[formatId]";
import { ParsedPage } from "src/pages/api/pages/[pageId]";
import { ParsedProperty } from "src/pages/api/properties/[propertyId]";
import { ParsedView } from "src/pages/api/views/[viewId]";

import ColumnHeader from "./ColumnHeader";
import TableActions from "./TableActions";
import TableCell from "./TableCell";
import TableRow from "./TableRow";

export interface TableMeta {
    deleteRow: (rowIndex: number) => void;
    updateData: (rowIndex: number, columnId: string, value: number | string) => void;
    databaseId: string;
    // dispatch: Dispatch<DatabaseAction>; // DatabaseAction>;
    views: ParsedView[]; // TableViewsMeta;
}

interface TableProps {
    // databaseId: string;
    database: ParsedDatabase;
    // dispatch: Dispatch<DatabaseAction>;
}

/**
 * @param tableWidth - the full width of the table, including ACTIONS column
 * @param columnWidths - an array of {columnId: columnWidth }
 */
export interface TableSizingState {
    tableWidth: number;
    columnWidths: ColumnSizingState[];
}

export type TableState = {
    data: ParsedPage[];
    columns: ColumnDef<ParsedPage>[];
    columnVisibility: VisibilityState;
    columnOrder: ColumnOrderState;
    tableSizing: TableSizingState;
    columnResizeMode: ColumnResizeMode;
    format: ParsedFormat;
    views: ParsedView[];
};

const defaultColumn: Partial<ColumnDef<ParsedPage>> = {
    header: (props) =>
        props.column.columnDef.id === "actions" ? <TableActions {...props} /> : <ColumnHeader {...props} />,
    cell: (props) => (props.column.columnDef.id === "actions" ? <div /> : <TableCell {...props} />),
};

const accessorFunction = ({ originalRow, propertyId, index, type, details }) => {
    switch (type) {
        case "title":
            return originalRow?.title?.plainText;
        default:
            return originalRow?.propertyValues?.[`${propertyId}`];
    }
};

const getTableColumnsFromDbProperties = (properties: ParsedProperty[]): ColumnDef<ParsedPage>[] => {
    const columns = properties?.map((property) => ({
        id: `${property?.id}`,
        name: `${property?.name}`,
        type: property.type,
        details: property.details,
        accessorKey: `${property.id}`,
        accessorFn: (originalRow, index) =>
            accessorFunction({
                originalRow,
                propertyId: property.id,
                index,
                type: property.type,
                details: property?.details,
            }),
    }));

    columns.push({
        id: "actions", // TableActions display column
        accessorFn: null,
        accessorKey: null,
        name: null,
        type: null,
        details: null,
    });

    return columns;
};

export const initTableState = (db: ParsedDatabase): TableState => {
    const columns = getTableColumnsFromDbProperties(db.properties);

    const defaultView = {
        ...db.views?.map((view) => {
            if (view.default) {
                return view as ParsedView;
            }
        })[0],
    };
    const { format } = defaultView;

    const { columnOrder, columnVisibility, tableSizing } = format.details;

    return {
        format,
        data: [...db.childrenPages],
        columns,
        columnOrder,
        tableSizing,
        columnVisibility,
        columnResizeMode: "onEnd",
        views: db.views,
    };
};

const TableView: FC<TableProps> = ({ database }) => {
    const [tableViewState, setTableViewState] = useState<TableState>(initTableState(database));

    useEffect(() => {
        setTableViewState(initTableState(database));
    }, [database]);

    const handleColumnVisChange = (newState) => {
        console.log("views/table handleChangeVis", newState);
        setTableViewState((prevState) => ({
            ...prevState,
            columnVisibility: {
                ...prevState.columnVisibility,
                ...newState,
            },
        }));

        // dispatch({
        //     type: "col_vis",
        //     payload: { newState },
        // });
    };

    const handleColumnOrderChange = (newState) => {
        console.log("views/table handleChangeOrder", newState);
        setTableViewState((prevState) => ({
            ...prevState,
            columOrder: [...newState],
        }));
        // todo
        // dispatch({
        //     type: "COLUMN_ORDER",
        //     payload: { newState },
        // });
    };

    const table = useReactTable({
        data: tableViewState?.data,
        columns: tableViewState?.columns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        state: {
            columnOrder: tableViewState?.columnOrder,
            columnVisibility: tableViewState?.columnVisibility,
        },
        onColumnVisibilityChange: (newState) => handleColumnVisChange(newState),
        onColumnOrderChange: (newState) => handleColumnOrderChange(newState),
        columnResizeMode: tableViewState?.columnResizeMode,
        meta: {
            databaseId: database.id,
            // dispatch,
            views: tableViewState.views,
            deleteRow: (rowIndex) => {
                setTableViewState((prevState) => ({
                    ...prevState,
                    data: prevState.data.map((row, index) => {
                        if (index !== rowIndex) return row;
                    }),
                }));
            },
            updateData: (rowIndex, columnId, value) => {
                setTableViewState((prevState) => ({
                    ...prevState,
                    data: prevState.data.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...prevState[rowIndex],
                                [columnId]: value,
                            };
                        }
                        return row;
                    }),
                }));
            },
        } as TableMeta,
        // debugAll: true,
        // debugTable: true,
    });

    return (
        <div className="flex flex-row w-full">
            {table && tableViewState?.data != null && (
                <table>
                    <thead>
                        <tr key="headers">
                            {table.getFlatHeaders().map((header, i) => (
                                <th key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.original?.id}>
                                <TableRow row={row} />
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
export default TableView;
