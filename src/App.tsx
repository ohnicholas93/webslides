import "katex/dist/katex.min.css";
import "@/app/globals.css";

import Deck from "@/app/page";
import AppHeader from "@/core/app-header";
import { PresentationSettingsProvider } from "@/core/presentation-settings";

export default function App() {
  return (
    <PresentationSettingsProvider>
      <div
        className="grid min-h-screen grid-rows-[auto_1fr]"
        data-webslides-shell
      >
        <AppHeader />
        <div className="overflow-auto">
          <Deck />
        </div>
      </div>
    </PresentationSettingsProvider>
  );
}
