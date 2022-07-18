import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import EventNoteIcon from "@material-ui/icons/EventNote";
import LinkIcon from "@material-ui/icons/Link";
import ListIcon from "@material-ui/icons/List";
import SubjectIcon from "@material-ui/icons/Subject";
import { Dispatch, FC, MutableRefObject, SetStateAction, useEffect, useRef, useState, Node } from "react";

type Props = {
    setShowDropdown: Dispatch<SetStateAction<boolean>>;
    showDropdown: boolean;
    children: Node;
};

// eslint-disable-next-line react/function-component-definition
const PropertySelectDropdown = ({ setShowDropdown, showDropdown, children }: Props) => {
    const ref: MutableRefObject<Element | undefined> = useRef();
    const [transform, setTransform] = useState("");
    const [opacity, setOpacity] = useState(0);

    // useEffect(() => {
    //     const rect = ref?.current?.getBoundingClientRect();

    //     if (rect !== undefined) {
    //         // If the dropdown is dropping below the window size (meaning we can't see part of it)
    //         // reverse the direction and have it point upwards
    //         if (rect?.bottom > window?.innerHeight || window?.innerHeight - rect?.bottom < 15) {
    //             setTransform("translateY(-70%)");

    //             // Check if dropdown is past the width of the window size
    //             if (rect?.right > window?.innerWidth) {
    //                 setTransform("translateY(-70%) translateX(-100%)");
    //             }
    //         } else {
    //             // Check if dropdown is past the width of the window size
    //             if (rect?.right > window?.innerWidth) {
    //                 setTransform("translateX(-88%)");
    //             }
    //         }
    //     }
    //     setOpacity(100);
    // }, []);

    return (
        <div
            className="dropdown-content sub-menu"
            onMouseOver={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
            // onClick={() => closeMenus()}
            ref={ref}
            style={{ transform, opacity }}
        >
            {/* <a
                 className="menu-option"
                 // onClick={() => changeProperty("Text", colIndex, table, tableIndex)}
             >
                 <span className="table-dropdown-icon">
                     <SubjectIcon fontSize="inherit" />
                 </span>
                 <p>Text</p>
             </a>
             <a
                 className="menu-option"
                 // onClick={() => changeProperty("Number", colIndex, table)}
             >
                 <i className="fas fa-hashtag table-dropdown-icon"></i>
                 <p>Number</p>
             </a>
             <a
                 className="menu-option"
                 // onClick={() => changeProperty("MultiSelect", colIndex, table)}
             >
                 <span className="table-dropdown-icon">
                     <ListIcon fontSize="inherit" />
                 </span>
                 <p>Multi-select</p>
             </a>
             <a
                 className="menu-option"
                 // onClick={() => changeProperty("Date", colIndex, table)}
             >
                 <span className="table-dropdown-icon">
                     <EventNoteIcon fontSize="inherit" />
                 </span>
                 <p>Date</p>
             </a>
             <a
                 className="menu-option"
                 // onClick={() => changeProperty("Checkbox", colIndex, table)}
             >
                 <span className="table-dropdown-icon">
                     <CheckBoxOutlinedIcon fontSize="inherit" />
                 </span>
                 <p>Checkbox</p>
             </a>
             <a
                 className="menu-option"
                 // onClick={() => changeProperty("URL", colIndex, table)}
             >
                 <span className="table-dropdown-icon">
                     <LinkIcon fontSize="inherit" />
                 </span>
                 <p>URL</p>
             </a> */}
        </div>
    );
};

export default PropertySelectDropdown;
