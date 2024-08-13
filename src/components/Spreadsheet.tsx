import { spreadsheet } from "@/lib/spreadsheet";
import CellsGrid from "./CellsGrid";
import Footer from "./Footer";
import Toolbar from "./Toolbar";
import { useEffect } from "react";
import type { PrivateCellNormal } from "@/lib/cell_types";

const Spreadsheet = () => {
  useEffect(() => {
    spreadsheet.init();

    //! testing
    setTimeout(() => {
      const cell = spreadsheet.getCell({ row: 0, col: 0 }) as PrivateCellNormal;
      cell.setValue("Hello World");

      const cell2 = spreadsheet.getCell({ row: 5, col: 5 }) as PrivateCellNormal;
      cell2.setValue("Hello World");

      console.log("set to hello");

    }, 3000);

    return spreadsheet.destroy;
  }, []);

  return (
    <>
      <Toolbar />
      <CellsGrid />
      <Footer />
    </>
  );
};

export default Spreadsheet;
