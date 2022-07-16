export type ErrorMsg = {
    err?: string;
    message?: string;
};

export type PropertyType =
    | "title"
    | "text"
    | "number"
    | "select"
    | "multiSelect"
    | "date"
    | "person"
    | "file"
    | "checkbox"
    | "url"
    | "email"
    | "phoneNumber"
    | "formula"
    | "relation"
    | "createdTime"
    | "createdBy"
    | "lastEditedTime"
    | "lastEditedBy"
    | "other";
