import Image from "next/image";
import { prisma } from "../../lib/prisma";
import { getPlayerSummaries, getUserStatsForGame } from "../../lib/steam";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { CheckIcon, Cross2Icon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function getUserStats(steamid: string) {
  let userStats = await prisma.userStats.findUnique({ where: { steamid } });

  if (
    !userStats ||
    userStats.updatedAt < new Date(Date.now() - 1000 * 60 * 60 * 24)
  ) {
    userStats = await updateUserStats(steamid);
  }

  return userStats;
}

async function updateUserStats(steamid: string) {
  const stats = await prisma.stat.findMany();
  const achievements = await prisma.achievement.findMany();

  const playerSummaries = await getPlayerSummaries([steamid]);
  const userStatsForGame = await getUserStatsForGame(steamid);

  const player = playerSummaries.response.players[0];

  const userStats = {
    steamid,
    updatedAt: new Date(),
    personaname: player.personaname,
    profileurl: player.profileurl,
    avatar: player.avatar,
    avatarmedium: player.avatarmedium,
    avatarfull: player.avatarfull,
    communityvisibilitystate: player.communityvisibilitystate,
    ...Object.fromEntries(
      stats.map((stat) => [
        stat.name,
        (userStatsForGame.playerstats?.stats ?? []).find(
          (s: any) => s.name === stat.name
        )?.value,
      ])
    ),
    ...Object.fromEntries(
      achievements.map((achievement) => [
        achievement.name,
        (userStatsForGame.playerstats?.achievements ?? []).find(
          (a: any) => a.name === achievement.name
        )?.achieved,
      ])
    ),
  };

  return await prisma.userStats.upsert({
    where: { steamid },
    update: userStats,
    create: userStats,
  });
}

export default async function Page({
  params,
}: {
  params: { steamid: string };
}) {
  const stats = await prisma.stat.findMany();
  const achievements = await prisma.achievement.findMany();
  const userStats: any = await getUserStats(params.steamid);

  return (
    <div className="container py-4">
      <div className="flex items-center space-x-4 my-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={userStats.avatarfull} />
        </Avatar>
        <h2 className="text-4xl font-bold tracking-tight grow">
          {userStats.personaname}
        </h2>
        <Button variant="outline" asChild>
          <Link href={userStats.profileurl} target="_blank">
            Steam profile
            <ExternalLinkIcon className="w-4 h-4 ms-1" />
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="stats">
        <TabsList className="grid grid-cols-2 mt-8 mb-6">
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((stat) => (
                <TableRow>
                  <TableCell className="font-semibold">{stat.name}</TableCell>
                  <TableCell className="text-right">
                    {userStats[stat.name]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="achievements">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {achievements.map((achievement) =>
              achievement.hidden ? null : (
                <Card
                  className={
                    userStats[achievement.name] ? "opacity-100" : "opacity-50"
                  }
                >
                  <div className="flex items-center p-2">
                    <div className="me-4 shrink-0">
                      <Image
                        src={achievement.icongray}
                        width={64}
                        height={64}
                        alt={achievement.displayName}
                        className="rounded-md"
                      />
                    </div>
                    <div className="grow">
                      <h3 className="font-bold">{achievement.displayName}</h3>
                      <p className="text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                    <div className="shrink-0 text-muted-foreground/50 m-2">
                      {userStats[achievement.name] ? (
                        <CheckIcon className="h-6 w-6" />
                      ) : (
                        <Cross2Icon className="h-6 w-6" />
                      )}
                    </div>
                  </div>
                </Card>
              )
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
