const bun = Bun.which("bun") ?? "bun";

const nextProc = Bun.spawn({
  cmd: [bun, "run", "dev:next"],
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});

const wsProc = Bun.spawn({
  cmd: [bun, "run", "dev:ws"],
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});

let shuttingDown = false;
let exited = false;

const stopAll = () => {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const proc of [nextProc, wsProc]) {
    try {
      proc.kill();
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

nextProc.exited.then((code) => exit(code, "next"));
wsProc.exited.then((code) => {
  if (code !== 0) {
    exit(code, "ws");
  }
});

await new Promise(() => {});
