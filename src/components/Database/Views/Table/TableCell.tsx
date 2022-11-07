import { BLOCKTYPE, Prisma } from "@prisma/client";
import { Cell, Column, ColumnDef, Row, Table } from "@tanstack/react-table";
import { FC, forwardRef, useEffect, useState } from "react";
import { useSWRConfig } from "swr";

import { ParsedPage } from "src/pages/api/pages/[pageId]";
import { formatRTO, getDefaultValueForPropertyType } from "src/utils";
import { postNewPage, deletePage, updatePage } from "src/utils/api";
import { RTO } from "src/utils/types";

import PropertySelectDropdown from "./Dropdowns/PropertySelectDropdown";
import SelectOptionsDropdown from "./Dropdowns/SelectOptionsDropdown";

import { TableMeta } from ".";

const colors = {
    default: {
        border: `border-default-700`,
        background: `bg-default-200`,
        text: `text-default-900`,
    },
    grey: {
        border: `border-grey-700`,
        background: `bg-grey-200`,
        text: `text-grey-900`,
    },
    brown: {
        border: `border-brown-700`,
        background: `bg-brown-200`,
        text: `text-brown-900`,
    },
    orange: {
        border: `border-orange-700`,
        background: `bg-orange-200`,
        text: `text-orange-900`,
    },
    yellow: {
        border: `border-yellow-700`,
        background: `bg-yellow-200`,
        text: `text-yellow-900`,
    },
    green: {
        border: `border-green-700`,
        background: `bg-green-200`,
        text: `text-green-900`,
    },
    blue: {
        border: `border-blue-700`,
        background: `bg-blue-200`,
        text: `text-blue-900`,
    },
    pink: {
        border: `border-pink-700`,
        background: `bg-pink-200`,
        text: `text-pink-900`,
    },
};

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
        const meta = table.options.meta as TableMeta;
        const columnType = (
            column.columnDef as unknown as ColumnDef<ParsedPage, unknown> & {
                type: string;
            }
        ).type;

        const [value, setValue] = useState(columnType === "multiselect" ? [] : "");
        const [showSelectDropdown, setShowSelectDropdown] = useState(false);
        const [showRowOptions, setShowRowOptions] = useState(false);
        const [showRowDropdown, setShowRowDropdown] = useState(false);

        useEffect(() => {
            setValue(getValue());
        }, []);

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

            await postNewPage({ ...data });
            await mutate(`/api/databases/${meta.databaseId}`);

            // meta.dispatch({
            //     type: "new_page",
            //     payload: {
            //         newPage: { ...data },
            //         mutate,
            //     },
            // });
        };

        const handleDeleteRow = async () => {
            setShowRowDropdown(false);

            await deletePage({ id: cell.row.original.id });
            await mutate(`/api/databases/${meta.databaseId}`);
            // meta.deleteRow(cell.row.index);
            // meta.dispatch({
            //     type: "delete_page",
            //     payload: {
            //         id: cell.row.original.id,
            //         mutate,
            //     },
            // });
        };

        const handleChange = (e) => {
            console.log(e);
        };
        const handleTitleChange = (newTitle: string) => {
            setValue(newTitle);
        };
        const onTitleBlur = async () => {
            await updatePage({
                id: cell.row.original.id,
                title: formatRTO({
                    ...(cell.row.original.title as RTO),
                    text: { content: value as string },
                    plainText: value as string,
                }),
            });
            await mutate(`/api/databases/${meta.databaseId}`);
        };

        const handleTextChange = (newValue: string) => {
            setValue(newValue);
        };
        const handleSelectOption = async (option) => {
            setShowSelectDropdown(false);
            if (columnType === "multiselect") {
                setValue((prevState: string[]) => [...prevState, option]);
                await updatePage({
                    id: cell.row.original.id,
                    propertyValues: {
                        ...(cell.row.original.propertyValues as Record<string, any>),
                        [`${cell.column.columnDef.id}`]:
                            cell.row.original.propertyValues[`${cell.column.columnDef.id}`].push(option),
                    },
                });
                await mutate(`/api/databases/${meta.databaseId}`);
            } else {
                setValue(option);
                await onTextBlur();
            }
        };

        const onTextBlur = async () => {
            await updatePage({
                id: cell.row.original.id,
                propertyValues: {
                    ...(cell.row.original.propertyValues as Record<string, any>),
                    [`${cell.column.columnDef.id}`]: value as Prisma.JsonValue,
                },
            });

            await mutate(`/api/databases/${meta.databaseId}`);
        };
        // onChangeNewOption: () => void;
        // onBlurNewOption: () => void;

        return (
            <div className={`flex flex-row h-8 ${borderStyle}`}>
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
                                            {/* <AddIcon onClick={handleNewRow} /> */}
                                            +Icon
                                        </span>

                                        <div>
                                            <span className={showRowOptions ? "opacity-100" : "opacity-0"}>
                                                {/* <DragIndicatorIcon onClick={handleDeleteRow} /> */}
                                                DragIcon
                                                {/* {showRowDropdown && (
                                                    <RowDropdown
                                                        setShowDropdown={setShowRowDropdown}
                                                        handleDeleteRow={handleDeleteRow}
                                                    />
                                                )} */}
                                            </span>
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
                        onChange={(e) => handleTextChange(e.target.value)}
                        onBlur={() => onTextBlur()}
                    />
                )}
                {columnType === "select" && (
                    <div
                        className="w-full min-h-full border border-orange-400"
                        onClick={() => setShowSelectDropdown(true)}
                    >
                        <div className="min-w-full min-h-full">
                            {column.columnDef.details?.options?.map((option, i) => {
                                const { border, background, text } = colors[option.color];
                                const classNameStr = `${border} ${background} ${text}`;
                                if (value === option.id) {
                                    return (
                                        <div key={option.id ?? i} className={classNameStr}>
                                            {option.name}
                                        </div>
                                    );
                                }
                            })}
                        </div>
                        {showSelectDropdown && (
                            <SelectOptionsDropdown
                                options={column.columnDef.details?.options}
                                onSelect={handleSelectOption}
                            />
                        )}
                        {/* {showSelectDropdown && <PropertySelectDropdown options={column.columnDef.details?.options} />} */}
                    </div>
                )}
                {columnType === "multiselect" && (
                    <div className="w-full h-full" onClick={() => setShowSelectDropdown(true)}>
                        <div className="flex min-w-full min-h-full">
                            {column.columnDef.details?.options?.map((option, i) => {
                                if (value?.includes(option.id)) {
                                    const { border, background, text } = colors[option.color];
                                    const classNameStr = `${border} ${background} ${text}`;
                                    return (
                                        <div key={option.id ?? i} className={classNameStr}>
                                            {option.name}
                                        </div>
                                    );
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
                {columnType == "date" && (
                    <input
                        className="min-w-full border-none border-b-neutral-900 focus:outline-none"
                        type="date"
                        value={value ?? new Date(Date.now().toLocaleString())}
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
