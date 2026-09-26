// Launcher for the preview pane: runs the Hydrogen dev server from this folder.
import {spawn} from 'node:child_process';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const cwd = dirname(fileURLToPath(import.meta.url));
const p = spawn('npm run dev -- --port 3000', {cwd, stdio: 'inherit', shell: true});
p.on('exit', (c) => process.exit(c ?? 0));
