import { User } from "@prisma/client";
import { Dispatch, FC, SetStateAction, useState } from "react";

const MenuHeader: FC<{
    currentUser: User;
    showMenu: boolean;
    setShowMenu: Dispatch<SetStateAction<boolean>>;
}> = ({ currentUser, showMenu, setShowMenu }) => {
    const [state, setstate] = useState();

    return (
        <div className="mb-3 border-b">
            <p>Welcome</p>
        </div>
    );
};

export default MenuHeader;
