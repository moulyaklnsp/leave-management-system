import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: [
    { level: "query", emit: "event" },
    { level: "error", emit: "stdout" },
    { level: "warn", emit: "stdout" },
  ],
});

prisma.$on("query", (event) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`🗄️ ${event.query}`);
  }
});

export default prisma;