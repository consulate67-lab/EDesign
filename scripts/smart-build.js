#!/usr/bin/env node
/**
 * Build script that's safe to run on Railway (where only the backend is
 * needed and the React frontend is shipped separately via GitHub Pages).
 *
 * Rules:
 *   - If ./src exists AND has .ts/.tsx files  → run the full frontend build
 *     (tsc -p tsconfig.app.json && vite build). This is the normal dev flow.
 *   - If ./src does NOT exist OR is empty     → skip the frontend build.
 *     Railway's container only needs the Express server (server/index.js).
 *     The frontend lives in GitHub Pages, not in this container.
 *
 * Result: the script always exits 0, so Railway / CI / local dev never
 * break with TS18003 ("no inputs found in config file") on server-only
 * environments.
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';

const SRC_DIR = './src';

const hasFrontendSource = (() => {
    if (!existsSync(SRC_DIR)) return false;
    try {
        const stat = statSync(SRC_DIR);
        if (!stat.isDirectory()) return false;
    } catch {
        return false;
    }
    const stack = [SRC_DIR];
    while (stack.length > 0) {
        const dir = stack.pop();
        for (const entry of readdirSync(dir)) {
            const full = `${dir}/${entry}`;
            const s = statSync(full);
            if (s.isDirectory()) stack.push(full);
            else if (/\.tsx?$/.test(entry)) return true;
        }
    }
    return false;
})();

if (hasFrontendSource) {
    console.log('[build] Frontend source detected — running tsc + vite build');
    execSync('tsc -p tsconfig.app.json && vite build', { stdio: 'inherit' });
} else {
    console.log('[build] No frontend source detected — skipping (server-only environment, e.g. Railway backend)');
}
