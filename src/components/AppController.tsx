import { Spreadsheet, SpreadsheetContext } from "@/lib/spreadsheet";
import DarkModeToggle from "./DarkModeToggle";
import { useEffect, useState } from "react";
import Toolbar from "./Toolbar";
import CellsGrid from "./CellsGrid";
import Footer from "./Footer";
import { CodePanel } from "./code_panel/CodePanel";
import { Toaster } from "./ui/toaster";
import { TaintedSpreadsheetDialog } from "./TaintedSpreadsheetDialog";

const AppController = () => {
  const [spreadsheet, setSpreadsheet] = useState<Spreadsheet | null>(null);
  const [taintedAlert, setTaintedAlert] = useState<{
    open: boolean;
    sheetKey: string | null;
  }>({ open: false, sheetKey: null });

  // start with data cleaning
  useEffect(() => {
    const initialSheet = Spreadsheet.fromStorage("compoundInterest");
    setSpreadsheet(initialSheet);
  }, []);

  // init and destroy
  useEffect(() => {
    spreadsheet?.init();
  }, [spreadsheet]);

  const handleSheetChange = (sheetKey: string) => {
    if (spreadsheet && spreadsheet.tainted) {
      setTaintedAlert({ open: true, sheetKey });
    } else {
      setSpreadsheet(Spreadsheet.fromStorage(sheetKey));
    }
  };

  const handleConfirmDespiteTainted = () => {
    const { sheetKey } = taintedAlert;
    if (sheetKey) {
      setSpreadsheet(Spreadsheet.fromStorage(sheetKey));
      setTaintedAlert({ open: false, sheetKey: null });
    }
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
          <Footer
            handleSheetChange={handleSheetChange}
            sheetKey={spreadsheet?.key ?? ""}
          />
        </section>

        {/* right side */}
        <section className="fixed right-0 top-0 w-[27rem] h-full border-l border-colors">
          <CodePanel />
        </section>
      </main>

      <Toaster />
      <TaintedSpreadsheetDialog
        open={taintedAlert.open}
        onClose={() => setTaintedAlert({ open: false, sheetKey: null })}
        handleConfirm={handleConfirmDespiteTainted}></TaintedSpreadsheetDialog>
    </SpreadsheetContext.Provider>
  );
};

export default AppController;
