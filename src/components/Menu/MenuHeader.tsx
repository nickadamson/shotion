import { User } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

type Props = {
    currentUser?: User;
    showMenu?: boolean;
    setShowMenu?: Dispatch<SetStateAction<boolean>>;
};
const MenuHeader = (props: Props) => {
    const { currentUser, showMenu, setShowMenu } = props;

    return <div />;
};

export default MenuHeader;
