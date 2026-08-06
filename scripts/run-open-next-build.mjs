import { spawnSync } from "node:child_process";

const command = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(command, ["exec", "--", "opennextjs-cloudflare", "build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, POXIOL_OPENNEXT_BUILD: "1" },
});
process.exit(result.status ?? 1);