import { FC, ReactNode } from "react";

type SortProps = {
    children?: ReactNode;
};

const SortOptions: FC<SortProps> = (props) => {
    const { children } = props;

    return (
        <>
            <div>Sort</div>
            {children}
        </>
    );
};

export default SortOptions;
