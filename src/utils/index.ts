import { RTO } from "./types";

export const formatRTO = (rto?: Partial<RTO>): RTO => ({
    type: "text",
    text: { content: rto?.text?.content ?? rto?.plainText ?? "", link: rto?.text?.link ?? undefined },
    annotations: {
        bold: rto?.annotations?.bold ?? false,
        italic: rto?.annotations?.italic ?? false,
        strikethrough: rto?.annotations?.strikethrough ?? false,
        underline: rto?.annotations?.underline ?? false,
        code: rto?.annotations?.code ?? false,
        color: rto?.annotations?.color ?? "default",
    },
    plainText: rto?.plainText ?? rto?.text?.content ?? "",
    href: rto?.href ?? null,
});

export const getDefaultDetailsForPropertyType = (type): Record<string, any> | void => {
    switch (type) {
        // fallthrough
        case "select":
        case "multiSelect":
            return [];

        case "relation":
            return { object: null, id: null, relation: null };
        case "other":
            return { info: null };

        // fallthrough
        case "file":
        case "checkbox":
        case "url":
        case "email":
        case "phoneNumber":
        case "formula":
        case "createdTime":
        case "createdBy":
        case "lastEditedTime":
        case "lastEditedBy":
        case "text":
        case "number":
        case "date":
        case "person":
            return null;
        default:
            console.log(type, " not yet implemented");
            return null;
    }
};

export const getDefaultValueForPropertyType = (type) => {
    switch (type) {
        case "text":
            return "";
        case "multiSelect":
            return [];
        case "file":
            return { mimeType: null, path: null };
        case "checkbox":
            return { checked: false };
        case "relation":
            return { object: null, id: null };
        case "other":
            return { info: null };

        // fallthrough
        case "number":
        case "select":
        case "date":
        case "person":
        case "url":
        case "email":
        case "phoneNumber":
        case "formula":
        case "createdTime":
        case "createdBy":
        case "lastEditedTime":
        case "lastEditedBy":
            return null;

        default:
            console.log(type, "not yet implemented");
    }
};
