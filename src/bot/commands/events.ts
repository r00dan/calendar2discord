import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { getEventList } from "../../google/calendar";

export const data = new SlashCommandBuilder()
  .setName("events")
  .setDescription("Shows all Google Calendar events");

export async function execute(interaction: CommandInteraction) {
  const data = await getEventList();
  const result = data.items?.map(
    ({
      id,
      summary,
      description,
      attendees,
      organizer,
      created,
      htmlLink,
      start,
    }) =>
      new EmbedBuilder()
        .setTitle(summary ?? "No title")
        .setDescription(description ?? "No description")
        .setColor("Random")
        .addFields(
          {
            name: "Organizer email",
            value: organizer?.email ?? "No orginizer email",
          },
          {
            name: "Organizer name",
            value: organizer?.displayName ?? "No organizer name",
          },
          { name: "Created", value: created ?? "No created date" },
          { name: "Start", value: start?.dateTime ?? "No start date" },
          {
            name: "Attendees",
            value:
              attendees?.map(({ email }) => email).toString() ?? "No attendees",
          },
          { name: "Link", value: htmlLink ?? "No link" }
        )
  );

  return interaction.reply({ embeds: result });
}
