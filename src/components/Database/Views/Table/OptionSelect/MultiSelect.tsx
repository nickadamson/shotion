import { Table } from "@tanstack/react-table";
import { useState, useRef, FC } from "react";
import { FormattedPageWRelations } from "src/pages/api/pages/[pageId]";

type MultiSelectProps = {
    table: Table<FormattedPageWRelations>;
    tableIndex: number;
    colIndex: number;
    rowIndex: number;
    children: unknown;
};

const MultiSelect: FC<MultiSelectProps> = ({ table, tableIndex, colIndex, rowIndex, children }) => {
    const [inputValue, changeInputValue] = useState("");
    const [headCell] = useState(table[tableIndex].rows[0].data[colIndex]);
    const [data] = useState(table[tableIndex].rows[rowIndex + 1].data[colIndex]);
    const [transform, setTransform] = useState("");
    const [opacity, setOpacity] = useState(0);
    return (
        <>
            <div>MultiSelect</div>
        </>
    );
};

export default MultiSelect;
