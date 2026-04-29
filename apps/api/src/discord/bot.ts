import { Client, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";
import { env } from "../env.js";

const commands = [
  new SlashCommandBuilder().setName("ping").setDescription("Health check"),
  new SlashCommandBuilder().setName("userinfo").setDescription("Show basic user info")
].map((c) => c.toJSON());

export const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

export async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(env.DISCORD_BOT_TOKEN);
  await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), { body: commands });
}

export async function startBot() {
  discordClient.once(Events.ClientReady, (client) => {
    console.log(`sal_bot ready as ${client.user.tag}`);
  });

  discordClient.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
      await interaction.reply({ content: "Pong from sal_bot ✅", ephemeral: true });
      return;
    }

    if (interaction.commandName === "userinfo") {
      await interaction.reply({
        ephemeral: true,
        embeds: [{
          title: "User Info",
          fields: [
            { name: "User", value: `<@${interaction.user.id}>` },
            { name: "ID", value: interaction.user.id }
          ]
        }]
      });
    }
  });

  discordClient.on(Events.GuildMemberAdd, async (member) => {
    member.guild.systemChannel?.send(`Willkommen ${member}!`);
  });

  await registerCommands();
  await discordClient.login(env.DISCORD_BOT_TOKEN);
}
