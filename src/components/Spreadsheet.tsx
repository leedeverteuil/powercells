import { spreadsheet } from "@/lib/spreadsheet";
import CellsGrid from "./CellsGrid";
import Footer from "./Footer";
import Toolbar from "./Toolbar";
import { useEffect } from "react";

const Spreadsheet = () => {
  useEffect(() => {
    spreadsheet.init();
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
