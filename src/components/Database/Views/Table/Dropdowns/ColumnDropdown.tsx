import { Dispatch, SetStateAction, useRef, useState } from "react";
import PropertySelectDropdown from "./PropertySelectDropdown";

type Props = {
    columnId: string;
    databaseId: string;
    deleteColumn: () => void;
    setShowDropdown: Dispatch<SetStateAction<boolean>>;
};

const ColumnDropdown = (props: Props) => {
    const { columnId, databaseId, deleteColumn, setShowDropdown } = props;
    // const ref = useRef();
    const [showPropertySelect, setShowPropertySelect] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    return <></>;
};

export default ColumnDropdown;
