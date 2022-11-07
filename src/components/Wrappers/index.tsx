import { Database, Page, Block as BlockType } from "@prisma/client";
import { ChangeEvent, FC, useEffect, useState } from "react";

import useBlock from "@/hooks/useBlock";
import useDatabase from "@/hooks/useDatabase";
import usePage from "@/hooks/usePage";
import { ParsedBlock } from "src/pages/api/blocks/[blockId]";
import { ParsedDatabase } from "src/pages/api/databases/[databaseId]";
import { ParsedPage } from "src/pages/api/pages/[pageId]";
import { formatRTO } from "src/utils";

import { BlockTypeRenderer } from "./BlockTypeRenderer";
import { Renderer } from "./WorkspaceRenderer";

export function HookWrapper({ id, objectType, level, ...props }: { id: string; objectType: string; level: number }) {
    switch (objectType) {
        case "database":
            return <UseDatabaseWrapper id={id} level={level} {...props} />;
        case "page":
            return <UsePageWrapper id={id} level={level} {...props} />;
        case "block":
            return <UseBlockWrapper id={id} level={level} {...props} />;
    }
}

const BlockRenderer: FC<{
    object: ParsedDatabase | ParsedPage | ParsedBlock;
    id: string;
    level: number;
    updateMethod: (updated: any) => Promise<boolean>;
}> = ({ object, id, level, updateMethod, ...props }) => {
    const [temporaryValue, setTemporaryValue] = useState<any>();
    useEffect(() => {
        if (!temporaryValue && object) {
            if (object?.type === "text" || object?.type?.includes("heading")) {
                setTemporaryValue((object as ParsedBlock)?.details?.richText?.[0]?.plainText);
            } else if (
                (object?.object === "page" || object?.object === "database") &&
                (object as ParsedDatabase | ParsedPage)?.title
            ) {
                setTemporaryValue((object as ParsedDatabase | ParsedPage)?.title?.plainText);
            }
        }
    }, [temporaryValue, object]);

    const updateTitle = async () => {
        // TODO parse rich text
        const newTitle = formatRTO(temporaryValue);

        // temporaryValue;
        await cleanupAndUpdateObject({
            oldObject: object,
            key: "title",
            newValue: newTitle,
            updateMethod,
        });
    };

    const updateText = async () => {
        // TODO parse rich text
        const newDetails = formatRTO(temporaryValue);

        await cleanupAndUpdateObject({
            oldObject: object,
            key: "details",
            newValue: newDetails,
            updateMethod,
        });
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTemporaryValue(event.target.value);
    };

    const methods = {
        temporaryValue,
        setTemporaryValue,
        updateTitle,
        updateText,
        handleChange,
    };

    return (
        <>
            {object && (
                <BlockTypeRenderer
                    key={id}
                    updateMethod={updateMethod}
                    block={object}
                    level={level}
                    {...props}
                    {...methods}
                >
                    {(object as ParsedPage | ParsedBlock)?.children?.map((child) => (
                        <Renderer key={child.id} id={child.id} object={child.object} level={level + 1} {...props} />
                    ))}
                </BlockTypeRenderer>
            )}
        </>
    );
};

const UseDatabaseWrapper: FC<{
    id: string;
    level: number;
}> = ({ id, level, ...props }) => {
    const { database: object, isLoading, isError, updateDatabase: updateMethod } = useDatabase({ databaseId: id });

    return (
        <>
            {!isError && !isLoading && (
                <BlockRenderer object={object} id={id} level={level} updateMethod={updateMethod} {...props} />
            )}
        </>
    );
};

const UsePageWrapper: FC<{
    id: string;
    level: number;
}> = ({ id, level, ...props }) => {
    const { page: object, isLoading, isError, updatePage: updateMethod } = usePage({ pageId: id });

    return (
        <>
            {!isError && !isLoading && (
                <BlockRenderer object={object} id={id} level={level} updateMethod={updateMethod} {...props} />
            )}
        </>
    );
};

const UseBlockWrapper: FC<{
    id: string;
    level: number;
}> = ({ id, level, ...props }) => {
    const { block: object, isLoading, isError, updateBlock: updateMethod } = useBlock({ blockId: id });

    return (
        <>
            {!isError && !isLoading && (
                <BlockRenderer object={object} id={id} level={level} updateMethod={updateMethod} {...props} />
            )}
        </>
    );
};

const cleanupAndUpdateObject = async ({ oldObject, key, newValue, updateMethod }) => {
    const updated = oldObject;

    if (oldObject?.[`${key}`] === newValue) {
        return;
    }

    updated[`${key}`] = newValue;
    delete updated?.parentId;
    delete updated?.parentDb;
    delete updated?.parentPage;
    delete updated?.parentBlock;
    delete updated?.children;
    delete updated?.childrenDbs;
    delete updated?.childrenPages;
    delete updated?.childrenBlocks;
    delete updated?.defaultView;
    delete updated?.otherViews;
    delete updated?.properties;

    await updateMethod(updated);
};
