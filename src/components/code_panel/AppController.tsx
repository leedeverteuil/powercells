import { Spreadsheet, SpreadsheetContext } from "@/lib/spreadsheet";
import DarkModeToggle from "../DarkModeToggle";
import { useEffect, useState } from "react";
import Toolbar from "../Toolbar";
import CellsGrid from "../CellsGrid";
import Footer from "../Footer";
import { CodePanel } from "./CodePanel";

const AppController = () => {
  const [spreadsheet, setSpreadsheet] = useState<Spreadsheet | null>(null);

  // start with data cleaning
  useEffect(() => {
    const initialSheet = Spreadsheet.fromStorage("dataCleaning");
    setSpreadsheet(initialSheet);
  }, []);

  // init and destroy
  useEffect(() => {
    spreadsheet?.init();
    // return spreadsheet?.destroy;
  }, [spreadsheet]);

  const handleSheetChange = (sheetKey: string) => {
    setSpreadsheet(Spreadsheet.fromStorage(sheetKey));
  };

  return (
    <SpreadsheetContext.Provider value={spreadsheet}>
      <main className="h-screen max-w-full overflow-hidden bg-white dark:bg-zinc-950">
        {/* left side */}
        <section className="overflow-hidden max-w-[calc(100%-27rem)]">
          <header className="flex items-center justify-between p-5 pb-3">
            <div className="space-y-0.5">
              <img
                src="/logo-light.svg"
                alt="powercells.js"
                className="block h-6 dark:hidden"
              />
              <img
                src="/logo-dark.svg"
                alt="powercells.js"
                className="hidden h-6 dark:block"
              />
              <p className="text-sm text-zinc-500">
                Spreadsheet empowered with JavaScript{" "}
                <span className="text-xs text-zinc-400 dark:text-zinc-600">
                  (prototype)
                </span>
              </p>
            </div>

            <DarkModeToggle />
          </header>

          <Toolbar />
          <CellsGrid />
          <Footer handleSheetChange={handleSheetChange} sheetKey={spreadsheet?.key ?? ""} />
        </section>

        {/* right side */}
        <section className="fixed right-0 top-0 w-[27rem] h-full border-l border-colors">
          <CodePanel />
        </section>
      </main>
    </SpreadsheetContext.Provider>
  );
};

export default AppController;
