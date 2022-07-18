import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";

import Menu from "@/components/Menu/index";
import { WorkspaceRenderer } from "@/components/Wrappers/WorkspaceRenderer";
import useWorkspaces, { Workspace } from "@/hooks/useWorkspaces";

const Home: NextPage = () => {
    const { workspaces, spacesLoading, spacesError } = useWorkspaces();
    const workspacesMemoed = useMemo(() => workspaces, [workspaces]);

    const [rootPage, setRootPage] = useState<Workspace>();

    useEffect(() => {
        if (!rootPage && workspacesMemoed !== undefined) {
            setRootPage(workspacesMemoed[0]);
        }
    }, [rootPage, workspacesMemoed]);

    console.log({ workspaces, rootPage });

    return (
        <div className="">
            {spacesLoading && <p>loading</p>}
            {!spacesLoading && !spacesError && rootPage && (
                <div className="">
                    <Menu
                        workspaces={workspacesMemoed ?? []}
                        spacesLoading={spacesLoading}
                        spacesError={spacesError}
                        rootPage={rootPage}
                        setRootPage={setRootPage}
                    />
                    <div
                        className="ml-72 w-auto h-screen"
                        // className="body"
                    >
                        <div className="w-full h-full">
                            <WorkspaceRenderer
                                workspaceObject={rootPage.object as "database" | "page"}
                                workspaceId={rootPage.id}
                                fullPage
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
