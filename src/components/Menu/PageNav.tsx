import { Block, Database, Page } from "@prisma/client";
import { useState } from "react";
import MenuDropdown from "./MenuDropdown";

type Props = { activePage?: Page["id"]; workspace?: Database | Page | Block };

const PageNav = (props: Props) => {
  const { activePage, workspace } = props;

  const [opacity, setOpacity] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  // const history = useHistory();

  return (
    <div
      key={workspace.id}
      onMouseEnter={() => setOpacity(100)}
      onMouseLeave={() => (showDropdown === false ? setOpacity(0) : null)}
    >
      <div>
        <p>{workspace?.title ?? "Untitled"}</p>
      </div>
      <div style={{ opacity: opacity }}>
        <MenuDropdown
          setOpacity={setOpacity}
          setShowDropdown={setShowDropdown}
        />
      </div>
    </div>
  );
};

export default PageNav;
