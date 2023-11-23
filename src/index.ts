import {
  Client,
  GatewayIntentBits,
  GuildScheduledEventStatus,
} from "discord.js";
import { deployCommands } from "./bot/deploy-commands";
import { commands } from "./bot/commands";

import "./google/calendar";

import dotenv from "dotenv";
dotenv.config();

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildScheduledEvents,
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

bot.on("guildScheduledEventUpdate", (oldEvent, newEvent) => {
  if (
    newEvent.status === GuildScheduledEventStatus.Completed ||
    newEvent.status === GuildScheduledEventStatus.Canceled
  ) {
    const channelId = newEvent.channelId;

    newEvent.guild?.channels.cache.forEach((channel) => {
      if (channel.id === channelId) {
        channel.delete();
      }
    });
  }
});

bot.on("guildScheduledEventDelete", (guildScheduledEvent) => {
  console.log("guildScheduledEventDelete ", guildScheduledEvent);
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
