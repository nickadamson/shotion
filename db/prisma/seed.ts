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
                        create: [{ ...inlineDBTitleProperty }, { ...inlineDBSelectProperty }],
                    },
                    childrenPages: {
                        create: [{ ...inlineDBEntry1 }, { ...inlineDBEntry2 }],
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
        order: ["inlineDBTitleProperty", "inlineDBSelectProperty"],
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
        },
        columnSizing: {
            inlineDBTitleProperty: 50,
            inlineDBSelectProperty: 100,
        },
    },
};

const inlineDBTitleProperty = {
    id: "inlineDBTitleProperty",
    type: "title",
    name: "title",
    // parentDbId: "inlineDBdatabase",
    // formatId: "",
    // columnId: "",
};

const inlineDBSelectProperty = {
    id: "inlineDBSelectProperty",
    type: "select",
    details: {
        options: [
            {
                id: "1a68efdc-c888-4dc0-bae9-f66fbedcfc9a",
                name: "selectOption1",
                color: "yellow",
            },
            {
                id: "c730a2d3-6118-4ca9-9ea3-9536fb014083",
                name: "selectOption2",
                color: "default",
            },
        ],
    },
    name: "tags",
    // parentDbId: "inlineDBdatabase",
    // formatId: "",
    // columnId: "",
};

const inlineDBEntry1 = {
    id: "inlineDBEntry1",
    object: "page",
    isWorkspace: false,
    type: "tableRow",
    title: {
        type: "text",
        text: { content: "Entry 1", link: null },
        annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
        },
        plainText: "Entry 1",
        href: null,
    },
    propertyValues: {
        inlineDBSelectProperty: { value: "selectOption1" },
    },
};
const inlineDBEntry2 = {
    id: "inlineDBEntry2",
    object: "page",
    isWorkspace: false,
    type: "tableRow",
    title: {
        type: "text",
        text: { content: "Entry 2", link: null },
        annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
        },
        plainText: "Entry 2",
        href: null,
    },
    propertyValues: {
        inlineDBSelectProperty: { value: null },
    },
};

const divider = {
    object: "block",
    type: "divider",
    // parentBlockId: "firstColumn",
    details: { orientation: "horizontal" },
};

const columnListAkaRow = {
    object: "block",
    id: "columnListAkaRow",
    type: "columnList",
    details: {
        columns: 2,
    },
    // parentPageId: "toDoWorkspacePage",
};
const firstColumn = {
    object: "block",
    id: "firstColumn",
    type: "column",
    // parentBlockId: "columnListAkaRow",
};

const dividerHorizontalFirstColumn = {
    object: "block",
    id: "horizontalDivider",
    type: "divider",
    // parentBlockId: "firstColumn",
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
