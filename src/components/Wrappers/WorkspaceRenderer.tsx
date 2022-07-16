import { FC } from "react";
import { WorkspaceContextProvider } from "./Context";
import { HookWrapper } from "./index";

export const WorkspaceRenderer: FC<{
    workspaceId?: string;
    workspaceObject?: "database" | "page";
    fullPage?: boolean;
    darkMode?: boolean;
}> = ({ workspaceId, workspaceObject, fullPage, darkMode, ...rest }) => {
    return (
        <WorkspaceContextProvider
            fullPage={fullPage}
            workspaceId={workspaceId}
            workspaceObject={workspaceObject}
            darkMode={darkMode}
        >
            <Renderer id={workspaceId} object={workspaceObject} {...rest} />
        </WorkspaceContextProvider>
    );
};

export const Renderer: FC<{
    id: string;
    object: string;
    level?: number;
}> = ({ level = 0, id, object }) => {
    return (
        <>
            <HookWrapper id={id} objectType={object} level={level} />
        </>
    );
};
