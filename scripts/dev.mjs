import { spawn } from "node:child_process";

const childProcesses = [];

function spawnProc(command, args, name) {
  const proc = spawn(command, args, {
    stdio: "inherit",
    env: process.env,
  });

  proc.on("error", (error) => {
    console.error(`[webslides] Failed to start ${name}:`, error);
    exit(1, name);
  });

  childProcesses.push(proc);
  return proc;
}

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const viteProc = spawnProc(npmCommand, ["run", "dev:vite"], "vite");
const wsProc = spawnProc(npmCommand, ["run", "dev:ws"], "ws");

let shuttingDown = false;
let exited = false;

const stopAll = () => {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const proc of childProcesses) {
    try {
      proc.kill("SIGTERM");
    } catch {
      // ignore kill failures
    }
  }
};

const exit = (code, name) => {
  if (exited) return;
  exited = true;

  stopAll();

  if (code !== 0) {
    console.error(`[webslides] ${name} exited with code ${code}`);
  }

  process.exit(code ?? 0);
};

for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.on(signal, () => {
    stopAll();
  });
}

viteProc.on("exit", (code) => exit(code, "vite"));
wsProc.on("exit", (code) => {
  if (code !== 0) {
    exit(code, "ws");
  }
});

await new Promise(() => {});
