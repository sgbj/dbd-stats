"use server";

const key = process.env.STEAM_API_KEY;
const appid = "381210";

export async function getUserStatsForGame(steamid: string) {
  const res = await fetch(
    `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/?key=${key}&appid=${appid}&steamid=${steamid}`
  );
  return res.json();
}

export async function getSchemaForGame() {
  const res = await fetch(
    `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${key}&appid=${appid}`
  );
  return res.json();
}

export async function getPlayerSummaries(steamids: string[]) {
  const res = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${key}&steamids=${steamids.join(
      ","
    )}`
  );
  return res.json();
}

export async function resolveVanityUrl(vanityurl: string) {
  const res = await fetch(
    `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${key}&vanityurl=${vanityurl}`
  );
  return res.json();
}
