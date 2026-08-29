import { spawnSync } from "node:child_process";
import process from "node:process";

const isVercel = process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV);

const command = isVercel
  ? [process.execPath, "node_modules/next/dist/bin/next", "build"]
  : process.platform === "win32"
    ? [process.execPath, "node_modules/vinext/dist/cli.js", "build"]
    : ["bash", "scripts/build-verified.sh"];

console.log(`Building for ${isVercel ? "Vercel (Next.js)" : "Sites (Vinext)"}...`);

const result = spawnSync(command[0], command.slice(1), {
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
