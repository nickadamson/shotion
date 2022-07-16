import { FC } from "react";
import { Table, Column, Header } from "@tanstack/react-table";
import { FormattedPageWRelations } from "src/pages/api/pages/[pageId]";
import { handleNewProperty } from "src/utils/api";
import { TableMeta } from ".";

type TableActionsProps = {
    table: Table<FormattedPageWRelations>;
    header: Header<FormattedPageWRelations, unknown>;
    column: Column<FormattedPageWRelations, unknown>;
};

const TableActions: FC<TableActionsProps> = ({ table, header, column }) => {
    const meta = table.options.meta as TableMeta;

    const handleNewColumn = async () => {
        const success = await handleNewProperty({
            databaseId: meta.databaseId,
            childrenPages:
                table?.getRowModel().rows?.map((row) => {
                    return { id: row.original.id, propertyValues: row.original.propertyValues };
                }) ?? null,
            views: meta.views,
        });

        // todo
    };

    return (
        <div className="cursor-pointer" onClick={() => handleNewColumn()}>
            +
        </div>
    );
};

export default TableActions;
