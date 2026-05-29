import { spawn } from "node:child_process";
import { openSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = openSync(join(process.cwd(), "next-start.log"), "a");
const err = openSync(join(process.cwd(), "next-start.err.log"), "a");

const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-p", process.env.PORT ?? "3000"],
  {
    cwd: process.cwd(),
    detached: true,
    stdio: ["ignore", out, err],
    windowsHide: true
  }
);

child.unref();
writeFileSync(join(process.cwd(), ".next-server.pid"), String(child.pid));
console.log(`WalProof server started with PID ${child.pid}`);
