import { getRequestContext } from "@cloudflare/next-on-pages";

type KVStatus = ReturnType<typeof getRequestContext>["env"]["KV_status"];

// Records a successful request. Always updates the "up" timestamp.
export async function markUp(kv: KVStatus): Promise<void> {
  await kv.put("up", new Date().toISOString());
}

// Records a failed request. Only writes the "down" timestamp on the transition
// from up to down, so the "Issues since" banner reflects when problems started
// rather than the most recent failure.
export async function markDown(kv: KVStatus): Promise<void> {
  const [lastUp, lastDown] = await Promise.all([kv.get("up"), kv.get("down")]);

  const alreadyDown = lastDown !== null && (lastUp === null || lastDown > lastUp);
  if (alreadyDown) {
    return;
  }

  await kv.put("down", new Date().toISOString());
}
