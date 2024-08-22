import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Console } from "./console/Console";
import { useRenderSubscriber } from "@/lib/render_subscriber";
import { useEffect, useRef, useState } from "react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

const Footer = () => {
  const [tab, setTab] = useState("sheets");

  const lastUpdateTs = useRenderSubscriber(["console"]);
  const firstUpdate = useRef(true);

  // switch to console when new errors come up
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (tab !== "console") {
      setTab("console");
    }
  }, [lastUpdateTs]);

  const onTabChanged = (tab: string) => {
    setTab(tab);
  };

  return (
    <footer className="fixed bottom-0 p-5 pt-3 border-t border-colors z-[3] dark:bg-zinc-950 bg-white w-[calc(100%-27rem)]">
      <Tabs
        defaultValue="sheets"
        value={tab}
        onValueChange={onTabChanged}
        className="">
        {/* all example sheets will be visible here */}
        <TabsContent value="sheets" className="mb-2">
          <div className="flex items-center h-5 space-x-1 text-sm">
            <Button variant="ghost">Data Cleaning</Button>
            <Separator orientation="vertical" />
            <Button variant="ghost">Weather API</Button>
            <Separator orientation="vertical" />
            <Button variant="ghost">Game of Life</Button>
            <Separator orientation="vertical" />
            <Button variant="ghost">Blank</Button>
          </div>
        </TabsContent>

        {/* console will be visible here */}
        <TabsContent value="console">
          <Console></Console>
        </TabsContent>

        <TabsList className="mt-2">
          <TabsTrigger value="sheets">Sheets</TabsTrigger>
          <TabsTrigger value="console">Output</TabsTrigger>
        </TabsList>
      </Tabs>
    </footer>
  );
};

export default Footer;
