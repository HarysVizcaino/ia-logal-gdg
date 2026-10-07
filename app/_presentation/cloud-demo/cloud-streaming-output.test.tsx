import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CloudStreamingOutput } from "./cloud-streaming-output";

describe("CloudStreamingOutput", () => {
  it("follows new chunks, pauses while reading above, and resumes at the bottom", () => {
    const { rerender } = render(<CloudStreamingOutput output="" generating={false} />);
    const viewport = screen.getByLabelText("Respuesta del modelo frontier");
    let height = 500;
    Object.defineProperty(viewport, "scrollHeight", { get: () => height });
    Object.defineProperty(viewport, "clientHeight", { value: 100 });

    rerender(<CloudStreamingOutput output="Primer bloque" generating />);
    expect(viewport.scrollTop).toBe(500);

    viewport.scrollTop = 100;
    fireEvent.scroll(viewport);
    height = 700;
    rerender(<CloudStreamingOutput output="Primer bloque y segundo bloque" generating />);
    expect(viewport.scrollTop).toBe(100);

    viewport.scrollTop = 600;
    fireEvent.scroll(viewport);
    height = 900;
    rerender(<CloudStreamingOutput output="Respuesta completa" generating={false} />);
    expect(viewport.scrollTop).toBe(900);

    viewport.scrollTop = 100;
    fireEvent.scroll(viewport);
    rerender(<CloudStreamingOutput output="" generating={false} />);
    expect(viewport.scrollTop).toBe(0);
    rerender(<CloudStreamingOutput output="Nueva respuesta" generating />);
    expect(viewport.scrollTop).toBe(900);
  });

  it("keeps scroll keys inside the response while allowing other presentation shortcuts", () => {
    const onKeyDown = vi.fn();
    render(<div onKeyDown={onKeyDown}><CloudStreamingOutput output="Respuesta" generating={false} /></div>);
    const viewport = screen.getByLabelText("Respuesta del modelo frontier");
    for (const key of ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End", " ", "Enter"]) {
      expect(fireEvent.keyDown(viewport, { key })).toBe(true);
    }
    expect(onKeyDown).not.toHaveBeenCalled();
    fireEvent.keyDown(viewport, { key: "Escape" });
    expect(onKeyDown).toHaveBeenCalledOnce();
  });
});
