import {
  ChannelType,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
} from "discord.js";
import { getEventList } from "../../google/calendar";

import dotenv from "dotenv";
dotenv.config();

export const data = new SlashCommandBuilder()
  .setName("events")
  .setDescription("Shows all Google Calendar events");

export async function execute(interaction: CommandInteraction) {
  const data = await getEventList();

  if (data && data.items && data.items.length) {
    const fields = data.items.map(({ summary, start }) => ({
      name: summary ?? "no summary",
      value:
        start && start.dateTime
          ? new Date(start.dateTime).toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "no start date/time",
    }));

    const embed = new EmbedBuilder()
      .setTitle("Google Calendar event list")
      .setColor("Random")
      .addFields(...fields);

    const category = interaction.guild?.channels.cache.find(
      ({ name }) =>
        name.toLowerCase() === process.env.DISCORD_EVENTS_CATEGORY_NAME
    );

    data.items.forEach(async ({ summary, start }) => {
      const channel = await interaction.guild?.channels.create({
        name: summary ?? "Event /wo title",
        type: ChannelType.GuildVoice,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: ["SendMessages"] },
        ],
        parent: category?.parentId,
      });

      interaction.guild?.scheduledEvents.create({
        entityType: GuildScheduledEventEntityType.Voice,
        name: summary ?? "Event /wo title",
        privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
        scheduledStartTime:
          start && start.dateTime
            ? new Date(start.dateTime)
            : new Date("31/12/2025"),
        channel,
      });
    });

    return interaction.reply({ embeds: [embed] });
  }

  return interaction.reply("There is no events in your Google Calendar :(");
}
