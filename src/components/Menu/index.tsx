/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Dispatch, FC, SetStateAction, useState } from "react";

import { Workspace } from "@/hooks/useWorkspaces";
import { formatRTO } from "src/utils";
import { postNewPage } from "src/utils/api";

import MenuHeader from "./MenuHeader";
import PageNav from "./PageNav";
// import QuickFind from "./QuickFind";

const handleClick = async () => {
    await postNewPage({
        object: "page",
        title: formatRTO({ plainText: "New Workspace" }),
        isWorkspace: true,
    });
    // mutate useWorkspaces
};

const Menu: FC<{
    workspaces: Workspace[];
    spacesLoading: boolean;
    spacesError: unknown;
    rootPage: Workspace;
    setRootPage: Dispatch<SetStateAction<Workspace | undefined>>;
}> = ({ workspaces, spacesLoading, spacesError, rootPage, setRootPage }): JSX.Element => {
    const [showQuickFind, setShowQuickFind] = useState(false);
    console.log(workspaces);

    return (
        <div className="px-4 py-2 w-60 h-full min-w-fit max-w-60">
            {!spacesLoading && !spacesError && rootPage !== undefined && (
                <>
                    <MenuHeader />
                    {
                        showQuickFind && <div />
                        // <QuickFind pages={workspaces} />
                    }

                    <div className="flex flex-col justify-between">
                        <div className="pages">
                            {workspaces?.map((workspace) => {
                                const isSelectedWorkspace = workspace.id === rootPage.id;
                                return (
                                    <div key={workspace.id}>
                                        <PageNav
                                            workspace={workspace}
                                            isSelected={isSelectedWorkspace}
                                            setRootPage={setRootPage}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="cursor-pointer" onClick={() => handleClick()}>
                            <p>Add a page</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Menu;
