// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { $appName, DEFAULT_APP_NAME, applyAppIdentity } from "@noone/shared/application-identity";
import { api, setManagementProfile } from "./api";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function deferredResponse() {
  let resolve!: (response: Response) => void;
  const promise = new Promise<Response>((done) => { resolve = done; });
  return { promise, resolve };
}

let fetchMock: ReturnType<typeof vi.fn<typeof fetch>>;

beforeEach(() => {
  fetchMock = vi.fn<typeof fetch>();
  vi.stubGlobal("fetch", fetchMock);
  setManagementProfile("alpha");
  applyAppIdentity(null);
});

afterEach(() => {
  setManagementProfile("");
  applyAppIdentity(null);
  vi.unstubAllGlobals();
});

describe("dashboard config identity publication", () => {
  it("a GET admitted during a successful PUT cannot suppress the new saved name", async () => {
    const pending = deferredResponse();
    fetchMock.mockReturnValueOnce(pending.promise);
    const save = api.saveConfig({ display: { app_name: "New Atlas" } });
    fetchMock.mockResolvedValueOnce(jsonResponse({ display: { app_name: "Old Atlas" } }));
    await api.getConfig();
    expect($appName.get()).toBe("Old Atlas");
    pending.resolve(jsonResponse({ ok: true }));
    await save;
    expect($appName.get()).toBe("New Atlas");
  });
  it("publishes a successful same-profile name save and a later full-config refetch", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));
    const config = { display: { app_name: "星雲 {team}" } };

    await expect(api.saveConfig(config)).resolves.toEqual({ ok: true });
    expect($appName.get()).toBe("星雲 {team}");
    expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/config?profile=alpha", expect.objectContaining({
      method: "PUT",
      body: JSON.stringify({ config }),
    }));

    const refreshed = { display: { app_name: "Updated constellation" }, model: "fixture-model" };
    fetchMock.mockResolvedValueOnce(jsonResponse(refreshed));
    await expect(api.getConfig()).resolves.toEqual(refreshed);
    expect($appName.get()).toBe("Updated constellation");
    expect(fetchMock).toHaveBeenNthCalledWith(2, "/api/config?profile=alpha", expect.anything());
  });

  it.each(["", "   "])("publishes the default after saving an explicitly cleared name %j", async (app_name) => {
    applyAppIdentity({ display: { app_name: "Previously configured" } });
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }));

    await api.saveConfig({ display: { app_name } });

    expect($appName.get()).toBe(DEFAULT_APP_NAME);
  });

  it.each([
    { model: "fixture-model" },
    { display: {} },
    { display: { theme: "dark" } },
    { display: { app_name: "" } },
    { display: { app_name: "   " } },
  ])("full-config refetch resets a previous name when identity is absent or blank: %j", async (config) => {
    applyAppIdentity({ display: { app_name: "Previously configured" } });
    fetchMock.mockResolvedValue(jsonResponse(config));

    await api.getConfig();

    expect($appName.get()).toBe(DEFAULT_APP_NAME);
  });

  it.each([
    { model: "fixture-model" },
    { display: {} },
    { display: { theme: "dark" } },
  ])("a successful partial save does not clobber identity: %j", async (config) => {
    applyAppIdentity({ display: { app_name: "Keep this name" } });
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }));

    await api.saveConfig(config);

    expect($appName.get()).toBe("Keep this name");
  });

  it("does not publish a name from an unsuccessful save", async () => {
    applyAppIdentity({ display: { app_name: "Saved name" } });
    fetchMock.mockResolvedValue(jsonResponse({ ok: false }));

    await expect(api.saveConfig({ display: { app_name: "Rejected name" } })).resolves.toEqual({ ok: false });

    expect($appName.get()).toBe("Saved name");
  });

  it("returns an old-profile GET without publishing its identity after a switch", async () => {
    const old = deferredResponse();
    fetchMock.mockReturnValueOnce(old.promise);
    const pending = api.getConfig();
    setManagementProfile("beta");
    applyAppIdentity(null);
    const config = { display: { app_name: "Old alpha name" } };

    old.resolve(jsonResponse(config));
    await expect(pending).resolves.toEqual(config);

    expect($appName.get()).toBe(DEFAULT_APP_NAME);
  });

  it("rejects stale publication after A → B → A even before another GET starts", async () => {
    const old = deferredResponse();
    fetchMock.mockReturnValueOnce(old.promise);
    const pending = api.getConfig();
    setManagementProfile("beta");
    setManagementProfile("alpha");
    applyAppIdentity(null);

    old.resolve(jsonResponse({ display: { app_name: "Old alpha name" } }));
    await pending;

    expect($appName.get()).toBe(DEFAULT_APP_NAME);
  });

  it("reasserting the same profile does not invalidate its pending GET", async () => {
    const current = deferredResponse();
    fetchMock.mockReturnValueOnce(current.promise);
    const pending = api.getConfig();
    setManagementProfile("alpha");

    current.resolve(jsonResponse({ display: { app_name: "Current alpha name" } }));
    await pending;

    expect($appName.get()).toBe("Current alpha name");
  });

  it("an older same-profile GET cannot undo a newer full-config refetch", async () => {
    const old = deferredResponse();
    fetchMock.mockReturnValueOnce(old.promise);
    const pending = api.getConfig();
    fetchMock.mockResolvedValueOnce(jsonResponse({ display: { app_name: "Fresh name" } }));
    await api.getConfig();

    old.resolve(jsonResponse({ display: { app_name: "Stale name" } }));
    await pending;

    expect($appName.get()).toBe("Fresh name");
  });

  it("a GET started before a successful name save cannot undo that save", async () => {
    const old = deferredResponse();
    fetchMock.mockReturnValueOnce(old.promise);
    const pending = api.getConfig();
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));
    await api.saveConfig({ display: { app_name: "New saved name" } });

    old.resolve(jsonResponse({ display: { app_name: "Before save" } }));
    await pending;

    expect($appName.get()).toBe("New saved name");
  });

  it("does not publish a successful explicit save for another profile", async () => {
    applyAppIdentity({ display: { app_name: "Alpha name" } });
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));

    await api.saveConfig({ display: { app_name: "Beta name" } }, "beta");

    expect($appName.get()).toBe("Alpha name");
    expect(fetchMock.mock.calls[0][0]).toBe("/api/config?profile=beta");
  });

  it("an older successful save cannot undo a newer same-profile name save", async () => {
    const old = deferredResponse();
    fetchMock.mockReturnValueOnce(old.promise);
    const pending = api.saveConfig({ display: { app_name: "Older save" } });
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));
    await api.saveConfig({ display: { app_name: "Newest save" } });

    old.resolve(jsonResponse({ ok: true }));
    await expect(pending).resolves.toEqual({ ok: true });

    expect($appName.get()).toBe("Newest save");
  });

  it("a successful save completing after a profile switch cannot publish its name", async () => {
    const old = deferredResponse();
    fetchMock.mockReturnValueOnce(old.promise);
    const pending = api.saveConfig({ display: { app_name: "Alpha save" } });
    setManagementProfile("beta");
    applyAppIdentity(null);

    old.resolve(jsonResponse({ ok: true }));
    await expect(pending).resolves.toEqual({ ok: true });

    expect($appName.get()).toBe(DEFAULT_APP_NAME);
  });
});
