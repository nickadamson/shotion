export type RTO = {
    type: "text";
    text: { content: string | undefined; link?: string | undefined };
    annotations: {
        bold: boolean;
        italic: boolean;
        strikethrough: boolean;
        underline: boolean;
        code: boolean;
        color: string | undefined;
    };
    plainText: string | undefined;
    href?: string | undefined;
};
