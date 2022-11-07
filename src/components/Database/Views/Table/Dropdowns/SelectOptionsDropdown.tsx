import { FC, Fragment } from "react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

interface SelectOptionsDropdownProps {
    options: {
        id: string;
        name: string;
    }[];

    onSelect: () => void;
}

const SelectOptionsDropdown: FC<SelectOptionsDropdownProps> = ({ options, onSelect }) => (
    // <Menu as="div" className="inline-block relative z-20 text-left">
    <div className="inline-block relative z-20 text-left">
        <div>
            <button className="inline-flex justify-center px-4 py-2 w-full text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                Start typing to create a new option, or select an existing one.
                {/* <ChevronDownIcon className="-mr-1 ml-2 w-5 h-5" aria-hidden="true" /> */}
                DropIcon
            </button>
        </div>

        {/* <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-md divide-y divide-gray-100 ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right focus:outline-none">
                {options.map((option) => {
                    console.log({ option });
                    return (
                        <div key={option.id} className="py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active ? "text-gray-900 bg-gray-100" : "text-gray-700",
                                            "block px-4 py-2 text-sm"
                                        )}
                                        onClick={onSelect}
                                    >
                                        {option.name}
                                    </a>
                                )}
                            </Menu.Item>
                        </div>
                    );
                })}
            </Menu.Items>
        </Transition> */}
    </div>
);

export default SelectOptionsDropdown;
