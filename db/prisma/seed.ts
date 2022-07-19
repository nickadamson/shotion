import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function createUsers() {
    const users = [
        { id: "1", username: "User1", isAdmin: true },
        { id: "2", username: "User2", isAdmin: false },
    ];

    const promises = users.map((user) => {
        return prisma.user.upsert({
            where: { username: user.username },
            update: { ...user },
            create: { ...user },
        });
    });

    return await Promise.all(promises);
}

const toDoWorkspaceFormat = {
    id: "toDoWorkspaceFormat",
    order: [
        "toDoWorkspaceH1",
        "toDoWorkspaceText1",
        "toDoWorkspaceText2",
        "todoWorkspaceFirstToggle",
        "divider",
        "columnListAkaRow",
    ],
};

async function createToDoWorkspacePage() {
    const toDoWorkspacePage = await createPage({
        id: "toDoWorkspacePage",
        object: "page",
        isWorkspace: true,
        createdById: "1",
        type: "page",
        icon: "",
        cover: "",
        title: {
            type: "text",
            text: { content: "Simple Workspace Page", link: null },
            annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
            },
            plainText: "Simple Workspace Page",
            href: null,
        },
        // collectionView: { upsert: { create: {}, where: {} } },
        format: {
            create: {
                ...toDoWorkspaceFormat,
            },
        },
        childrenDbs: {
            create: [
                {
                    ...inlineDBDatabase,
                    views: {
                        create: [
                            {
                                ...inlineDBTableView,
                                format: {
                                    create: { ...inlineDBTableFormat },
                                },
                            },
                        ],
                    },
                    properties: {
                        create: [
                            { ...inlineDBTitleProperty },
                            { ...inlineDBSelectProperty },
                            { ...inlineDBTextProperty },
                            { ...inlineDBMultiselectProperty },
                            { ...inlineDBDateProperty },
                            { ...inlineDBCheckboxProperty },
                        ],
                    },
                    childrenPages: {
                        create: [{ ...inlineDBEntry1 }, { ...inlineDBEntry2 }, { ...inlineDBEntry3 }],
                    },
                },
            ],
        },
        childrenBlocks: {
            create: [
                { ...toDoWorkspaceH1 },
                { ...toDoWorkspaceText1 },
                { ...toDoWorkspaceText2 },
                {
                    ...todoWorkspaceFirstToggle,
                    childrenBlocks: {
                        create: [
                            {
                                ...columnListAkaRow,
                                childrenBlocks: {
                                    create: [
                                        {
                                            ...firstColumn,
                                            childrenBlocks: { create: [{ ...divider }] },
                                        },
                                        {
                                            ...secondColumn,
                                            childrenBlocks: {
                                                create: [{ ...secondColumnContentBlock }],
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },

                    // childrenDbs: {
                    //   create: [
                    //     {
                    //       ...inlineDBDatabase,
                    //       views: {
                    //         create: [{ ...inlineDBTableView }],
                    //       },
                    //       properties: {
                    //         create: [
                    //           { ...inlineDBTitleProperty },
                    //           { ...inlineDBSelectProperty },
                    //         ],
                    //       },
                    //       childrenPages: {
                    //         create: [{ ...inlineDBEntry1 }, { ...inlineDBEntry2 }],
                    //       },
                    //     },
                    //   ],
                    // },
                },
            ],
        },
    });
}

async function createPage(page) {
    const newPage = await prisma.page.upsert({
        where: { id: page.id },
        update: { ...page },
        create: { ...page },
    });

    return newPage;
}

async function main() {
    const users = await createUsers();
    console.log(users);
    await createToDoWorkspacePage();
    // const databases = await createDatabases();
    // const pages = await createPages();
    // const blocks = await createBlocks();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

const toDoWorkspaceH1 = {
    id: "toDoWorkspaceH1",
    object: "block",
    type: "heading1",
    details: {
        richText: [
            {
                type: "text",
                text: { content: "Heading Text", link: null },
                annotations: {
                    bold: false,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: "default",
                },
                plainText: "Heading Text",
                href: null,
            },
        ],
        color: "default",
    },
    // parentPageId: "toDoWorkspacePage",
};

const toDoWorkspaceText1 = {
    id: "toDoWorkspaceText1",
    object: "block",
    type: "text",
    details: {
        richText: [
            {
                type: "text",
                text: { content: "Simple Text 1", link: null },
                annotations: {
                    bold: false,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: "default",
                },
                plainText: "Simple Text 1",
                href: null,
            },
        ],
        color: "default",
    },
    // parentPageId: "toDoWorkspacePage",
};

const toDoWorkspaceText2 = {
    id: "toDoWorkspaceText2",
    object: "block",
    type: "text",
    details: {
        richText: [
            {
                type: "text",
                text: { content: "Simple Text 1", link: null },
                annotations: {
                    bold: false,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: "default",
                },
                plainText: "Simple Text 2",
                href: null,
            },
        ],
        color: "default",
    },
    // parentPageId: "toDoWorkspacePage",
};

const todoWorkspaceFirstToggle = {
    id: "toggle",
    object: "block",
    type: "toggle",
    details: {
        richText: [
            {
                type: "text",
                text: { content: "inlinedatabase inside", link: null },
                annotations: {
                    bold: false,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: "default",
                },
                plainText: "inlinedatabase inside",
                href: null,
            },
        ],
        color: "default",
    },
    // parentPageId: "toDoWorkspacePage",
};

const inlineDBDatabase = {
    id: "inlineDBdatabase",
    object: "database",
    isWorkspace: false,

    type: "childDatabase",
    isInline: true,
    title: {
        type: "text",
        text: { content: "Inline Database", link: null },
        annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
        },
        plainText: "Inline Database",
        href: null,
    },
    description: {},
    icon: {},
    cover: {},
    // parentPageId: "toDoWorkspacePage",
    // parentBlockId: "inlineDBBlock",
};

const inlineDBTableView = {
    id: "inlineDBTableView",
    type: "table",
    default: true,
    // visible: true,
    // pageSort: ,
    // parentDbId: "",
};

const inlineDBTableFormat = {
    id: "inlineDBTableFormat",
    details: {
        columnOrder: [
            "inlineDBTitleProperty",
            "inlineDBSelectProperty",
            "inlineDBTextProperty",
            "inlineDBMultiselectProperty",
            "inlineDBDateProperty",
            "inlineDBCheckboxProperty",
        ],
        filters: [{}],
        sorts: [
            {
                direction: "desc",
                columnSort: [],
                function: {},
            },
        ],
        columnVisibility: {
            inlineDBTitleProperty: true,
            inlineDBSelectProperty: true,
            inlineDBTextProperty: true,
            inlineDBMultiselectProperty: true,
            inlineDBDateProperty: true,
            inlineDBCheckboxProperty: true,
        },
        tableSizing: {
            tableWidth: 600,
            columnWidths: {
                inlineDBTitleProperty: 100,
                inlineDBSelectProperty: 100,
                inlineDBTextProperty: 100,
                inlineDBMultiselectProperty: 100,
                inlineDBDateProperty: 100,
                inlineDBCheckboxProperty: 100,
            },
        },
    },
};

const inlineDBTitleProperty = {
    id: "inlineDBTitleProperty",
    type: "title",
    name: "Task",
};

const inlineDBSelectProperty = {
    id: "inlineDBSelectProperty",
    type: "select",
    details: {
        options: [
            {
                id: "s1",
                name: "selectOption1",
                color: "orange",
            },
            {
                id: "s2",
                name: "selectOption2",
                color: "default",
            },
            {
                id: "s3",
                name: "selectOption3",
                color: "pink",
            },
        ],
    },
    name: "option",
};
const inlineDBTextProperty = {
    id: "inlineDBTextProperty",
    type: "text",
    name: "notes",
};

const inlineDBMultiselectProperty = {
    id: "inlineDBMultiselectProperty",
    type: "multiselect",
    details: {
        options: [
            {
                id: "ms1",
                name: "tag1",
                color: "yellow",
            },
            {
                id: "ms2",
                name: "tag2",
                color: "green",
            },
            {
                id: "ms3",
                name: "tag2",
                color: "blue",
            },
        ],
    },
    name: "tags",
};
const inlineDBDateProperty = {
    id: "inlineDBDateProperty",
    type: "date",
    name: "Due Date",
};
const inlineDBCheckboxProperty = {
    id: "inlineDBCheckboxProperty",
    type: "checkbox",
    name: "completed",
};

const inlineDBEntry1 = {
    id: "inlineDBEntry1",
    object: "page",
    isWorkspace: false,
    type: "tableRow",
    title: {
        type: "text",
        text: { content: "Task 1", link: null },
        annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
        },
        plainText: "Task 1",
        href: null,
    },
    propertyValues: {
        inlineDBSelectProperty: "s1",
        inlineDBTextProperty: "hello world",
        inlineDBMultiselectProperty: ["ms2", "ms3"],
        inlineDBDateProperty: "2022-12-01",
        inlineDBCheckboxProperty: true,
    },
};
const inlineDBEntry2 = {
    id: "inlineDBEntry2",
    object: "page",
    isWorkspace: false,
    type: "tableRow",
    title: {
        type: "text",
        text: { content: "Task 2", link: null },
        annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
        },
        plainText: "Task 2",
        href: null,
    },
    propertyValues: {
        inlineDBSelectProperty: "s2",
        inlineDBTextProperty: "next up",
        inlineDBMultiselectProperty: ["ms2"],
        inlineDBDateProperty: "2022-12-02",
        inlineDBCheckboxProperty: false,
    },
};

const inlineDBEntry3 = {
    id: "inlineDBEntry3",
    object: "page",
    isWorkspace: false,
    type: "tableRow",
    title: {
        type: "text",
        text: { content: "Task 3", link: null },
        annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
        },
        plainText: "Task 3",
        href: null,
    },
    propertyValues: {
        inlineDBSelectProperty: "s3",
        inlineDBTextProperty: "important",
        inlineDBMultiselectProperty: ["ms1", "ms2", "ms3"],
        inlineDBDateProperty: "2022-12-03",
        inlineDBCheckboxProperty: false,
    },
};

const divider = {
    object: "block",
    type: "divider",

    details: { orientation: "horizontal" },
};

const columnListAkaRow = {
    object: "block",
    id: "columnListAkaRow",
    type: "columnList",
    details: {
        columns: 2,
    },
};
const firstColumn = {
    object: "block",
    id: "firstColumn",
    type: "column",
};

const dividerHorizontalFirstColumn = {
    object: "block",
    id: "horizontalDivider",
    type: "divider",
};

const secondColumn = {
    object: "block",
    id: "secondColumn",
    type: "column",
};

const secondColumnContentBlock = {
    object: "block",
    id: "secondColumnContentBlock",
    // parentDbId: "toDoWorkspacePage",
    type: "text",
    details: {
        richText: [
            {
                type: "text",
                text: {
                    content: "second column: hello world",
                    link: null,
                },
                annotations: {
                    bold: false,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: "default",
                },
                plainText: "second column: hello world",
                href: null,
            },
        ],
        color: "default",
    },
};
