import { Column, Header, Table } from "@tanstack/react-table";
import { FC, useState } from "react";
import { MoreHoriz } from "@material-ui/icons";
import { TableMeta } from ".";
import ColumnDropdown from "./Dropdowns/ColumnDropdown";
import { deleteProperty, updateProperty } from "src/utils/api";

type ColumnHeaderProps = {
  table: Table<any>;
  header: Header<any, unknown>;
  column: Column<any, unknown>;
};

const ColumnHeader: FC<ColumnHeaderProps> = (props: ColumnHeaderProps) => {
  const { table, header, column } = props;
  const meta = table.options.meta as TableMeta;

  let property;
  table.options.columns.forEach((prop) => {
    if (prop.id == column.id) {
      property = prop;
    }
  });

  const [value, setValue] = useState(property?.name ?? "");
  const [showOptions, setShowOptions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  let borderStyle = "border";
  if (header?.index == 0) {
    borderStyle = "border-y border-r";
  }
  if (header?.index == table.getAllColumns()?.length) {
    borderStyle = "border-y border-l";
  }

  const handleDeleteColumn = async () => {
    const success = await deleteProperty(property);

    if (success) {
      // dispatch
    }

    setShowDropdown(false);
  };

  const onBlur = async () => {
    // await updateProperty(property);
  };

  return (
    <>
      {header.isPlaceholder ? null : (
        <div
          className={`flex items-center flew-row ${borderStyle}`}
          style={{ width: header.getSize() }}
          onMouseEnter={() => setShowOptions(true)}
          onMouseLeave={() => setShowOptions(false)}
        >
          <input
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => onBlur()}
            className="border-none border-b-neutral-900 focus:outline-none"
          />
          {column?.columnDef?.name !== "title" && (
            <div
              className={`element-options ${
                showOptions ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* <span >
                &#43;
              </span> */}
              <div>
                <MoreHoriz onClick={() => setShowDropdown(!showDropdown)} />
              </div>
              {/* <i
                onClick={() => setShowDropdown(!showDropdown)}
              /> */}
              {showDropdown && (
                <ColumnDropdown
                  columnId={column.id}
                  databaseId={meta?.dbId}
                  setShowDropdown={setShowDropdown}
                  deleteColumn={handleDeleteColumn}
                />
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ColumnHeader;
