import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET() {
  const kv = getRequestContext().env.KV_status;
  const [lastUp, lastDown] = await Promise.all([kv.get("up"), kv.get("down")]);

  const isDown = lastDown !== null && (lastUp === null || lastDown > lastUp);

  return new Response(
    JSON.stringify({ up: !isDown, downSince: isDown ? lastDown : null }),
    { headers: { "Content-Type": "application/json" } },
  );
}
