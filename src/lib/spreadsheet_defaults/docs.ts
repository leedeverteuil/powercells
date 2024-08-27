import type { SpreadsheetSerialized } from "../spreadsheet";

export const docs: SpreadsheetSerialized = {
  "key": "docs",
  "grid": [
    null,
    [
      null,
      {
        "type": "normal",
        "location": {
          "row": 1,
          "col": 1
        },
        "value": "How calculate works -------->",
        "format": null,
        "calculate": null,
        "style": {
          "bold": false,
          "italic": false,
          "underline": false
        }
      },
      {
        "type": "normal",
        "location": {
          "row": 1,
          "col": 2
        },
        "value": "Hello World!",
        "format": null,
        "calculate": "/*\nThe value you return will be set as this \ncell's value. Calculate() will run when:\n  - the spreadsheet first loads\n  - you click \"Recalculate all\"\n  - you click \"Run\" for this cell\n  - a dependency of this cell changes\n    - this is explained later on\n*/\n\n// try changing this value, save changes and  click \"Run\"\nreturn \"Hello World!\";",
        "style": {
          "bold": true,
          "italic": false,
          "underline": false
        }
      }
    ],
    [
      null,
      {
        "type": "normal",
        "location": {
          "row": 2,
          "col": 1
        },
        "value": "Get another cell's value ------>",
        "format": null,
        "calculate": null,
        "style": {
          "bold": false,
          "italic": false,
          "underline": false
        }
      },
      {
        "type": "normal",
        "location": {
          "row": 2,
          "col": 2
        },
        "value": 100,
        "format": null,
        "calculate": "// get the value of another cell\nconst D2 = get(\"D2\");\n\n// you can also use this comma syntax\n// numbers instead\n// (col, row)\nconst alsoD2 = get(\"3,2\");\n\nreturn D2 + 1;",
        "style": {
          "bold": true,
          "italic": false,
          "underline": false
        }
      },
      {
        "type": "normal",
        "location": {
          "row": 2,
          "col": 3
        },
        "value": 99,
        "format": null,
        "calculate": null,
        "style": {
          "bold": false,
          "italic": false,
          "underline": false
        }
      }
    ],
    [
      null,
      {
        "type": "normal",
        "location": {
          "row": 3,
          "col": 1
        },
        "value": "Get multiple cells' values ---->",
        "format": null,
        "calculate": null,
        "style": {
          "bold": false,
          "italic": false,
          "underline": false
        }
      },
      {
        "type": "normal",
        "location": {
          "row": 3,
          "col": 2
        },
        "value": 60,
        "format": null,
        "calculate": "// use the colon \":\" syntax to denote\n// a range of cells\nconst values = get(\"D3:F3\");\n\n// you can also use the comma syntax\n// const values = get(\"3,3:5,3\");\n\nlet total = 0;\nfor (const v of values) {\n  total += v;\n}\n\nreturn total;",
        "style": {
          "bold": true,
          "italic": false,
          "underline": false
        }
      },
      {
        "type": "normal",
        "location": {
          "row": 3,
          "col": 3
        },
        "value": 10,
        "format": null,
        "calculate": null,
        "style": {
          "bold": false,
          "italic": false,
          "underline": false
        }
      },
      {
        "type": "normal",
        "location": {
          "row": 3,
          "col": 4
        },
        "value": 20,
        "format": null,
        "calculate": null,
        "style": {
          "bold": false,
          "italic": false,
          "underline": false
        }
      },
      {
        "type": "normal",
        "location": {
          "row": 3,
          "col": 5
        },
        "value": 30,
        "format": null,
        "calculate": null,
        "style": {
          "bold": false,
          "italic": false,
          "underline": false
        }
      }
    ],
    [
      null,
      {
        "type": "normal",
        "location": {
          "row": 4,
          "col": 1
        },
        "value": "Get causes dependencies --->",
        "format": null,
        "calculate": null,
        "style": {
          "bold": false,
          "italic": false,
          "underline": false
        }
      },
      {
        "type": "normal",
        "location": {
          "row": 4,
          "col": 2
        },
        "value": "D4 is 999",
        "format": null,
        "calculate": "// when you call get(...) it starts to track\n// that cell (or a range of cells) as\n// dependencies. \nconst D4 = get(\"D4\")\n\n// try updating D4 (cell next to this one)\n// and this function will re-run \n// automatically!\nreturn `D4 is ${D4}`;",
        "style": {
          "bold": true,
          "italic": false,
          "underline": false
        }
      },
      {
        "type": "normal",
        "location": {
          "row": 4,
          "col": 3
        },
        "value": 999,
        "format": null,
        "calculate": null,
        "style": {
          "bold": false,
          "italic": false,
          "underline": false
        }
      }
    ],
    [
      null,
      {
        "type": "normal",
        "location": {
          "row": 5,
          "col": 1
        },
        "value": "Setting other cell values ----->",
        "format": null,
        "calculate": null,
        "style": {
          "bold": false,
          "italic": false,
          "underline": false
        }
      },
      {
        "type": "normal",
        "location": {
          "row": 5,
          "col": 2
        },
        "value": "Unlimited power!",
        "format": null,
        "calculate": "// you can also set other cell's values\n// in here too\n// ... although this might be better suited \n// for a \"Button\" cell\nset(\"D5\", \"Set by C5\");\n\n// you can also set a whole range of cells\n// set(\"D5:F5\", \"Set by C5\");\n\nreturn \"Unlimited power!\";",
        "style": {
          "bold": true,
          "italic": false,
          "underline": false
        }
      },
      {
        "type": "normal",
        "location": {
          "col": 3,
          "row": 5
        },
        "value": "Set by C5",
        "format": null,
        "calculate": null,
        "style": {
          "bold": false,
          "italic": false,
          "underline": false
        }
      }
    ],
    [
      null,
      {
        "type": "normal",
        "location": {
          "row": 6,
          "col": 1
        },
        "value": "Update alternative ---------->",
        "format": null,
        "calculate": null,
        "style": {
          "bold": false,
          "italic": false,
          "underline": false
        }
      },
      {
        "type": "normal",
        "location": {
          "row": 6,
          "col": 2
        },
        "value": "No strings attached!",
        "format": null,
        "calculate": "// There is also an update function.\n// Useful because you do not have to call\n// get() first to retrieve a value\nupdate(\"D6\", (d6) => d6 + 5);\n\n// Also, unlike get(), update() does not\n// add dependency tracking. So this\n// calculate will not re-run when the\n// mentioned cells change.\n\nreturn \"No strings attached!\";",
        "style": {
          "bold": true,
          "italic": false,
          "underline": false
        }
      },
      {
        "type": "normal",
        "location": {
          "row": 6,
          "col": 3
        },
        "value": 20,
        "format": null,
        "calculate": null,
        "style": {
          "bold": false,
          "italic": false,
          "underline": false
        }
      }
    ],
    [
      null,
      {
        "type": "normal",
        "location": {
          "row": 7,
          "col": 1
        },
        "value": "Buttons -------------------->",
        "format": null,
        "calculate": null,
        "style": {
          "bold": false,
          "italic": false,
          "underline": false
        }
      },
      {
        "type": "button",
        "location": {
          "row": 7,
          "col": 2
        },
        "label": "Click me!",
        "buttonStyle": "primary",
        "action": "// buttons do stuff when clicked\n\n// button's don't re-run when dependency \n// changes btw\nset(\"D7\", Math.floor(Math.random() * 10000));"
      },
      {
        "type": "normal",
        "location": {
          "row": 7,
          "col": 3
        },
        "value": 4779,
        "format": null,
        "calculate": null,
        "style": {
          "bold": false,
          "italic": false,
          "underline": false
        }
      }
    ],
    [
      null,
      {
        "type": "normal",
        "location": {
          "row": 8,
          "col": 1
        },
        "value": "Timers --------------------->",
        "format": null,
        "calculate": null,
        "style": {
          "bold": false,
          "italic": false,
          "underline": false
        }
      },
      {
        "type": "timer",
        "location": {
          "row": 8,
          "col": 2
        },
        "label": "Timer",
        "loopTimeMs": 1500,
        "paused": false,
        "action": "// timers run an action on an interval\nlet msg = get(\"D8\");\nconst completeMsg = \"Hello World!\";\n\nif (msg.length === completeMsg.length) {\n  set(\"D8\", \"\");\n}\nelse {\n  set(\"D8\", completeMsg.slice(0, msg.length + 1));\n}"
      },
      {
        "type": "normal",
        "location": {
          "row": 8,
          "col": 3
        },
        "value": "Hello Wo",
        "format": null,
        "calculate": null,
        "style": {
          "bold": false,
          "italic": false,
          "underline": false
        }
      }
    ]
  ],
  "customColSizes": [
    null,
    180,
    156
  ]
};