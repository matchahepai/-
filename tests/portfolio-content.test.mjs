import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const { default: worker } = await import(new URL("../dist/server/index.js", import.meta.url).href);

async function render(path) {
  const response = await worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(response.status, 200);
  return response.text();
}

test("homepage renders the supplied contact destinations and updated profile", async () => {
  const html = await render("/");
  for (const value of [
    'href="https://orange4186.asia"',
    'href="https://www.xiaohongshu.com/user/profile/68412a8c000000001d0080bf"',
    'href="mailto:654676340@qq.com"',
    'href="tel:17720204186"',
    "硕士 · 2026—2029", "本科 · 2021—2025", "Canva 可画", "擅长的事", "先把问题想清楚再开始动手设计。", "我关注用户、产品和技术之间的连接。",
  ]) assert.ok(html.includes(value), `Missing ${value}`);
  assert.ok(!html.includes("wangbochen.design"));
  assert.ok(!html.includes("云轴"));
  assert.match(html, /class="[^"]*contact-link[^"]*"[^>]+aria-haspopup="dialog"/);
  assert.match(html, /class="mobile-sheet "[^>]+inert=""/);
  assert.ok(html.includes("<span>微信</span>"));
});

test("project previews carry attribution and do not expose original-image links", async () => {
  const html = await render("/work/sugar");
  assert.ok(html.includes("portfolio-watermark"));
  assert.ok(html.includes("王博晨 · orange4186.asia"));
  assert.ok(html.includes("Watermarked preview"));
  assert.ok(!html.includes("查看原图"));
});

test("home and project pages share controls and selective bilingual wayfinding", async () => {
  const home = await render("/");
  const detail = await render("/work/cloud-between");
  for (const html of [home, detail]) {
    assert.ok(html.includes("ui-control ui-control--surface"));
    assert.ok(html.includes('lang="en"'));
    assert.ok(html.includes("ui-arrow"));
  }
  for (const text of ["Selected Work", "Let’s Connect", "Product Designer", "category-badge"]) assert.ok(home.includes(text));
  for (const text of ["Project Overview", "Watermarked preview", "All Work", "tone-blue", "project-facts"]) assert.ok(detail.includes(text));
  assert.ok(detail.includes('aria-current="page"'));
});

test("the original WeChat QR image is bundled as a valid PNG", async () => {
  const png = await readFile(new URL("../public/assets/wechat-qr.png", import.meta.url));
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(png.readUInt32BE(16), 326);
  assert.equal(png.readUInt32BE(20), 326);
});

test("云岫 keeps its existing route and appears in metadata and gallery labels", async () => {
  const html = await render("/work/cloud-axis");
  assert.match(html, /<title>云岫｜王博晨作品集<\/title>/);
  assert.match(html, /<h1>云岫<\/h1>/);
  assert.ok(html.includes('aria-label="云岫完整项目页面"'));
  assert.ok(!html.includes("云轴"));
});

test("the preceding project's next-project link uses the new name", async () => {
  const html = await render("/work/chuyue");
  assert.ok(html.includes('href="/work/cloud-axis"'));
  assert.match(html, /<strong>云岫<\/strong>/);
  assert.ok(!html.includes("云轴"));
});
