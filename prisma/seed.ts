import { prisma } from "../lib/prisma";
import { getSchemaForGame } from "../lib/steam";

async function main() {
  const schema = await getSchemaForGame();

  console.log(schema);

  await prisma.stat.deleteMany();
  await prisma.stat.createMany({
    data: schema.game.availableGameStats.stats,
  });

  await prisma.achievement.deleteMany();
  await prisma.achievement.createMany({
    data: schema.game.availableGameStats.achievements,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
