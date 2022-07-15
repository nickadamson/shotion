import { Dispatch, FC, useState } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  flexRender,
  VisibilityState,
} from "@tanstack/react-table";
import TableRow from "./TableRow";
import TableCell from "./TableCell";
import ColumnHeader from "./ColumnHeader";
import { DatabaseAction, TableState } from "@/hooks/useDatabaseReducer";
import { newProperty } from "src/utils/api";
import { FormattedPageWRelations } from "src/pages/api/pages/[pageId]";

export type TableMeta = {
  databaseId: string;
  dispatch: Dispatch<DatabaseAction>;
};

type TableProps = {
  databaseId: string;
  initialState: TableState;
  dispatch: Dispatch<DatabaseAction>;
};

const defaultColumn: Partial<ColumnDef<FormattedPageWRelations>> = {
  header: (props) => {
    return <ColumnHeader {...props} />;
  },
  cell: (props) => {
    return <TableCell {...props} />;
  },
};

const TableView: FC<TableProps> = (props) => {
  const { databaseId, initialState, dispatch } = props;

  const [tableViewState, setTableViewState] = useState(initialState);

  const handleColumnVisChange = (newState) => {
    console.log("views/table handleChangeVis", newState);
    setTableViewState((prevState) => ({
      ...prevState,
      columnVisibility: {
        ...prevState.columnVisibility,
        ...newState,
      },
    }));

    dispatch({
      type: "COLUMN_VISIBILITY",
      payload: { newState },
    });
  };

  const handleColumnOrderChange = (newState) => {
    console.log("views/table handleChangeOrder", newState);
    setTableViewState((prevState) => ({
      ...prevState,
      columOrder: [...newState],
    }));

    dispatch({
      type: "COLUMN_ORDER",
      payload: { newState },
    });
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
      databaseId,
      dispatch,
    } as TableMeta,
    // debugAll: true,
    debugTable: true,
  });

  const handleNewColumn = async () => {
    const newColumn = await newProperty({
      databaseId: databaseId,
      childrenPages:
        tableViewState?.data?.map((row) => {
          return { id: row.id, propertyValues: row.propertyValues };
        }) ?? null,
    });

    const meta = table.options.meta as TableMeta;
    // meta.dispatch({ type: "debounce" });
  };

  return (
    <div className="flex flex-row w-full">
      {table && tableViewState?.data != null && (
        <table>
          <thead>
            <tr key="headers">
              {table.getFlatHeaders().map((header, i) => {
                return (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.original?.id}>
                  <TableRow row={row} />
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {table && (
        <span
          className="hover:cursor-pointer"
          onClick={() => handleNewColumn()}
        >
          ++
        </span>
      )}
    </div>
  );
};
export default TableView;
