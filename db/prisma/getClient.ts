import { PrismaClient } from "@prisma/client";

// NodeJS.Global namespace was removed in @types/node@16.0.0
declare global {
    namespace NodeJS {
        interface Global {}
        interface InspectOptions {}
        interface ConsoleConstructor extends console.ConsoleConstructor {}
    }
}

// add prisma to the NodeJS global type
interface CustomNodeJsGlobal extends NodeJS.Global {
    prisma: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

const getClient = () => {
    const Prisma =
        global.prisma ||
        new PrismaClient({
            errorFormat: "pretty",
            log: [
                // "query",
                "info",
                "warn",
                "error",
            ],
        });

    if (process.env.NODE_ENV === "development") {
        global.prisma = Prisma;
    }

    return Prisma;
};

export default getClient;
