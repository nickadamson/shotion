import { Cell, Column, Row, Table } from "@tanstack/react-table";
import { FC, forwardRef, useState } from "react";
import { useSWRConfig } from "swr";
import { TableMeta } from ".";
import AddIcon from "@material-ui/icons/Add";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import RowDropdown from "./Dropdowns/RowDropdown";
import { formatRTO } from "@/db/prisma/propertyTypesBolierplate";

type TableCellProps = {
  table: Table<any>;
  column: Column<any, unknown>;
  row: Row<any>;
  cell: Cell<any, unknown>;
  getValue: () => any;
  renderValue: () => any;
};

const TableCell: FC<TableCellProps> = forwardRef<
  HTMLTableColElement,
  TableCellProps
>((props: TableCellProps, tableRef) => {
  const { table, column, row, cell, getValue, renderValue } = props;
  const { mutate } = useSWRConfig();
  const meta = table.options.meta as TableMeta;

  const [property, setProperty] = useState({
    type: column?.columnDef?.type,
    value: getValue(),
  });

  const [showSelectDropdown, setShowSelectDropdown] = useState(false);
  const [showRowOptions, setShowRowOptions] = useState(false);
  const [showRowDropdown, setShowRowDropdown] = useState(false);

  let borderStyle = "border";
  if (cell?.index == 0) {
    borderStyle = "border-y border-r";
  }
  if (cell?.index == table?.getAllColumns()?.length - 1) {
    borderStyle = "border-y border-l";
  }

  const handleNewRow = async () => {
    const data = {
      type: "page",
      parentDbId: meta.dbId,
      propertyValues: {},
    };

    table.getAllColumns().forEach((column) => {
      switch (column.columnDef.type) {
        case "title":
          break;
        case "text":
          data.propertyValues[`${column.id}`] = formatRTO();
          break;
        case "select":
          data.propertyValues[`${column.id}`] = { selectedOption: null };
          break;

        default:
          break;
      }
    });

    // const success = await newPage()

    // if (success) {
    // }
  };

  const handleChange = (newValue) => {
    setProperty((prevState) => ({
      type: prevState.type,
      value: newValue,
    }));
  };

  const onBlur = async () => {
    let data = { ...row.original };

    switch (column?.columnDef?.type) {
      case "title":
        data.title = formatRTO(property.value);
        // data.title.text.content = property.value;
        break;
      case "text":
        data.propertyValues[`${column.columnDef.id}`] = formatRTO(
          property.value
        );
        break;
      // case 'select':

      //   break;

      default:
        data.propertyValues[`${column.columnDef.id}`].value = property.value;
        break;
    }

    // const success = await updatePage()

    // if (success) {
    // }
  };

  return (
    <>
      <div className={`flex flex-row ${borderStyle}`}>
        {column?.columnDef?.type == "title" && (
          <div
            className="flex flex-row w-full"
            onMouseEnter={() => setShowRowOptions(true)}
            onMouseLeave={() => setShowRowOptions(false)}
          >
            {showRowOptions && (
              <div className="inline-block relative">
                <div className="absolute mr-2 -translate-x-full">
                  <div className="flex flex-row">
                    <span
                      className={showRowOptions ? "opacity-100" : "opacity-0"}
                      onClick={() => handleNewRow()}
                    >
                      <AddIcon onClick={() => handleNewRow()} />
                    </span>

                    <div>
                      <span
                        className={showRowOptions ? "opacity-100" : "opacity-0"}
                      >
                        <DragIndicatorIcon
                          onClick={() => setShowRowDropdown(true)}
                        />
                      </span>

                      {showRowDropdown && (
                        <RowDropdown
                          rowId={row.original.id}
                          databaseId={meta.dbId}
                          setShowDropdown={setShowRowDropdown}
                          reset={table.reset}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <input
              className="min-w-full border-none border-b-neutral-900 focus:outline-none"
              value={property?.value ?? ""}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={() => onBlur()}
            />
          </div>
        )}
        {column?.columnDef?.type == "text" && (
          <input
            className="min-w-full border-none border-b-neutral-900 focus:outline-none"
            value={property?.value ?? ""}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={() => onBlur()}
          />
        )}
        {column?.columnDef?.type == "select" && (
          <div
            className="w-full h-full"
            onClick={() => setShowSelectDropdown(true)}
          >
            <div className="min-w-full min-h-full">
              {column.columnDef.details.options.map((option, i) => {
                if (property?.value == option.name) {
                  return <div key={option.id ?? i}>{option.name}</div>;
                }
              })}
            </div>
            {showSelectDropdown && (
              <></>
            )}
            <input
              className="min-w-full border-none border-b-neutral-900 focus:outline-none"
              value={property?.selectedOption ?? ""}
              // type="button"
              onChange={(e) => handleChange(e.target.value)}
              onBlur={() => onBlur()}
            />
          </div>
        )}
        {column?.columnDef?.type == "checkbox" && (
          <input
            className="min-w-full border-none border-b-neutral-900 focus:outline-none"
            value={property?.title?.text ?? ""}
            type="checkbox"
            checked={property?.checked}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={() => onBlur()}
          />
        )}
      </div>
    </>
  );
});

TableCell.displayName = "TableCell";
export default TableCell;
