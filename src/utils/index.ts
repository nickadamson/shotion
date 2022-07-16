export const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
