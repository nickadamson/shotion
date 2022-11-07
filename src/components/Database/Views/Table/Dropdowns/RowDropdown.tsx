import { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import { useSWRConfig } from "swr";

import RowDropdownContentWrapper from "@/components/Dropdowns/RowDropdownContentWrapper";

type RowDropdownProps = {
    setShowDropdown: Dispatch<SetStateAction<boolean>>;
    handleDeleteRow: () => void;
};

const RowDropdown: FC<RowDropdownProps> = ({ setShowDropdown, handleDeleteRow }) => {
    const [transform, setTransform] = useState("");
    const dropdownRef = useRef();

    return (
        <RowDropdownContentWrapper
            setTransform={setTransform}
            setShowDropdown={setShowDropdown}
            translateX="-90%"
            ref={dropdownRef}
        >
            <div
                className="w-60"
                ref={dropdownRef}
                style={{
                    transform,
                }}
            >
                <a className="pointer" onClick={() => handleDeleteRow()}>
                    <p>Delete row</p>
                </a>
            </div>
        </RowDropdownContentWrapper>
    );
};

export default RowDropdown;
