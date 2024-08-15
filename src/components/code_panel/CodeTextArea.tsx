import { cleanCodeForInnerHTML, preventTabbingOut } from "@/lib/code_editor";
import hljs from "highlight.js";
import { useEffect, useRef } from "react";

type Props = {
  id: string;
  value: string;
  onInput: (value: string) => void;
};

export const CodeTextArea = ({ id, value, onInput }: Props) => {
  const codeRef = useRef<HTMLElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    onInput(e.currentTarget.value);
    syncScroll();
  };

  const sharedStyle =
    "absolute top-0 left-0 flex w-full h-[300px] px-3 py-2 text-sm rounded-md overflow-auto whitespace-pre-wrap";

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const didTab = preventTabbingOut(e);
    if (didTab) {
      onInput(e.currentTarget.value);
    }
  };

  const syncScroll = () => {
    const codeEl = codeRef.current;
    const textAreaEl = textAreaRef.current;
    if (codeEl && textAreaEl) {
      codeEl.scrollTop = textAreaEl.scrollTop;
      codeEl.scrollLeft = textAreaEl.scrollLeft;
    }
  };

  useEffect(() => {
    const codeEl = codeRef.current;
    if (codeEl) {
      codeEl.dataset.highlighted = "";
      codeEl.innerHTML = cleanCodeForInnerHTML(value);
      hljs.highlightElement(codeEl);
    }
  }, [value, codeRef.current]);

  return (
    <div className="relative h-[300px] bg-zinc-950 rounded-md dark:border dark:border-zinc-800">
      <textarea
        ref={textAreaRef}
        rows={12}
        id={id}
        value={value}
        onInput={handleInput}
        onScroll={syncScroll}
        spellCheck={false}
        onKeyDown={onKeyDown}
        className={`${sharedStyle} font-mono font-medium tracking-tight text-transparent bg-transparent
                  caret-zinc-50 z-[5] focus:outline-none resize-none`}></textarea>
      <pre className={`${sharedStyle} z-[4]`} aria-hidden="true">
        <code
          ref={codeRef}
          className="block w-full overflow-auto font-mono font-medium tracking-tight whitespace-pre-wrap javascript"></code>
      </pre>
    </div>
  );
};
