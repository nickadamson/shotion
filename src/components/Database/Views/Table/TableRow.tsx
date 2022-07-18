import { flexRender, Row } from "@tanstack/react-table";
import { FC } from "react";

type TableRowProps = {
    row: Row<any>;
};

const TableRow: FC<TableRowProps> = (props: TableRowProps) => {
    const { row } = props;

    return (
        <>
            {row.getVisibleCells().map((cell) => (
                <td key={`${cell.column.id}-${cell.id}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </>
    );
};

export default TableRow;
