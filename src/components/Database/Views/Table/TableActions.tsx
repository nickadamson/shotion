/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Table, Header, Column } from "@tanstack/react-table";
import { FC } from "react";
import { useSWRConfig } from "swr";

import { ParsedPage } from "src/pages/api/pages/[pageId]";
import { handleNewProperty } from "src/utils/api";

// eslint-disable-next-line import/no-cycle
import { TableMeta } from ".";

type TableActionsProps = {
    table: Table<ParsedPage>;
    header: Header<ParsedPage, unknown>;
    column: Column<ParsedPage, unknown>;
};

const TableActions: FC<TableActionsProps> = ({ table, header, column }) => {
    const { mutate } = useSWRConfig();
    const meta = table.options.meta as TableMeta;

    const handleNewColumn = async () => {
        const success = await handleNewProperty({
            databaseId: meta.databaseId,
            childrenPages:
                (table?.getRowModel().rows?.map((row) => ({
                    id: row.original.id,
                    propertyValues: row.original.propertyValues,
                })) as ParsedPage[]) ?? null,
            views: meta.views,
        });

        await mutate(`/api/databases/${meta.databaseId}`);
    };

    return (
        <div className="cursor-pointer" onClick={() => handleNewColumn()}>
            +
        </div>
    );
};

export default TableActions;
