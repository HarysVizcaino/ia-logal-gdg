import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PresentationShell } from "./presentation-shell";

describe("PresentationShell", () => {
  beforeEach(() => {
    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      value: null,
    });
  });

  it("navigates with the keyboard and updates progress", async () => {
    render(<PresentationShell />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      "IA Local",
    );
    expect(screen.queryByRole("progressbar")).toBeNull();

    fireEvent.keyDown(window, { key: " " });

    await screen.findByRole("heading", { level: 1, name: "Hola, soy Harys" });
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("1");

    fireEvent.keyDown(window, { key: "Enter" });

    await screen.findByRole("heading", { level: 1, name: /Dónde vive la IA/i });
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("2");

    fireEvent.keyDown(window, { key: "ArrowRight" });

    await screen.findByRole("heading", {
      level: 1,
      name: "¿Qué significa IA local?",
    });
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
      "3",
    );

    fireEvent.keyDown(window, { key: "ArrowLeft" });
    await screen.findByRole("heading", { level: 1, name: /Dónde vive la IA/i });
  });

  it("supports navigation buttons and disables them at the edges", async () => {
    render(<PresentationShell />);

    const previousButton = screen.getByRole("button", {
      name: "Escena anterior",
    }) as HTMLButtonElement;
    expect(previousButton.disabled).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Escena siguiente" }));
    await screen.findByRole("heading", {
      level: 1,
      name: "Hola, soy Harys",
    });
    expect(previousButton.disabled).toBe(false);
  });

  it("opens the overview and jumps directly to a selected scene", async () => {
    render(<PresentationShell />);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(
      await screen.findByRole("dialog", { name: "Todas las escenas" }),
    ).toBeDefined();

    const modelCard = screen.getByText("Modelo correcto").closest("button");
    expect(modelCard).not.toBeNull();
    fireEvent.click(modelCard as HTMLButtonElement);
    await screen.findByRole("heading", { level: 1, name: "Más grande ≠ mejor para todo" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("toggles progress and opens the private presenter view", async () => {
    const focus = vi.fn();
    const openPresenter = vi
      .spyOn(window, "open")
      .mockReturnValue({ focus } as unknown as Window);
    render(<PresentationShell />);

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(await screen.findByRole("progressbar")).toBeDefined();
    fireEvent.keyDown(window, { key: "v" });
    await waitFor(() => expect(screen.queryByRole("progressbar")).toBeNull());

    fireEvent.keyDown(window, { key: "p" });
    expect(openPresenter).toHaveBeenCalledWith(
      "/presenter",
      "ia-local-presenter",
      "popup=yes,width=1440,height=900",
    );
    expect(focus).toHaveBeenCalledTimes(1);
  });

  it("does not hijack navigation while typing", () => {
    render(<PresentationShell />);
    const input = document.createElement("input");
    document.body.append(input);
    input.focus();

    fireEvent.keyDown(input, { key: "ArrowRight" });

    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      "IA Local",
    );
    input.remove();
  });

  it("requests fullscreen with the F shortcut", () => {
    const requestFullscreen = vi
      .spyOn(HTMLElement.prototype, "requestFullscreen")
      .mockResolvedValue(undefined);
    render(<PresentationShell />);

    fireEvent.keyDown(window, { key: "f" });

    expect(requestFullscreen).toHaveBeenCalledTimes(1);
  });
});
