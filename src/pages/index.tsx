import type { NextPage } from "next";
import Menu from "@/components/Menu/index";
import useWorkspaces from "@/hooks/useWorkspaces";
import { useEffect, useMemo, useState } from "react";
import { DatabaseSelect, PageSelect } from "./api/workspaces";
import { WorkspaceRenderer } from "@/components/Wrappers/WorkspaceRenderer";

const Home: NextPage = () => {
    const { workspaces, createNewWorkspace, spacesLoading, spacesError } = useWorkspaces();
    const workspacesMemoed = useMemo(() => workspaces, [workspaces]);

    const [rootPage, setRootPage] = useState<DatabaseSelect | PageSelect>();

    useEffect(() => {
        if (!rootPage && !spacesLoading && !spacesError) {
            setRootPage(workspaces[0]);
        }
    }, [workspacesMemoed, rootPage, spacesError, spacesLoading, workspaces]);

    return (
        <>
            <div>
                <div>
                    <div className="menu">
                        <Menu
                            workspaces={workspaces}
                            createNewWorkspace={createNewWorkspace}
                            spacesLoading={spacesLoading}
                            spacesError={spacesError}
                            rootPage={rootPage}
                            setRootPage={setRootPage}
                        />
                    </div>
                    <div className="ml-60 w-auto h-screen">
                        {!rootPage ? (
                            <p>loading</p>
                        ) : (
                            <div className="w-full h-full">
                                <WorkspaceRenderer
                                    workspaceObject={rootPage.object as "database" | "page"}
                                    workspaceId={rootPage.id}
                                    fullPage={true}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
