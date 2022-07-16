import { FC } from "react";
import { flexRender, Row } from "@tanstack/react-table";

type TableRowProps = {
    row: Row<any>;
};

const TableRow: FC<TableRowProps> = (props: TableRowProps) => {
    const { row } = props;

    return (
        <>
            {row.getVisibleCells().map((cell, i) => {
                return (
                    <td key={`${row.id}-${row.original.id}-${cell.column.id}-${cell.id}-${i}`}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                );
            })}
        </>
    );
};

export default TableRow;
