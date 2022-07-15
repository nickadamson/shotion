import cuid from "cuid";
import { Page, Property } from "@prisma/client";

export const updateDatabase = async (database) => {
  return (
    await fetch(`/api/databases/${database.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...database }),
    })
  ).json();
};

export const deleteDatabase = async (database) => {
  return (
    await fetch(`/api/databases/${database.id}`, {
      method: "DELETE",
    })
  ).json();
};

export const updatePage = async (page: Partial<Page>) => {
  return (
    await fetch(`/api/pages/${page.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...page }),
    })
  ).json();
};

export const deletePage = async (page) => {
  return (
    await fetch(`/api/pages/${page.id}`, {
      method: "DELETE",
    })
  ).json();
};

export const updateBlock = async (block) => {
  return (
    await fetch(`/api/blocks/${block.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...block }),
    })
  ).json();
};

export const deleteBlock = async (block) => {
  return (
    await fetch(`/api/blocks/${block.id}`, {
      method: "DELETE",
    })
  ).json();
};

export const newProperty = async ({
  databaseId,
  childrenPages,
}: {
  databaseId: string;
  childrenPages?: Pick<Page, "id" | "propertyValues">[];
}) => {
  let property = {
    id: cuid.slug(),
    parentDbId: databaseId,
    type: "text",
    name: "New Property",
  };
  const res = (
    await fetch(`/api/properties`, {
      method: "POST",
      body: JSON.stringify({ ...property }),
    })
  ).json();

  if (res?.ok && !childrenPages) return true;
  else if (childrenPages) {
    const success = await addNewPropertyToChildrenPages({
      property,
      childrenPages,
    });
  }
  return false;
};

const addNewPropertyToChildrenPages = async ({
  property,
  childrenPages,
}: {
  property: Partial<Property>;
  childrenPages: Pick<Page, "id" | "propertyValues">[];
}): Promise<boolean> => {
  const promises = childrenPages.map(async (page) => {
    let updatedPage = {
      id: page.id,
      propertyValues: page.propertyValues,
    };

    page.propertyValues[`${property.id}`] = { plainText: "" };

    return await updatePage(updatedPage);
  });

  const success = await Promise.all(promises);
  if (success) return true;
  else return false;
};

export const updateProperty = async (
  property: Partial<Property>
): Promise<boolean> => {
  return (
    await fetch(`/api/properties/${property.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...property }),
    })
  ).json();
};

export const deleteProperty = async (property) => {
  return (
    await fetch(`/api/properties/${property.id}`, {
      method: "DELETE",
    })
  ).json();
};

export const updateView = async (view) => {
  return (
    await fetch(`/api/views/${view.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...view }),
    })
  ).json();
};

export const deleteView = async (view) => {
  return (
    await fetch(`/api/views/${view.id}`, {
      method: "DELETE",
    })
  ).json();
};

export const updateFormat = async (format) => {
  return (
    await fetch(`/api/formats/${format.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...format }),
    })
  ).json();
};

export const deleteFormat = async (format) => {
  return (
    await fetch(`/api/formats/${format.id}`, {
      method: "DELETE",
    })
  ).json();
};
