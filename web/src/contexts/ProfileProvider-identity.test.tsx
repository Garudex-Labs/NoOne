// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { $appName, DEFAULT_APP_NAME, applyAppIdentity } from "@noone/shared/application-identity";
import { api, setManagementProfile } from "@/lib/api";
import { ProfileProvider } from "./ProfileProvider";
import { useProfileScope } from "./useProfileScope";

let container: HTMLDivElement;
let root: Root;
let fetchMock: ReturnType<typeof vi.fn<typeof fetch>>;
let configReads: number;
let readConfig: () => Response | Promise<Response>;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function Probe() {
  const { profile, setProfile } = useProfileScope();
  return <button data-profile={profile} onClick={() => setProfile("beta")} />;
}

async function mount() {
  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={["/config?profile=alpha"]}>
        <ProfileProvider><Probe /></ProfileProvider>
      </MemoryRouter>,
    );
  });
}

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.useFakeTimers();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  setManagementProfile("");
  applyAppIdentity(null);
  configReads = 0;
  fetchMock = vi.fn<typeof fetch>(async (url, init) => {
    if (url === "/api/profiles") return jsonResponse({ profiles: [{ name: "alpha" }, { name: "beta" }] });
    if (url === "/api/profiles/active") return jsonResponse({ current: "default", active: "default" });
    if (String(url).startsWith("/api/config?profile=")) {
      if (init?.method === "PUT") return jsonResponse({ ok: true });
      configReads += 1;
      return readConfig();
    }
    throw new Error(`Unexpected request: ${String(url)}`);
  });
  vi.stubGlobal("fetch", fetchMock);
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  setManagementProfile("");
  applyAppIdentity(null);
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("ProfileProvider identity hydration through the real API", () => {
  it("retries config readiness and stops fetching after successful hydration", async () => {
    readConfig = () => configReads < 3
      ? jsonResponse({ detail: "Backend is starting" }, 503)
      : jsonResponse({ display: { app_name: "Ready alpha" } });
    applyAppIdentity({ display: { app_name: "Previous profile" } });

    await mount();
    expect($appName.get()).toBe(DEFAULT_APP_NAME);
    expect(configReads).toBe(1);

    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
    expect(configReads).toBe(2);
    expect($appName.get()).toBe(DEFAULT_APP_NAME);
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
    expect(configReads).toBe(3);
    expect($appName.get()).toBe("Ready alpha");

    await act(async () => { await api.saveConfig({ display: { app_name: "Saved alpha" } }); });
    expect($appName.get()).toBe("Saved alpha");
    await act(async () => { await vi.advanceTimersByTimeAsync(60_000); });
    expect(configReads).toBe(3);
    expect($appName.get()).toBe("Saved alpha");
  });

  it("does not republish an older hydration response after a same-profile save", async () => {
    let resolve!: (response: Response) => void;
    readConfig = () => new Promise<Response>((done) => { resolve = done; });
    await mount();

    await act(async () => { await api.saveConfig({ display: { app_name: "Fresh saved alpha" } }); });
    expect($appName.get()).toBe("Fresh saved alpha");
    await act(async () => { resolve(jsonResponse({ display: { app_name: "Old hydration" } })); });

    expect($appName.get()).toBe("Fresh saved alpha");
    expect(configReads).toBe(1);
  });

  it("cancels an old profile's scheduled readiness retry when switching profiles", async () => {
    readConfig = () => configReads === 1
      ? jsonResponse({ detail: "Backend is starting" }, 503)
      : jsonResponse({ display: { app_name: "Ready beta" } });
    await mount();
    expect(configReads).toBe(1);

    await act(async () => { container.querySelector("button")!.click(); });
    expect(container.querySelector("button")!.dataset.profile).toBe("beta");
    expect($appName.get()).toBe("Ready beta");
    await act(async () => { await vi.advanceTimersByTimeAsync(60_000); });

    expect(configReads).toBe(2);
    expect(fetchMock.mock.calls.filter(([url]) => String(url).startsWith("/api/config")).map(([url]) => url)).toEqual([
      "/api/config?profile=alpha", "/api/config?profile=beta",
    ]);
    expect($appName.get()).toBe("Ready beta");
  });

  it("bounds retries when config never becomes ready", async () => {
    readConfig = () => jsonResponse({ detail: "Backend is starting" }, 503);
    await mount();

    await act(async () => { await vi.advanceTimersByTimeAsync(60_000); });
    const attempts = configReads;
    expect(attempts).toBeGreaterThan(1);
    expect(attempts).toBeLessThanOrEqual(11);
    expect(vi.getTimerCount()).toBe(0);
    await act(async () => { await vi.advanceTimersByTimeAsync(60_000); });

    expect(configReads).toBe(attempts);
    expect($appName.get()).toBe(DEFAULT_APP_NAME);
  });
});
