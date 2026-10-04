import { PresentationShell } from "./_presentation";
import { LocalDemoProvider } from "./_presentation/local-demo/local-demo-context";
import { CloudDemoProvider } from "./_presentation/cloud-demo/cloud-demo-context";

export default function Home() {
  return (
    <CloudDemoProvider>
      <LocalDemoProvider>
        <PresentationShell />
      </LocalDemoProvider>
    </CloudDemoProvider>
  );
}
