import { Client, GatewayIntentBits } from "discord.js";
import { deployCommands } from "./bot/deploy-commands";
import { commands } from "./bot/commands";

import "./google/calendar";

import dotenv from "dotenv";
dotenv.config();

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

bot.login(process.env.DISCORD_TOKEN);

bot.once("ready", () => {
  console.log("Discord bot is ready! 🤖");
});

bot.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

bot.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});
