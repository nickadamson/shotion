/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { ChangeEvent, FC, useEffect, useReducer } from "react";

import { dbReducer } from "@/hooks/useDatabaseReducer";
import { ParsedDatabase } from "src/pages/api/databases/[databaseId]";

import PageTitle from "../Blocks/PageTitle";

import TableView, { initTableState } from "./Views/Table";
import ViewSelect from "./Views/ViewSelect";

interface DatabaseViewerProps {
    database: ParsedDatabase;
    temporaryTitleValue: string;
    handleTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
    updateTitle: () => Promise<void>;
}

const ViewHeader: FC<Partial<DatabaseViewerProps> & { isInline: boolean }> = ({
    isInline,
    temporaryTitleValue,
    handleTitleChange,
    updateTitle,
}) =>
    isInline ? (
        <>
            <ViewSelect />
            <PageTitle
                temporaryValue={temporaryTitleValue}
                handleChange={handleTitleChange}
                updateTitle={updateTitle}
            />
        </>
    ) : (
        <>
            <PageTitle
                temporaryValue={temporaryTitleValue}
                handleChange={handleTitleChange}
                updateTitle={updateTitle}
            />
            <ViewSelect />
        </>
    );

const DatabaseViewer: FC<DatabaseViewerProps> = ({
    database,
    temporaryTitleValue = "",
    handleTitleChange,
    updateTitle,
}) => {
    const initialState = {
        database: { ...database },
        activeView: {
            ...database.views.map((view) => {
                if (view.default) {
                    return { ...view };
                }
            })[0],
        },
    };

    const [state, dispatch] = useReducer(dbReducer, initialState);

    useEffect(() => {
        console.log("debounce");
        dispatch({ type: "debounce", payload: { newDb: database } });
    }, [database]);

    return (
        <>
            <ViewHeader
                isInline={database.isInline}
                temporaryTitleValue={temporaryTitleValue}
                handleTitleChange={handleTitleChange}
                updateTitle={updateTitle}
            />
            {state.activeView.type === "table" && (
                <TableView databaseId={database.id} database={database} dispatch={dispatch} />
            )}
        </>
    );
};

export default DatabaseViewer;
