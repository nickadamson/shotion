import cuid from "cuid";
import { Format, Page, Property } from "@prisma/client";
import { TableSizingState, TableViewsMeta } from "@/hooks/useDatabaseReducer";
import { VisibilityState, ColumnOrderState } from "@tanstack/react-table";
import { PropertyType } from "./types";

// export const updateDatabase = async (database) => {
//     return (
//         await fetch(`/api/databases/${database.id}`, {
//             method: "PUT",
//             body: JSON.stringify({ ...database }),
//         })
//     ).json();
// };

// export const deleteDatabase = async (database) => {
//     return (
//         await fetch(`/api/databases/${database.id}`, {
//             method: "DELETE",
//         })
//     ).json();
// };

export const updatePage = async (page: Partial<Page>) => {
    const res = await (
        await fetch(`/api/pages/${page.id}`, {
            method: "PUT",
            body: JSON.stringify({ ...page }),
        })
    ).json();
    console.log(res);
    return res.ok ? true : false;
};

// export const deletePage = async (page) => {
//     return (
//         await fetch(`/api/pages/${page.id}`, {
//             method: "DELETE",
//         })
//     ).json();
// };

// export const updateBlock = async (block) => {
//     return (
//         await fetch(`/api/blocks/${block.id}`, {
//             method: "PUT",
//             body: JSON.stringify({ ...block }),
//         })
//     ).json();
// };

// export const deleteBlock = async (block) => {
//     return (
//         await fetch(`/api/blocks/${block.id}`, {
//             method: "DELETE",
//         })
//     ).json();
// };

async function createNewProperty(property: Partial<Property>) {
    const res = await (
        await fetch(`/api/properties`, {
            method: "POST",
            body: JSON.stringify({ ...property }),
        })
    ).json();
    console.log(res);
    return res.ok ? true : false;
}

