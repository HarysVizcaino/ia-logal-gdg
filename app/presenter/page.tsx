import type { Metadata } from "next";

import { PresenterView } from "../_presentation/presenter-view";
import { LocalDemoProvider } from "../_presentation/local-demo/local-demo-context";
import { CloudDemoProvider } from "../_presentation/cloud-demo/cloud-demo-context";
import "./presenter.css";

export const metadata: Metadata = {
  title: "Presenter Console · IA Local",
  description: "Vista privada del ponente para la presentación IA Local.",
};

export default function PresenterPage() {
  return (
    <CloudDemoProvider>
      <LocalDemoProvider>
        <PresenterView />
      </LocalDemoProvider>
    </CloudDemoProvider>
  );
}
