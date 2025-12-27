import { Telegraf } from "telegraf";

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatIdRaw = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatIdRaw) {
  throw new Error("Telegram env vars missing");
}

const bot = new Telegraf(token);
const chatId: string | number = isNaN(Number(chatIdRaw))
  ? chatIdRaw
  : Number(chatIdRaw);

export async function sendMessage(text: string) {
  if (!text.trim()) return;

  await bot.telegram.sendMessage(chatId, text, {
    parse_mode: "Markdown",
    link_preview_options: {
        is_disabled: true,
    },
  });
}