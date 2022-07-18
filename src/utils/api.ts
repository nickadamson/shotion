import { Block, Database, Format, Page, Prisma, Property, PROPERTYTYPE, View } from "@prisma/client";
import { ColumnOrderState, VisibilityState } from "@tanstack/react-table";
import cuid from "cuid";

import { ParsedFormat } from "src/pages/api/formats/[formatId]";
import { ParsedView } from "src/pages/api/views/[viewId]";

import { getDefaultDetailsForPropertyType, getDefaultValueForPropertyType } from ".";

interface Res extends Response {
    ok: boolean;
}

// swr
export const fetcher = (url: string) => fetch(url).then((res) => res.json());

// helper
export const putter = (url: string, method: "POST" | "PUT" | "DELETE", body?: Record<any, any>) =>
    fetch(url, {
        method,
        body: JSON.stringify({ ...body }),
    }).then((res) => res.json() as Promise<Res>);

/** DB */
export const postNewDatabase = async (database: Partial<Database>) => {
    const res = await putter(`/api/databases`, "POST", database);
    // console.log(`postNewDatabase Res:\n`,{ res });
    return res.ok;
};

export const updateDatabase = async (database: Partial<Database>) => {
    const res = await putter(`/api/databases/${database.id}`, "PUT", database);
    // console.log(`updateDatabase Res:\n`,{ res });
    return res.ok;
};

export const deleteDatabase = async (database: Partial<Database>) => {
    const res = await putter(`/api/databases/${database.id}`, "DELETE");
    // console.log(`deleteDatabase Res:\n`,{ res });
    return res.ok;
};

/** Page */
export const postNewPage = async (page: Partial<Page>) => {
    const res = await putter(`/api/pages`, "POST", page);
    // console.log(`postNewPage Res:\n`,{ res });
    return res.ok;
};

export const updatePage = async (page: Partial<Page>) => {
    const res = await putter(`/api/pages/${page.id}`, "PUT", page);
    // console.log(`updatePage Res:\n`,{ res });
    return res.ok;
};

export const deletePage = async (page: Partial<Page>) => {
    const res = await putter(`/api/pages/${page.id}`, "DELETE");
    // console.log(`deletePage Res:\n`,{ res });
    return res.ok;
};

/** Block */
export const postNewBlock = async (block: Partial<Block>) => {
    const res = await putter(`/api/blocks`, "POST", block);
    // console.log(`postNewBlock Res:\n`,{ res });
    return res.ok;
};

export const updateBlock = async (block: Partial<Block>) => {
    const res = await putter(`/api/blocks/${block.id}`, "PUT", block);
    // console.log(`updateBlock Res:\n`,{ res });
    return res.ok;
};

export const deleteBlock = async (block: Partial<Block>) => {
    const res = await putter(`/api/blocks/${block.id}`, "DELETE");
    // console.log(`deleteBlock Res:\n`,{ res });
    return res.ok;
};

/** Property */
export const postNewProperty = async (property: Partial<Property>) => {
    const res = await putter(`/api/properties`, "POST", property);
    // console.log(`postNewProperty Res:\n`,{ res });
    return res.ok;
};

export const updateProperty = async (property: Partial<Property>) => {
    const res = await putter(`/api/properties/${property.id}`, "PUT", property);
    // console.log(`updateProperty Res:\n`,{ res });
    return res.ok;
};

export const deleteProperty = async (property: Partial<Property>) => {
    const res = await putter(`/api/properties/${property.id}`, "DELETE");
    // console.log(`deleteProperty Res:\n`,{ res });
    return res.ok;
};

/** View */
export const postNewView = async (view: Partial<View>) => {
    const res = await putter(`/api/views`, "POST", view);
    // console.log(`postNewView Res:\n`,{ res });
    return res.ok;
};

export const updateView = async (view: Partial<View>) => {
    const res = await putter(`/api/views/${view.id}`, "PUT", view);
    // console.log(`updateView Res:\n`,{ res });
    return res.ok;
};

export const deleteView = async (view: Partial<View>) => {
    const res = await putter(`/api/views/${view.id}`, "DELETE");
    // console.log(`deleteView Res:\n`,{ res });
    return res.ok;
};

/** Format */
export const postNewFormat = async (format: Partial<Format>) => {
    const res = await putter(`/api/formats`, "POST", format);
    // console.log(`postNewFormat Res:\n`,{ res });
    return res.ok;
};

export const updateFormat = async (format: Partial<Format>) => {
    const res = await putter(`/api/formats/${format.id}`, "PUT", format);
    // console.log(`updateFormat Res:\n`,{ res });
    return res.ok;
};

export const deleteFormat = async (format: Partial<Format>) => {
    const res = await putter(`/api/formats/${format.id}`, "DELETE");
    // console.log(`deleteFormat Res:\n`,{ res });
    return res.ok;
};

