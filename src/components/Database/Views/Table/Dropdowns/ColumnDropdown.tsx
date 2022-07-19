import { Dispatch, SetStateAction, useRef, useState } from "react";

import PropertySelectDropdown from "./PropertySelectDropdown";

type Props = {
    columnId: string;
    databaseId: string;
    deleteColumn: () => void;
    setShowDropdown: Dispatch<SetStateAction<boolean>>;
};

function ColumnDropdown(props: Props) {
    const { columnId, databaseId, deleteColumn, setShowDropdown } = props;
    // const ref = useRef();
    const [showPropertySelect, setShowPropertySelect] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    return (
        <div className="dropdown">
            <div
            // className="dropdown-content left-aligned table_dropdown"
            // ref={ref}
            // style={{ transform: transform, opacity: opacity }}
            >
                {/* Property Type */}
                <div
                // className="column-dropdown-header"
                >
                    <div
                    // className="property-type-title"
                    >
                        PROPERTY TYPE
                    </div>

                    <div
                        // className="dropdown-option"
                        style={{ display: "block" }}
                        // onMouseOver={() => setShowPropertySelect(true)}
                        // onMouseLeave={() => setShowPropertySelect(false)}
                    >
                        <div
                            // className="property-type-container"
                            onClick={() => setShowPropertySelect(true)}
                        >
                            {/* Render the correct icon based on the property type of the column */}
                            <span
                            // className="table-dropdown-icon"
                            />

                            <p className="property-type">
                                {/* {props.property_type === "Multi_select"
                  ? "Multi-select"
                  : props.property_type} */}
                            </p>
                            <i
                                className="h-full fas fa-caret-right property-show-more"
                                onMouseOver={() => setShowPropertySelect(true)}
                            >
                                {`>`}
                            </i>
                        </div>

                        {/* Property Types Dropdown */}
                        {showPropertySelect && (
                            <PropertySelectDropdown
                                setShowDropdown={setShowPropertySelect}
                                // ref={propertySelectRef}
                                // col_index={props.index}
                                // table={props.table}
                                // table_index={props.table_index}
                                // close_menus={props.close_menus}
                            />
                        )}
                    </div>
                </div>

                <hr />

                {/* Insert column */}
                {/* <a
          className="menu-option"
          onClick={() => {
            // props.insertColumn(props.index, "left");
            // props.close_dropdown();
          }}
        >
          <span className="table-dropdown-icon">
            <ArrowBackIcon fontSize="inherit" />
          </span>
          <p>Insert column left</p>
        </a>

        <a
          className="menu-option"
          onClick={() => {
            // props.insertColumn(props.index, "right");
            // props.close_dropdown();
          }}
        >
          <span className="table-dropdown-icon">
            <ArrowForwardIcon fontSize="inherit" />
          </span>
          <p>Insert column right</p>
        </a> */}

                {/* Move column */}
                {/* {props.index !== 0 ? (
          <a
            className="menu-option"
            onClick={() => {
              props.moveColumn(props.index, "left");
              props.close_dropdown();
            }}
          >
            <span className="table-dropdown-icon">
              <ArrowBackIcon fontSize="inherit" />
            </span>
            <p>Move column left</p>
          </a>
        ) : null} */}

                {/* {props.index !== props.last_index ? (
          <a
            className="menu-option"
            onClick={() => {
              props.moveColumn(props.index, "right");
              props.close_dropdown();
            }}
          >
            <span className="table-dropdown-icon">
              <ArrowForwardIcon fontSize="inherit" />
            </span>
            <p>Move column right</p>
          </a>
        ) : null} */}

                {/* Delete column */}
                <a
                    // className="menu-option"
                    onClick={() => setShowDeleteModal(true)}
                >
                    <i
                    // className="far fa-trash-alt"
                    />
                    <p>Delete column</p>
                </a>
            </div>

            {/* body ody ody */}

            {/* Delete column confirmation modal */}
            {showDeleteModal && (
                <div
                // className="semi-transparent-bg"
                >
                    <div
                    // className="modal"
                    >
                        <p style={{ fontWeight: "normal" }}>Are you sure you want to delete this column?</p>

                        <button
                            // className="delete-btn"
                            onClick={() => deleteColumn()}
                        >
                            Delete
                        </button>

                        <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ColumnDropdown;
