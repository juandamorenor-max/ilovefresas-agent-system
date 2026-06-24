import { describe, expect, it } from "vitest";
import {
  buildTelegramSessionId,
  parseTelegramControlCommand
} from "../../src/telegramCommands.js";

describe("telegram control commands", () => {
  it("handles /newchat before Flowise", () => {
    expect(parseTelegramControlCommand("/newchat")).toEqual({
      handled: true,
      action: "new_chat",
      shouldBypassFlowise: true,
      resetConversation: true,
      backtestLabel: undefined,
      responseText: "Listo, abri un chat nuevo para pruebas."
    });
  });

  it("keeps a backtest label when provided", () => {
    const command = parseTelegramControlCommand("/newchat domicilio villa santos");

    expect(command.handled).toBe(true);
    expect(command.backtestLabel).toBe("domicilio villa santos");
    expect(command.responseText).toContain("domicilio villa santos");
  });

  it("ignores normal customer messages", () => {
    expect(parseTelegramControlCommand("quiero unas fresas con crema")).toEqual({
      handled: false,
      shouldBypassFlowise: false,
      resetConversation: false
    });
  });

  it("builds isolated Telegram session ids", () => {
    expect(buildTelegramSessionId(12345, "case-001")).toBe("telegram:12345:case-001");
  });
});
