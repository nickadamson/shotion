import {
  ColumnDef,
  ColumnVisibilityState,
  ColumnOrderState,
  ColumnResizeMode,
} from "@tanstack/react-table";
import { DatabaseWithRelations } from "src/pages/api/databases/[databaseId]";
import { FormattedPageWRelations } from "src/pages/api/pages/[pageId]";
import { ParsedFormatting } from "src/utils/types";

export type DatabaseAction = {
  type:
    | "COLUMN_VISIBILITY"
    | "COLUMN_ORDER";
  payload?: {
    newDb?: Partial<DatabaseWithRelations>;
    newState?: any;
  };
};

export type TableState = {
  data: DatabaseWithRelations[];
  columns: ColumnDef<FormattedPageWRelations>[];
  format: ParsedFormatting; //Format;
  columnVisibility: ColumnVisibilityState;
  columnSizing: Record<any, number>;
  columnOrder: ColumnOrderState;
  columnResizeMode: ColumnResizeMode;
};

export const accessorFunction = ({
  originalRow,
  propertyId,
  index,
  type,
  details,
}) => {
  switch (type) {
    case "title":
      return originalRow?.title?.plainText;
    case "text":
      return originalRow?.propertyValues[`${propertyId}`].plainText;
    case "select":
      return originalRow.propertyValues[`${propertyId}`].selectedOption;
    default:
      return JSON.stringify(originalRow.propertyValues[`${propertyId}`]);
  }
};

export const initTableState = (db: any): TableState => {
  const columns = getTableColumnsFromDbProperties(db.properties);

  const { format } = {
    ...db.views?.map((view) => {
      if (view.default) {
        return view;
      }
    })[0],
  };

  const columnOrder = format.order;
  const { columnSizing, columnVisibility } = format.details;

  return {
    format: format as ParsedFormatting,
    data: [...db.childrenPages],
    columns,
    columnOrder,
    columnSizing,
    columnVisibility,
    columnResizeMode: "onChange",
  };
};

export const dbReducer = (state: any, action: DatabaseAction) => {
  switch (action.type) {
    case "debounce":
      console.log("not implemented yet1");
    default:
      console.log("not implemented yet");
      return state;
  }
};

const getTableColumnsFromDbProperties = (properties): ColumnDef<TData>[] => {
  const columns = properties?.map((property) => {
    return {
      id: `${property?.id}`,
      name: `${property?.name}`,
      type: property.type,
      details: property?.details,
      accessorKey: `${property.id}`,
      accessorFn: (originalRow, index) =>
        accessorFunction({
          originalRow: originalRow,
          propertyId: property.id,
          index: index,
          type: property.type,
          details: property?.details,
        }),
    };
  });

  return columns;
};
