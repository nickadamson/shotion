/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/no-cycle */
import AddIcon from "@material-ui/icons/Add";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { Cell, Column, ColumnDef, Row, Table } from "@tanstack/react-table";
import { FC, forwardRef, useEffect, useState } from "react";

import { ParsedPage } from "src/pages/api/pages/[pageId]";
import { getDefaultValueForPropertyType } from "src/utils";

import RowDropdown from "./Dropdowns/RowDropdown";

import { TableMeta } from ".";
import PropertySelectDropdown from "./Dropdowns/PropertySelectDropdown";
import { BLOCKTYPE } from "@prisma/client";
import { useSWRConfig } from "swr";

type TableCellProps = {
    table: Table<ParsedPage>;
    column: Column<ParsedPage, unknown>;
    row: Row<ParsedPage>;
    cell: Cell<ParsedPage, unknown>;
    getValue: () => any;
    renderValue: () => any;
};

const TableCell: FC<TableCellProps> = forwardRef<HTMLTableColElement, TableCellProps>(
    (props: TableCellProps, tableRef) => {
        const { table, column, row, cell, getValue, renderValue } = props;
        const { mutate } = useSWRConfig();

        const [value, setValue] = useState("");
        const [showSelectDropdown, setShowSelectDropdown] = useState(false);
        const [showRowOptions, setShowRowOptions] = useState(false);
        const [showRowDropdown, setShowRowDropdown] = useState(false);

        useEffect(() => {
            setValue(getValue());
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const meta = table.options.meta as TableMeta;

        const columnType = (
            column.columnDef as unknown as ColumnDef<ParsedPage, unknown> & {
                type: string;
            }
        ).type;

        // const [property, setProperty] = useState({
        //     type: columnType,
        //     value: getValue(),
        // });

        let borderStyle = "border";
        if (cell?.index == 0) {
            borderStyle = "border-y border-r";
        }
        if (cell?.index == table?.getAllColumns()?.length - 1) {
            borderStyle = "border-y border-l";
        }

        const handleNewRow = async () => {
            const data = {
                type: "page" as BLOCKTYPE,
                parentDbId: meta.databaseId,
                propertyValues: {},
            };

            table.getAllColumns().forEach((col) => {
                data.propertyValues[`${col.id}`] = getDefaultValueForPropertyType(col.columnDef?.type);
            });

            meta.dispatch({
                type: "new_page",
                payload: {
                    newPage: { ...data },
                    mutate,
                },
            });
        };

        const handleDeleteRow = async () => {
            setShowRowDropdown(false);
            // meta.deleteRow(cell.row.index);
            meta.dispatch({
                type: "delete_page",
                payload: {
                    id: cell.row.original.id,
                    mutate,
                },
            });
        };

        const handleChange = (e) => {
            console.log(e);
        };
        const handleTitleChange = (newTitle: string) => {
            setValue(newTitle);
            // meta.updateData(cell.row.index, cell.column.columnDef.id, newTitle);
        };

        const onTitleBlur = async () => {
            meta.dispatch({
                type: "update_data",
                payload: {
                    newCell: {
                        row: cell.row.original,
                        propertyId: cell.column.columnDef.id,
                        value,
                        columnType: "title",
                    },
                },
            });
        };

        return (
            <div className={`flex flex-row ${borderStyle}`}>
                {columnType === "title" && (
                    <div
                        className="flex flex-row w-full"
                        onMouseEnter={() => setShowRowOptions(true)}
                        onMouseLeave={() => setShowRowOptions(false)}
                    >
                        {showRowOptions && (
                            <div className="inline-block relative">
                                <div className="absolute mr-2 -translate-x-full">
                                    <div className="flex flex-row">
                                        <span className={showRowOptions ? "opacity-100" : "opacity-0"}>
                                            <AddIcon onClick={() => handleNewRow()} />
                                        </span>

                                        <div>
                                            <span className={showRowOptions ? "opacity-100" : "opacity-0"}>
                                                <DragIndicatorIcon onClick={() => setShowRowDropdown(true)} />
                                            </span>

                                            {showRowDropdown && (
                                                <RowDropdown
                                                    setShowDropdown={setShowRowDropdown}
                                                    handleDeleteRow={handleDeleteRow}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <input
                            className="min-w-full border-none border-b-neutral-900 focus:outline-none"
                            value={value ?? ""}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            onBlur={() => onTitleBlur()}
                        />
                    </div>
                )}
                {columnType == "text" && (
                    <input
                        className="min-w-full border-none border-b-neutral-900 focus:outline-none"
                        value={value ?? ""}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={() => onBlur()}
                    />
                )}
                {columnType === "select" && (
                    <div className="w-full h-full" onClick={() => setShowSelectDropdown(true)}>
                        <div className="min-w-full min-h-full">
                            {column.columnDef.details?.options?.map((option, i) => {
                                if (value === option.name) {
                                    return <div key={option.id ?? i}>{option.name}</div>;
                                }
                            })}
                        </div>
                        {showSelectDropdown && <PropertySelectDropdown options={column.columnDef.details?.options} />}
                    </div>
                )}
                {columnType == "checkbox" && (
                    <input
                        className="min-w-full border-none border-b-neutral-900 focus:outline-none"
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={() => onBlur()}
                    />
                )}
            </div>
        );
    }
);

TableCell.displayName = "TableCell";
export default TableCell;
