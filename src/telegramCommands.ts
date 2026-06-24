export type TelegramControlAction = "new_chat";

export interface TelegramControlCommand {
  handled: boolean;
  action?: TelegramControlAction;
  shouldBypassFlowise: boolean;
  resetConversation: boolean;
  backtestLabel?: string;
  responseText?: string;
}

export function parseTelegramControlCommand(message: string): TelegramControlCommand {
  const trimmed = message.trim();
  const [rawCommand, ...args] = trimmed.split(/\s+/);
  const command = rawCommand.toLowerCase().split("@")[0];

  if (command !== "/newchat") {
    return {
      handled: false,
      shouldBypassFlowise: false,
      resetConversation: false
    };
  }

  const backtestLabel = args.join(" ").trim() || undefined;

  return {
    handled: true,
    action: "new_chat",
    shouldBypassFlowise: true,
    resetConversation: true,
    backtestLabel,
    responseText: backtestLabel
      ? `Listo, abri un chat nuevo para probar: ${backtestLabel}.`
      : "Listo, abri un chat nuevo para pruebas."
  };
}

export function buildTelegramSessionId(chatId: string | number, activeConversationId: string): string {
  return `telegram:${chatId}:${activeConversationId}`;
}
