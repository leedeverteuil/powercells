import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import type { UserCalculateFunction, UserFormatFunction } from './cells/cell_normal';
import type { UserButtonActionFunction } from './cells/cell_button';

const ampRegex = new RegExp("&", "g");
const leftBracketRegex = new RegExp("<", "g");
const rightBracketRegex = new RegExp(">", "g");
const AsyncFunction = async function () { }.constructor;

// register languages
hljs.registerLanguage('javascript', javascript);

export function preventTabbingOut(e: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  if (e.key == "Tab") {
    const target = e.currentTarget;
    e.preventDefault();

    const start = target.selectionStart;
    const end = target.selectionEnd;

    target.value = target.value.substring(0, start) + "  " + target.value.substring(end);
    target.selectionStart = target.selectionEnd = start + 2;

    return true;
  }

  return false;
}

export function getFunctionBody(func: Function | null) {
  const funcStr = func?.toString() ?? ""

  // remove top two lines and last line
  let lines = funcStr.split("\n");
  lines = lines.filter((_, i) => {
    return i !== 0 && i !== 1 && i !== lines.length - 1;
  });

  return lines.join("\n");
}

export function buildCalculateFunction(funcStr: string): UserCalculateFunction {
  return AsyncFunction("value", "get", "set", "update", funcStr) as UserCalculateFunction;
}

export function buildFormatFunction(funcStr: string): UserFormatFunction {
  return Function("value", funcStr) as UserFormatFunction;
}

export function buildButtonActionFunction(funcStr: string): UserButtonActionFunction {
  return AsyncFunction("get", "set", "update", funcStr) as UserButtonActionFunction;
}

export function cleanCodeForInnerHTML(code: string) {
  code = code.replace(ampRegex, "&").replace(leftBracketRegex, "<").replace(rightBracketRegex, ">");

  // last char newlines replace with space at end so it gets rendered
  if (code[code.length - 1] == "\n") {
    code += " ";
  }

  return code;
}
