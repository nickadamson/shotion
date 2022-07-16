import { dbReducer, initTableState } from "@/hooks/useDatabaseReducer";
import { ChangeEvent, useReducer } from "react";
import { DatabaseWithRelations } from "src/pages/api/databases/[databaseId]";
import { useSWRConfig } from "swr";
import PageTitle from "../Blocks/PageTitle";
import TableView from "./Views/Table";
import ViewSelect from "./Views/ViewSelect";

type DatabaseViewerProps = {
    database: DatabaseWithRelations;
    temporaryTitleValue?: string;
    handleTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
    updateTitle: () => Promise<void>;
};

const DatabaseViewer = (props: DatabaseViewerProps) => {
    const { database, temporaryTitleValue, handleTitleChange, updateTitle } = props;
    const { mutate } = useSWRConfig();

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

    return (
        <>
            {/* <div>DatabaseViewer</div> */}
            {database.isInline ? (
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
            )}
            {state.activeView.type == "table" && (
                <TableView databaseId={database.id} initialState={initTableState(database)} dispatch={dispatch} />
            )}
        </>
    );
};

export default DatabaseViewer;
