import * as React from "react";
import { PropertyType } from "notion-types";

import TitleIcon from "./type-title";
import TextIcon from "./type-text";
import NumberIcon from "./type-number";
import SelectIcon from "./type-select";
import MultiSelectIcon from "./type-multi-select";
import DateIcon from "./type-date";
import PersonIcon from "./type-person";
import FileIcon from "./type-file";
import CheckboxIcon from "./type-checkbox";
import UrlIcon from "./type-url";
import EmailIcon from "./type-email";
import PhoneNumberIcon from "./type-phone-number";
import FormulaIcon from "./type-formula";
import RelationIcon from "./type-relation";
import Person2Icon from "./type-person-2";
import TimestampIcon from "./type-timestamp";

interface PropertyIconProps {
    className?: string;
    type: PropertyType;
}

const iconMap = {
    title: TitleIcon,
    text: TextIcon,
    number: NumberIcon,
    select: SelectIcon,
    multiSelect: MultiSelectIcon,
    date: DateIcon,
    person: PersonIcon,
    file: FileIcon,
    checkbox: CheckboxIcon,
    url: UrlIcon,
    email: EmailIcon,
    phoneNumber: PhoneNumberIcon,
    formula: FormulaIcon,
    relation: RelationIcon,
    createdTime: TimestampIcon,
    lastEditedTime: TimestampIcon,
    createdBy: Person2Icon,
    lastEditedBy: Person2Icon,
};

export const PropertyIcon: FC<PropertyIconProps> = ({ type, ...rest }) => {
    const icon = iconMap[type] as any;
    if (!icon) return null;

    return icon(rest);
};
