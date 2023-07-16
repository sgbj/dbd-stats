"use client";

import { Input } from "@/components/ui/input";
import { getPlayerSummaries, resolveVanityUrl } from "@/lib/steam";
import { useRouter } from "next/navigation";

export default function Search() {
  const router = useRouter();

  async function onSearch(value: string) {
    const playerSummaries = await getPlayerSummaries([value]);

    if (playerSummaries.response.players.length) {
      router.push(`/${playerSummaries.response.players[0].steamid}`);
    } else {
      const res = await resolveVanityUrl(value);

      if (res.response.steamid) {
        router.push(`/${res.response.steamid}`);
      }
    }
  }

  return (
    <Input
      name="value"
      type="search"
      placeholder="Search for Steam ID, username, or profile URL"
      className="grow max-w-[600px]"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSearch(e.currentTarget.value);
        }
      }}
    />
  );
}
