import "dotenv/config";
import Discord from "discord.js";
import fetch from "node-fetch";

const discordBot = new Discord.Client();
const discordLogin = async (): Promise<void> => {
  try {
    await discordBot.login(process.env.DISCORD_BOT_TOKEN);
  } catch (err) {
    console.log(err);
  }
  return;
};

discordLogin()
  .then(() => updateFloor())
  .then(() => setInterval(() => updateFloor(), 600000));

async function updateFloor() {
  const currentFloor = await fetch(
    `https://api.opensea.io/api/v1/asset/${process.env.CONTRACT_ADDRESS}/1/`,
    {
      headers: {
        "X-API-KEY": process.env.OPENSEA_API_KEY,
      },
    }
  )
    .then((data) => data.json())
    .then((data) => data.collection.stats.floor_price);

  await discordBot!.user!.setActivity(
    "OS-" + currentFloor.toFixed(2).toString(),
    {
      type: "WATCHING",
    }
  );
}
