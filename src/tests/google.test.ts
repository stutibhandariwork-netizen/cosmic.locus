import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import type { JournalEntry } from "@/lib/store";

process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "test-client.apps.googleusercontent.com";

const entry = (over: Partial<JournalEntry> = {}): JournalEntry => ({
  id: "1",
  text: "First line\nsecond line\n\nNew <para> & more",
  prompt: "What felt easy today?",
  link: { title: "Card of the day: The Star", summary: "Hope is quietly coming back.", href: "/tarot/" },
  date: "2026-11-01",
  createdAt: "2026-11-01T05:00:00.000Z",
  ...over,
});

let lib: typeof import("@/lib/google");
const requested: { client_id: string; scope: string }[] = [];

beforeAll(async () => {
  // A stand-in for Google's sign-in script that grants a token straight away.
  (globalThis as { window?: unknown }).window = {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (cfg: { client_id: string; scope: string; callback: (r: object) => void }) => {
            requested.push(cfg);
            return { requestAccessToken: () => cfg.callback({ access_token: "tok", expires_in: 3600 }) };
          },
          revoke: () => {},
        },
      },
    },
  };
  lib = await import("@/lib/google");
});

afterEach(() => vi.unstubAllGlobals());

describe("journal as a Google Doc", () => {
  it("writes escaped HTML with headings, links, prompts and paragraphs", () => {
    const html = lib.journalHtml([entry()], new Date("2026-11-01T06:00:00Z"));
    expect(html).toContain("<h1>Cosmic Locus journal</h1>");
    expect(html).toContain("<h2>Sunday 1 November 2026</h2>");
    expect(html).toContain("<b>Card of the day: The Star</b><br>Hope is quietly coming back.");
    expect(html).toContain("<p><i>What felt easy today?</i></p>");
    expect(html).toContain("<p>First line<br>second line</p>");
    expect(html).toContain("<p>New &lt;para&gt; &amp; more</p>");
  });

  it("needs a sign-in before it can sync", async () => {
    await expect(lib.syncToDoc([entry()], null)).rejects.toBeInstanceOf(lib.SignInNeeded);
  });

  it("signs in with the drive.file scope only, then creates the doc", async () => {
    await lib.signIn();
    expect(requested.at(-1)).toMatchObject({ client_id: "test-client.apps.googleusercontent.com", scope: "https://www.googleapis.com/auth/drive.file" });
    const fetch = vi.fn(async () => new Response(JSON.stringify({ id: "doc1", webViewLink: "https://docs.google.com/document/d/doc1/edit" })));
    vi.stubGlobal("fetch", fetch);
    expect(await lib.syncToDoc([entry()], null)).toEqual({ docId: "doc1", url: "https://docs.google.com/document/d/doc1/edit" });
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("upload/drive/v3/files?uploadType=multipart");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer tok");
    expect(String(init.body)).toContain('"mimeType":"application/vnd.google-apps.document"');
  });

  it("replaces the existing doc's content, and recreates it if it was deleted", async () => {
    const update = vi.fn(async () => new Response(JSON.stringify({ id: "doc1", webViewLink: "u1" })));
    vi.stubGlobal("fetch", update);
    expect(await lib.syncToDoc([entry()], "doc1")).toEqual({ docId: "doc1", url: "u1" });
    const [url, init] = update.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/files/doc1?uploadType=media");
    expect(init.method).toBe("PATCH");

    const gone = vi
      .fn()
      .mockResolvedValueOnce(new Response("", { status: 404 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "doc2", webViewLink: "u2" })));
    vi.stubGlobal("fetch", gone);
    expect(await lib.syncToDoc([entry()], "doc1")).toEqual({ docId: "doc2", url: "u2" });
    expect(gone).toHaveBeenCalledTimes(2);
  });

  it("asks to sign in again when Google says the token has expired", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 401 })));
    await expect(lib.syncToDoc([entry()], "doc1")).rejects.toBeInstanceOf(lib.SignInNeeded);
    expect(lib.hasToken()).toBe(false);
  });
});
