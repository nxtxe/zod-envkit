import { env } from "@/lib/env";

export default function HomePage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Next + zod-envkit</h1>
      <p>Environment validated at build/start.</p>
      <ul>
        <li>
          <strong>NODE_ENV:</strong> {env.NODE_ENV}
        </li>
        <li>
          <strong>LOG_LEVEL:</strong> {env.LOG_LEVEL}
        </li>
        <li>
          <strong>API_SECRET:</strong> *** (server-only)
        </li>
      </ul>
    </main>
  );
}
