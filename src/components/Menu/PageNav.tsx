/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Dispatch, FC, SetStateAction, useState } from "react";

import { Workspace } from "@/hooks/useWorkspaces";
// import MenuDropdown from "./MenuDropdown";

const PageNav: FC<{
    isSelected: boolean;
    workspace: Workspace;
    setRootPage: Dispatch<SetStateAction<Workspace>>;
}> = ({ isSelected, workspace, setRootPage }) => {
    // const [opacity, setOpacity] = useState(100);
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div
            className={"cursor-pointer " && isSelected ? "border-green-200" : "border-none"}
            key={workspace.id}
            // onMouseEnter={() => setOpacity(100)}
            // onMouseLeave={() => setOpacity(0)}
            onClick={() => {
                setRootPage(workspace);
            }}
        >
            <div className="">
                <p className="">{workspace?.title?.plainText ?? "Untitled"}</p>
            </div>
            {/* <div style={{ opacity }}> */}
            {/* <MenuDropdown
                    // pageId={page.id}
                    // pageName={props.name}
                    // depth={props.depth}
                    // handleChange={props.handleChange}
                    // deletePageMenu={props.deletePageMenu}
                    // addPage={props.addPage}
                    // parent={props.parent}
                    setOpacity={setOpacity}
                    setShowDropdown={setShowDropdown}
                /> */}
            {/* </div> */}
        </div>
    );
};

export default PageNav;
