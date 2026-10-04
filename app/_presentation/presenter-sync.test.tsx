import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PresentationShell } from "./presentation-shell";
import { PresenterView } from "./presenter-view";

class FakeBroadcastChannel extends EventTarget {
  static channels = new Map<string, Set<FakeBroadcastChannel>>();

  static reset() {
    FakeBroadcastChannel.channels.clear();
  }

  readonly name: string;

  constructor(name: string) {
    super();
    this.name = name;

    const peers = FakeBroadcastChannel.channels.get(name) ?? new Set();
    peers.add(this);
    FakeBroadcastChannel.channels.set(name, peers);
  }

  postMessage(message: unknown) {
    for (const peer of FakeBroadcastChannel.channels.get(this.name) ?? []) {
      if (peer !== this) {
        peer.dispatchEvent(new MessageEvent("message", { data: message }));
      }
    }
  }

  close() {
    FakeBroadcastChannel.channels.get(this.name)?.delete(this);
  }
}

describe("private presenter synchronization", () => {
  beforeEach(() => {
    FakeBroadcastChannel.reset();
    vi.stubGlobal("BroadcastChannel", FakeBroadcastChannel);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("connects both windows and controls the audience scene", async () => {
    render(
      <>
        <PresentationShell />
        <PresenterView />
      </>,
    );

    expect(await screen.findByText("Waiting for start")).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    await waitFor(() => {
      expect(
        document
          .querySelector(".presentation-stage")
          ?.getAttribute("data-scene-id"),
      ).toBe("01-speaker-introduction");
    });

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    await waitFor(() => expect(document.querySelector(".presentation-stage")?.getAttribute("data-scene-id")).toBe("02-local-ai-definition"));

    fireEvent.click(screen.getByRole("button", { name: "Ir a Modelo correcto" }));
    await waitFor(() => {
      expect(
        document
          .querySelector(".presentation-stage")
          ?.getAttribute("data-scene-id"),
      ).toBe("05-right-model-for-task");
    });
    expect(
      screen.getByText("El modelo correcto para la tarea correcta."),
    ).toBeDefined();
  });
});
