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


async function main() {
  const users = await createUsers();
  console.log(users);
