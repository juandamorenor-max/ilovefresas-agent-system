import {
  buildTelegramSessionId,
  parseTelegramControlCommand,
  type TelegramControlAction
} from "./telegramCommands.js";
import type { AvailableCatalogContext } from "./types.js";

export interface TelegramInboundMessage {
  chatId: string | number;
  text: string;
  username?: string;
  activeConversationId?: string;
}

export interface TelegramSessionOptions {
  createConversationId?: () => string;
  catalogoDisponible?: string | AvailableCatalogContext;
}

export interface TelegramSessionDecision {
  chatId: string | number;
  channelContact: string;
  conversationId: string;
  sessionId: string;
  shouldCallFlowise: boolean;
  resetConversation: boolean;
  controlAction?: TelegramControlAction;
  backtestLabel?: string;
  responseText?: string;
  flowisePayload?: {
    question: string;
    sessionId: string;
    catalogoDisponible?: string | AvailableCatalogContext;
  };
}

export function prepareTelegramTurn(
  message: TelegramInboundMessage,
  options: TelegramSessionOptions = {}
): TelegramSessionDecision {
  const createConversationId = options.createConversationId ?? defaultConversationId;
  const control = parseTelegramControlCommand(message.text);
  const conversationId =
    control.resetConversation || !message.activeConversationId
      ? createConversationId()
      : message.activeConversationId;
  const sessionId = buildTelegramSessionId(message.chatId, conversationId);
  const channelContact = `telegram:${message.chatId}`;

  if (control.handled) {
    return {
      chatId: message.chatId,
      channelContact,
      conversationId,
      sessionId,
      shouldCallFlowise: false,
      resetConversation: control.resetConversation,
      controlAction: control.action,
      backtestLabel: control.backtestLabel,
      responseText: control.responseText
    };
  }

  return {
    chatId: message.chatId,
    channelContact,
    conversationId,
    sessionId,
    shouldCallFlowise: true,
    resetConversation: false,
    flowisePayload: {
      question: message.text,
      sessionId,
      ...(options.catalogoDisponible
        ? { catalogoDisponible: options.catalogoDisponible }
        : {})
    }
  };
}

function defaultConversationId(): string {
  return `conv-${Date.now().toString(36)}`;
}
