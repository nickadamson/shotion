type TableActionsProps = {
    table: Table<ParsedPage>;
    header: Header<ParsedPage, unknown>;
    column: Column<ParsedPage, unknown>;
};

const TableActions: FC<TableActionsProps> = ({ table, header, column }) => {
    const meta = table.options.meta as TableMeta;

    const handleNewColumn = async () => {
        const success = await handleNewProperty({
            databaseId: meta.databaseId,
            childrenPages:
                table?.getRowModel().rows?.map((row) => ({
                    id: row.original.id,
                    propertyValues: row.original.propertyValues,
                })) ?? null,
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
