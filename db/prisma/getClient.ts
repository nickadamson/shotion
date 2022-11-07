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

// ^^ for (const [key, value] of Object.entries(prisma)) {
//     console.log(key);
//     if (key == "_activeProvider") {
//         console.log(value);
//     }
// }
// console.log(prisma?._activeProvider);
/** @returns @param provider @see //commentAbove^^  */
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

    return { prisma: Prisma, provider: (Prisma as any)?._activeProvider };
};

export default getClient;
