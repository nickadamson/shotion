import { useState, Dispatch, SetStateAction, FC } from "react";
import PageNav from "./PageNav";
// import QuickFind from "./QuickFind";
import MenuHeader from "./MenuHeader";
import { Block, BLOCKTYPE, Database, Page } from "@prisma/client";

import { DatabaseSelect, PageSelect, WorkspaceResponseData } from "src/pages/api/workspaces";

type MenuProps = {
    workspaces: WorkspaceResponseData;
    spacesLoading: boolean;
    spacesError: boolean;
    rootPage: DatabaseSelect | PageSelect;
    setRootPage: Dispatch<SetStateAction<DatabaseSelect | PageSelect>>;
    createNewWorkspace: (newWorkspace: Partial<Database | Page | Block>) => Promise<Database | Page | Block | Error>;
};

const Menu: FC<MenuProps> = (props) => {
    const { workspaces, spacesLoading, spacesError, createNewWorkspace } = props;

    const [showQuickFind, setShowQuickFind] = useState(false);

    const defaultWorkspace = {
        object: "page",
        isWorkspace: true,
        type: "page" as BLOCKTYPE,
    };

    return (
        <div className="menuBody">
            {/* Menu Header */}
            <MenuHeader />

            {/* Quick Find */}
            <div
            // className="search"
            // onClick={}
            >
                {/* <i className="fas fa-search" /> */}
                <p>Quick Find</p>
            </div>

            {showQuickFind && <QuickFind pages={workspaces} />}

            {/* User pages */}
            <div className="pages">
                {workspaces?.map((space) => {
                    return (
                        <div key={space.id}>
                            <PageNav workspace={space} />
                        </div>
                    );
                })}

                {/* Add a page */}
                <div className="add-page" onClick={() => createNewWorkspace(defaultWorkspace)}>
                    <i className="fas fa-plus"></i>
                    <p>Add a page</p>
                </div>
            </div>
        </div>
    );
};

export default Menu;
