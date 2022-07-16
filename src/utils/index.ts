import { RTO } from "./types";

export const formatRTO = (rto?: RTO): RTO => {
    return {
        type: "text",
        text: { content: rto?.text?.content ?? "", link: rto?.text?.link ?? null },
        annotations: {
            bold: rto?.annotations?.bold ?? false,
            italic: rto?.annotations?.italic ?? false,
            strikethrough: rto?.annotations?.strikethrough ?? false,
            underline: rto?.annotations?.underline ?? false,
            code: rto?.annotations?.code ?? false,
            color: rto?.annotations?.color ?? "default",
        },
        plainText: rto?.plainText ?? "",
        href: rto?.href ?? null,
    };
};

export const getDefaultDetailsForPropertyType = (type): Record<string, any> | void => {
    switch (type) {
        // fallthrough
        case "select":
        case "multiSelect":
            return {
                options: [
                    // { name: "Option 1", color: "default" }
                ],
            };

        case "file":
        case "relation":
            return { object: null, id: null };
        case "other":
            return { info: null };

        // fallthrough
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
            return;
        default:
            console.log(type, " not yet implemented");
            return;
    }
};

export const getDefaultValueForPropertyType = (type) => {
    switch (type) {
        case "text":
            return { plainText: null };
        case "number":
            return; // 0?
        case "select":
            return { selectedOption: null };
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
