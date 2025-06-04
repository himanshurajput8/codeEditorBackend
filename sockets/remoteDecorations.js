// remoteDecorations.js
const userColors = {}; // Map userId -> color
const decorations = {}; // Map userId -> decoration ids

const colorPalette = [
  'pink', 'orange', 'limegreen', 'cyan', 'violet', 'salmon', '#00bcd4'
];

function getUserColor(userId) {
  if (!userColors[userId]) {
    const index = Object.keys(userColors).length % colorPalette.length;
    userColors[userId] = colorPalette[index];
  }
  return userColors[userId];
}

export function updateRemoteCursor(editor, userId, username, lineNumber, column) {
  const color = getUserColor(userId);

  const cursorClass = `remote-cursor-${userId}`;
  const labelClass = `remote-cursor-label-${userId}`;

  injectStyle(cursorClass, `
    .${cursorClass} {
      border-left: 2px solid ${color};
      height: 100%;
      position: absolute;
      margin-left: -1px;
      z-index: 1000;
      pointer-events: none;
    }
  `);

  injectStyle(labelClass, `
    .${labelClass} {
      background-color: ${color}20;
      color: ${color};
      border: 1px solid ${color};
      padding: 2px 6px;
      font-size: 12px;
      font-weight: bold;
      pointer-events: none;
      z-index: 1000;
      border-radius: 4px;
    }
  `);

  const newDecorations = editor.deltaDecorations(
    decorations[userId] || [],
    [{
      range: new monaco.Range(lineNumber, column, lineNumber, column),
      options: {
        className: cursorClass,
        afterContentClassName: labelClass,
        after: {
          content: username,
        },
        stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
      },
    }]
  );

  decorations[userId] = newDecorations;
}

export function updateRemoteSelection(editor, userId, selection) {
  const color = getUserColor(userId);
  const selectionClass = `remote-selection-${userId}`;

  injectStyle(selectionClass, `
    .${selectionClass} {
      background-color: ${color}55;
      border-radius: 2px;
    }
  `);

  const newDecorations = editor.deltaDecorations(
    decorations[userId] || [],
    [{
      range: new monaco.Range(
        selection.startLineNumber,
        selection.startColumn,
        selection.endLineNumber,
        selection.endColumn
      ),
      options: {
        className: selectionClass,
      },
    }]
  );

  decorations[userId] = newDecorations;
}

function injectStyle(className, css) {
  if (!document.getElementById(className)) {
    const style = document.createElement('style');
    style.id = className;
    style.innerHTML = css;
    document.head.appendChild(style);
  }
}
