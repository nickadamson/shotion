import { FC, ReactNode } from "react";

type FilterProps = {
    children?: ReactNode;
};

const FilterOptions: FC<FilterProps> = (props) => {
    const { children } = props;

    return (
        <>
            <div>Filter</div>
            {children}
        </>
    );
};

export default FilterOptions;
