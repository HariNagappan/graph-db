/* ==========================================================================
   Builds both deliverables from one source of truth:
     design/GraphNet-Interactive Prototype.html
     design/GraphNet-Infinite Canvas.html
   Run: node design/src/build.mjs
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const srcDir = path.join(root, 'design', 'src');
const outDir = path.join(root, 'design');

const read = (p) => fs.readFileSync(path.join(srcDir, p), 'utf8');
const theme = read('theme.css');
const app = read('app.js');
const boot = read('boot.js');

const SKILL = 'C:\\Users\\Haris\\AppData\\Roaming\\AutoClaw-oversea-official\\accounts\\b064c7b98cc25d90effbe3ddc17213d6d9bf312cf64756913578a859ca1f758d\\runtime\\pi-resources\\revisions\\c82d0b23ec4e77627f3a6cc99ed05711b33c406f74eba7d484b2b724ffe31fd3\\skills\\design-core-rules';
const ADAPT = path.join(SKILL, 'scripts', 'adapt-canvas.mjs');
const BASE = path.join(srcDir, '.canvas-base.html');

function must(cond, msg) { if (!cond) throw new Error(msg); }
function once(hay, needle, label) {
  const n = hay.split(needle).length - 1;
  must(n === 1, `anchor "${label}" found ${n} times`);
  return hay.indexOf(needle);
}

/* --------------------------------------------------------------- prototype */
const protoReset = `
  html, body { margin: 0; padding: 0; height: 100%; background: #06070e; }
  #root { height: 100%; }
  body { overscroll-behavior: none; }
`;

const prototype = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GraphNet · Interactive Prototype</title>
<style>${protoReset}${theme}</style>
</head>
<body>
<div id="root"></div>
<script>${app}</script>
<script>${boot}</script>
</body>
</html>
`;
fs.writeFileSync(path.join(outDir, 'GraphNet-Interactive Prototype.html'), prototype, 'utf8');

/* ------------------------------------------------------------------ canvas */
if (!fs.existsSync(BASE)) {
  execFileSync(process.execPath, [ADAPT, BASE], { stdio: 'inherit' });
}

let canvas = fs.readFileSync(BASE, 'utf8');

/* 0. document title (the template ships an empty <title>) */
canvas = canvas.replace('<title></title>', '<title>GraphNet · Design Delivery</title>');

/* 1. canvas chrome colours follow the project palette */
const chromeCss = `
  :root {
    --accent: #8e6fff;
    --accent-dim: rgba(142, 111, 255, 0.16);
    --note-bg: #171327;
    --note-border: rgba(142, 111, 255, 0.22);
  }
${theme}
`;
{
  const i = canvas.lastIndexOf('</style>');
  must(i > -1, 'no </style>');
  canvas = canvas.slice(0, i) + chromeCss + canvas.slice(i);
}

/* 2. app module available to the canvas scene */
{
  const i = once(canvas, '\n<script>\n(() => {', 'template script');
  canvas = canvas.slice(0, i) + `\n<script>${app}</script>` + canvas.slice(i);
}

/* 3. canvas strings */
{
  const start = canvas.indexOf('  const UI_STRINGS = {');
  must(start > -1, 'UI_STRINGS start');
  const endMark = canvas.indexOf('\n  };\n', start);
  must(endMark > -1, 'UI_STRINGS end');
  const end = endMark + '\n  };\n'.length;
  const block = `  const UI_STRINGS = {
    docTitle: 'GraphNet · Design Delivery',
    sections: {
      context: '01 PROJECT CONTEXT',
      designSystem: '02 DESIGN SYSTEM',
      deliverables: '03 DESIGN DELIVERABLES'
    },
    zoom: { zoomIn: 'Zoom in', zoomOut: 'Zoom out', reset: 'Reset view' },
    kbdHints: [['Scroll', 'pan'], ['Ctrl / \\u2318 + Scroll', 'zoom'], ['Ctrl / \\u2318 + Z', 'undo']]
  };
`;
  canvas = canvas.slice(0, start) + block + canvas.slice(end);
}

/* 4. canvas scene */
const scene = read('canvas-scene.js');
{
  const start = canvas.indexOf('  function initDemo() {');
  must(start > -1, 'initDemo start');
  const end = canvas.lastIndexOf('  initDemo();');
  must(end > start, 'initDemo call');
  canvas = canvas.slice(0, start) + scene + canvas.slice(end + '  initDemo();'.length);
}

/* 5. initial view: open on the project context row, fully visible */
{
  const anchor = `  const r = viewport.getBoundingClientRect();
  panX = r.width * 0.04;
  panY = r.height * 0.04;
  updateTransform();`;
  must(canvas.includes(anchor), 'initial view anchor');
  canvas = canvas.replace(anchor, `  const r = viewport.getBoundingClientRect();
  const targetW = 1480;
  zoom = Math.max(0.18, Math.min(1, (r.width - 48) / targetW));
  panX = 24;
  panY = 12;
  updateTransform();`);
}

fs.writeFileSync(path.join(outDir, 'GraphNet-Infinite Canvas.html'), canvas, 'utf8');

console.log('built:');
console.log('  design/GraphNet-Interactive Prototype.html');
console.log('  design/GraphNet-Infinite Canvas.html');
