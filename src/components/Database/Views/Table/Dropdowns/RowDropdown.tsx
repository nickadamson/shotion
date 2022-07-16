import RowDropdownContentWrapper from "@/components/Dropdowns/RowDropdownContentWrapper";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useSWRConfig } from "swr";

type Props = {
    // showDropdown: boolean;
    rowId: string;
    databaseId: string;
    setShowDropdown: Dispatch<SetStateAction<boolean>>;
    reset: () => void;
};

const RowDropdown = (props: Props) => {
    const { rowId, databaseId, setShowDropdown, reset } = props;

    const [transform, setTransform] = useState("");
    const dropdownRef = useRef();

    const handleDeleteRow = async () => {
        // const success = await deleteRow()

        // if (success) {
        // }

        setShowDropdown(false);
    };

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
                    transform: transform,
                }}
            >
                <a className="pointer" onClick={() => handleDeleteRow()}>
                    <i className=""></i>
                    <p>Delete row</p>
                </a>
            </div>
        </RowDropdownContentWrapper>
    );
};

export default RowDropdown;
