import { describe, expect, it } from "vitest";

import { getSceneById, sceneCount, scenes, SECTION_TARGET_SECONDS } from "./scene-registry";
import { sceneIds } from "./types";

describe("scene registry", () => {
  it("contains every section in presentation order", () => {
    expect(sceneCount).toBe(42);
    expect(scenes.map((scene) => scene.id)).toEqual(sceneIds);
  });

  it("uses unique ids and complete presenter metadata", () => {
    const ids = scenes.map((scene) => scene.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(
      scenes.every(
        (scene) =>
          scene.title.length > 0 &&
          scene.summary.length > 0 &&
          scene.durationSeconds > 0 &&
          scene.notes.objective.length > 0 &&
          scene.notes.script.length > 0 &&
          scene.notes.keyMessage.length > 0 &&
          scene.notes.transition.length > 0 &&
          typeof scene.component === "function",
      ),
    ).toBe(true);
  });

  it("finds a scene by its typed id", () => {
    expect(getSceneById("05-right-model-for-task")?.shortTitle).toBe(
      "Modelo correcto",
    );
  });

  it("keeps the hardware section near eight and a half minutes", () => {
    const secondSectionDuration = scenes
      .filter((scene) => scene.section === "Qué necesita un modelo para correr")
      .reduce((total, scene) => total + scene.durationSeconds, 0);

    expect(secondSectionDuration).toBe(510);
  });

  it("keeps the local ecosystem section at approximately five minutes", () => {
    const sectionDuration = scenes
      .filter((scene) => scene.section === "Ecosistema local")
      .reduce((total, scene) => total + scene.durationSeconds, 0);

    expect(sectionDuration).toBe(300);
    expect(getSceneById("18-local-ai-terminal")?.mode).toBe("demo");
  });

  it("keeps the local demo section near seven minutes", () => {
    const sectionDuration = scenes
      .filter((scene) => scene.section === "Demo SLM + LLM local")
      .reduce((total, scene) => total + scene.durationSeconds, 0);

    expect(sectionDuration).toBe(440);
  });

  it("keeps the frontier and cloud section near five and a half minutes", () => {
    const sectionDuration = scenes
      .filter((scene) => scene.section === "Frontier + Local vs Cloud")
      .reduce((total, scene) => total + scene.durationSeconds, 0);

    expect(sectionDuration).toBe(325);
  });

  it("keeps the complete timed talk below forty minutes", () => {
    const sectionDuration = scenes
      .filter((scene) => scene.section === 'Home Labs + Tokens “Infinitos” + Cierre')
      .reduce((total, scene) => total + scene.durationSeconds, 0);
    const timedTalkDuration = scenes
      .filter((scene) => scene.id !== "00-opening-hold-screen")
      .reduce((total, scene) => total + scene.durationSeconds, 0);

    expect(sectionDuration).toBe(445);
    expect(SECTION_TARGET_SECONDS.Apertura).toBe(45);
    expect(timedTalkDuration).toBe(39 * 60 + 30);
  });
});