// handlers
export const handleNewProperty = async ({
    databaseId,
    views,
    childrenPages,
}: {
    databaseId: string;
    views: ParsedView[];
    childrenPages?: Pick<Page, "id" | "propertyValues">[];
}) => {
    let createdProperty;
    let updatedFormats = false; // for logging errors

    // 1 create property
    try {
        const property = {
            id: cuid.slug(),
            parentDbId: databaseId,
            type: "text" as PROPERTYTYPE,
            name: "New Property",
        };
        createdProperty = await postNewProperty(property);

        // 2 push property into all formats associated with the db
        const formatPromises = views.map(async (view) => {
            const width = 32;
            const { details } = view.format;

            details.columnOrder.push(property.id);
            details.columnVisibility[`${view.format.id}`] = true;
            details.tableSizing = {
                tableWidth: Number(details?.tableSizing?.tableWidth ?? 0) + width,
                columnWidths: {
                    ...details.tableSizing.columnWidths,
                    [`${property.id}`]: width,
                },
            };

            return updateFormat({
                id: view.format.id,
                details: { ...details } as unknown as Prisma.JsonValue,
            });
        });

        await Promise.all(formatPromises);
        updatedFormats = true;
        // success
        if (!childrenPages) return true;

        // 3 if children, push property into all page.propertyValues associated with the db
        const pagePromises = childrenPages.map(async (page) => {
            const { propertyValues } = page;

            propertyValues[`${property.id}`] = getDefaultValueForPropertyType(property.type);

            return updatePage({
                id: page.id,
                propertyValues,
            });
        });

        // success
        await Promise.all(pagePromises);
        return true;
    } catch (error) {
        console.log(
            `An error occurred while trying to create a new property for Database:${databaseId}.
        Created Property? - ${createdProperty}\nUpdated Formats? - ${updatedFormats}
        Pages to update? - ${!childrenPages ? "none" : `${childrenPages?.length}`}\nERROR:\n`,
            error
        );
        return false;
    }
};

export const handleChangePropertyType = async ({
    property,
    newType,
    childrenPages,
}: {
    property: Partial<Property>;
    newType: PROPERTYTYPE;
    childrenPages?: Pick<Page, "id" | "propertyValues">[];
}) => {
    let updatedPropSucess = false; // for logging errors
    try {
        // 1 update property
        const updatedProperty = {
            type: newType,
        };

        const defaultDetails = getDefaultDetailsForPropertyType(newType);
        if (defaultDetails) updatedProperty.details = defaultDetails;

        await fetch(`/api/properties/${property.id}`, {
            method: "PUT",
            body: JSON.stringify({ ...updatedProperty }),
        });
        updatedPropSucess = true; // for logging errors

        // success
        if (!childrenPages) return true;

        // 2 push property into all page.propertyValues associated with the db
        const pagePromises = childrenPages.map(async (page) => {
            const { id: pageId, propertyValues } = page;

            const value = getDefaultValueForPropertyType(newType);

            propertyValues[`${property.id}`] = value;

            return fetch(`/api/pages/${pageId}`, {
                method: "PUT",
                body: JSON.stringify({ propertyValues }),
            });
        });

        // success
        await Promise.all(pagePromises);
        return true;
    } catch (error) {
        console.log(
            `An error occurred while trying to change Property:${property.id}'s type.
      Updated Property? - ${updatedPropSucess}
      Pages to update? - ${!childrenPages ? "none" : `${childrenPages?.length}`}\nERROR:\n`,
            error
        );
        return false;
    }
};

export const handleChangePropertyDetails = async ({
    property,
    details,
    views,
}: {
    property: Partial<Property>;
    details: Record<string, any>;
    views?: ParsedView[];
}) => {
    let updatedPropSuccess = false; // for logging errors

    // 1 update property
    try {
        const updatedProperty = {
            details,
        };

        updatedPropSuccess = await updateProperty(property); // for logging errors

        // 2 push property into all formats associated with the db
        const formatPromises = views.map(async (view) => {
            const formatId = view.format.id;
            const { details } = view.format;
            // todo
            // details.sorts
            // details.filters
            // return await updateFormat({id: view.format.id, details: {...details}})
        });

        // success
        await Promise.all(formatPromises);
        return true;
    } catch (error) {
        console.log(
            `An error occurred while trying to change Property:${property.id}'s details.
      Updated Property? - ${updatedPropSuccess}
      Formats to update? - ${!views ? "none" : `${views?.length}`}\nERROR:\n`,
            error
        );
        return false;
    }
};

export const handleChangeFormatTableState = async ({
    newOrder,
    newColumnVisibility,
    newTableSizing,
    format,
}: {
    newColumnVisibility: VisibilityState;
    newOrder: ColumnOrderState;
    newTableSizing: TableSizingState;
    format: ParsedFormat;
}) => {
    try {
        const { details } = format;
        details.columnOrder = newOrder;
        details.columnVisibility = newColumnVisibility;
        details.tableSizing = newTableSizing;
        const success = await updateFormat({
            id: format.id,
            details: {
                columnOrder: details.columnOrder,
                columnVisibility: details.columnVisibility,
                tableSizing: details.tableSizing,
            } as unknown as Prisma.JsonValue,
        });
        return !!success;
    } catch (error) {
        console.log(`An error occurred while trying to update Format:${format.id}.`, error);
        return false;
    }
};
