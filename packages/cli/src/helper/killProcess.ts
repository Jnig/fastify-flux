import pidtree from 'pidtree';

export async function killProcess(pid: number) {
  try {
    const pids = await pidtree(pid, { root: true });
    pids.map((el) => {
      process.kill(el);
    });
  } catch {}
}