export const handleNewProperty = async ({
    databaseId,
    childrenPages,
    views,
}: {
    databaseId: string;
    childrenPages?: Pick<Page, "id" | "propertyValues">[];
    views: TableViewsMeta;
}) => {
    let createdProperty, updatedFormats; // for logging errors
    try {
        // create property
        let property = {
            id: cuid.slug(),
            parentDbId: databaseId,
            type: "text",
            name: "New Property",
        };
        console.log({ databaseId, childrenPages, views, property });
        createdProperty = await createNewProperty(property);
        // fetch(`/api/properties`, {
        //     method: "POST",
        //     body: JSON.stringify({ ...property }),
        // });

        // push property into all formats associated with the db
        let formatPromises = views.map(async (view) => {
            // process views and their formatting
            let width = 32;
            let formatId = view.format.id;
            let { details } = view.format;
            details.order.push(property.id);
            details.columnVisibility[`${formatId}`] = true;
            details.tableSizing = {
                tableWidth: Number(details?.tableSizing?.tableWidth ?? 0) + width,
                columnWidths: {
                    ...details.tableSizing.columnWidths,
                    [`${property.id}`]: width,
                },
            };
            return await updateFormat({
                id: formatId,
                details,
            });

            // fetch(`/api/formats/${formatId}`, {
            //     method: "PUT",
            //     body: JSON.stringify({
            //         details: {
            //             columnOrder: details.order,
            //             columnVisibility: details.columnVisibility,
            //             tableSizing: details.tableSizing,
            //         },
            //     }),
            // });
        });

        await Promise.all(formatPromises);
        updatedFormats = true;

        // success
        if (!childrenPages) return true;

        // push property into all page.propertyValues associated with the db
        let pagePromises = childrenPages.map(async (page) => {
            let { id: pageId, propertyValues } = page;

            propertyValues[`${property.id}`] = { plainText: "" };

            return await updatePage({
                id: pageId,
                propertyValues,
            });
            // fetch(`/api/pages/${pageId}`, {
            //     method: "PUT",
            //     body: JSON.stringify({ propertyValues: propertyValues }),
            // });
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
    newType: PropertyType;
    childrenPages?: Pick<Page, "id" | "propertyValues">[];
}) => {
    let updatedPropSucess = false; // for logging errors
    try {
        // update property
        let updatedProperty = {
            type: newType,
        };

        let defaultDetails = getDefaultDetailsForPropertyType(newType);
        if (defaultDetails) updatedProperty["details"] = defaultDetails;

        await fetch(`/api/properties/${property.id}`, {
            method: "PUT",
            body: JSON.stringify({ ...updatedProperty }),
        });
        updatedPropSucess = true; // for logging errors

        // success
        if (!childrenPages) return true;

        // push property into all page.propertyValues associated with the db
        let pagePromises = childrenPages.map(async (page) => {
            let { id: pageId, propertyValues } = page;

            let value = getDefaultValueForPropertyType(newType);

            propertyValues[`${property.id}`] = value;

            return await fetch(`/api/pages/${pageId}`, {
                method: "PUT",
                body: JSON.stringify({ propertyValues: propertyValues }),
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
    views?: TableViewsMeta;
}) => {
    let updatedPropSucess = false; // for logging errors
    try {
        // update property
        let updatedProperty = {
            details: details,
        };

        await fetch(`/api/properties/${property.id}`, {
            method: "PUT",
            body: JSON.stringify({ ...updatedProperty }),
        });
        updatedPropSucess = true; // for logging errors

        // success
        // push property into all formats associated with the db
        let formatPromises = views.map(async (view) => {
            // process views and their formatting
            let formatId = view.format.id;
            let { details } = view.format;
            // details.sorts
            // details.filters
            // todo
            // return await fetch(`/api/formats/${formatId}`, {
            //     method: "PUT",
            //     body: JSON.stringify({
            //         details: {
            //             sorts: details.sorts,
            //             filters: details.filters,
            //         },
            //     }),
            // });
        });

        // success
        await Promise.all(formatPromises);
        return true;
    } catch (error) {
        console.log(
            `An error occurred while trying to change Property:${property.id}'s details.
      Updated Property? - ${updatedPropSucess}
      Formats to update? - ${!views ? "none" : `${views?.length}`}\nERROR:\n`,
            error
        );
        return false;
    }
};

export const handleChangeFormatTableState = async ({
    order,
    columnVisibility,
    tableSizing,
    format,
}: {
    columnVisibility: VisibilityState;
    order: ColumnOrderState;
    tableSizing: TableSizingState;
    format: Partial<ParsedFormatting>;
}) => {
    let formatId = format.id;
    try {
        // update property
        let { details } = format;
        details.order = order;
        details.columnVisibility = columnVisibility;
        details.tableSizing = tableSizing;
        await fetch(`/api/formats/${formatId}`, {
            method: "PUT",
            body: JSON.stringify({
                details: {
                    columnOrder: details.order,
                    columnVisibility: details.columnVisibility,
                    tableSizing: details.tableSizing,
                },
            }),
        });
        return true;
    } catch (error) {
        console.log(`An error occurred while trying to update Format:${formatId}.`, error);
        return false;
    }
};

// export const handleDeleteProperty = async (property) => {
//     try {
//     } catch (error) {}
// };

// export const updateView = async (view) => {
//     return (
//         await fetch(`/api/views/${view.id}`, {
//             method: "PUT",
//             body: JSON.stringify({ ...view }),
//         })
//     ).json();
// };

// export const deleteView = async (view) => {
//     return (
//         await fetch(`/api/views/${view.id}`, {
//             method: "DELETE",
//         })
//     ).json();
// return res.ok ?  true : false
// };

export const updateFormat = async (format) => {
    const res = await (
        await fetch(`/api/formats/${format.id}`, {
            method: "PUT",
            body: JSON.stringify({ ...format }),
        })
    ).json();
    console.log(res);
    return res.ok ? true : false;
};

// export const deleteFormat = async (format) => {
//     return (
//         await fetch(`/api/formats/${format.id}`, {
//             method: "DELETE",
//         })
//     ).json();
// return res.ok ?  true : false
// };
