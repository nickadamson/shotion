import { BlockTypeRenderer } from "./BlockTypeRenderer";
import { Renderer } from "./WorkspaceRenderer";
import useBlock from "@/hooks/useBlock";
import useDatabase from "@/hooks/useDatabase";
import usePage from "@/hooks/usePage";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Database, Page, Block as BlockType } from "@prisma/client";
// import { formatRTO } from "@/db/prisma/propertyTypesBolierplate";
import { FormattedPageWRelations } from "src/pages/api/pages/[pageId]";
import { DatabaseWithRelations } from "src/pages/api/databases/[databaseId]";
import { FormattedBlockWRelations } from "src/pages/api/blocks/[blockId]";

export const HookWrapper = ({ id, objectType, level, ...props }: { id: string; objectType: string; level: number }) => {
    switch (objectType) {
        case "database":
            return <UseDatabaseWrapper id={id} level={level} {...props} />;
        case "page":
            return <UsePageWrapper id={id} level={level} {...props} />;
        case "block":
            return <UseBlockWrapper id={id} level={level} {...props} />;
    }
};

const BlockRenderer: FC<{
    object: DatabaseWithRelations | FormattedPageWRelations | FormattedBlockWRelations;
    id: string;
    level: number;
    updateMethod: (updated: any) => Promise<Boolean>;
}> = ({ object, id, level, updateMethod, ...props }) => {
    const [temporaryValue, setTemporaryValue] = useState<any>();
    useEffect(() => {
        if (!temporaryValue && object) {
            if (object?.type === "text" || object?.type?.includes("heading")) {
                setTemporaryValue((object as FormattedBlockWRelations)?.details?.richText?.[0]?.plainText);
            } else if (
                (object?.object == "page" || object?.object == "database") &&
                (object as DatabaseWithRelations | FormattedPageWRelations)?.title
            ) {
                setTemporaryValue((object as DatabaseWithRelations | FormattedPageWRelations)?.title?.plainText);
            }
        }
    }, [temporaryValue, object]);

    const updateTitle = async () => {
        //TODO parse rich text
        // let newTitle = formatRTO(temporaryValue);

        temporaryValue;
        await cleanupAndUpdateObject({
            oldObject: object,
            key: "title",
            newValue: newTitle,
            updateMethod: updateMethod,
        });
    };

    const updateText = async () => {
        //TODO parse rich text
        let newDetails = formatRTO(temporaryValue);

        await cleanupAndUpdateObject({
            oldObject: object,
            key: "details",
            newValue: newDetails,
            updateMethod: updateMethod,
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
                    {(object as FormattedPageWRelations | FormattedBlockWRelations)?.children?.map((child) => (
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
    let updated = oldObject;

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
