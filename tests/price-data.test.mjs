import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import products from "../app/data/priceIsRightProducts.json" with { type: "json" };
import baskets from "../app/data/groceryBaskets.json" with { type: "json" };
import manifest from "../public/assets/price-hunter/image-manifest.json" with { type: "json" };

const assetRoot = new URL("../public/assets/price-hunter/", import.meta.url);
const validImage = (buf) =>
  buf.slice(0, 2).toString("hex") === "ffd8" ||
  buf.slice(1, 4).toString() === "PNG" ||
  buf.slice(0, 4).toString() === "RIFF" ||
  buf.slice(4, 12).toString().includes("ftyp");

test("local image package", async () => {
  assert.equal(manifest.summary.downloaded, 260);
  assert.equal(manifest.summary.failed, 0);
  assert.equal(manifest.images.length, 260);
  assert.equal(
    manifest.images.filter((x) => x.type === "individual").length,
    60,
  );
  assert.equal(manifest.images.filter((x) => x.type === "grocery").length, 200);
  for (const x of manifest.images) {
    assert.equal(x.status, "downloaded");
    assert.ok(!x.downloaded_file.includes(".."));
    const url = new URL(x.downloaded_file, assetRoot);
    assert.ok((await stat(url)).size > 0);
    assert.ok(validImage(await readFile(url)));
  }
});

test("individual product dataset", () => {
  assert.equal(products.length, 60);
  assert.equal(new Set(products.map((p) => p.id)).size, 60);
  assert.equal(
    new Set(products.map((p) => p.product_name.toLowerCase())).size,
    60,
  );
  assert.ok(
    products.every(
      (p) =>
        p.price >= 10 &&
        p.price <= 100000 &&
        p.condition === "New" &&
        !p.refurbished &&
        !p.marketplace &&
        p.product_url &&
        p.image_url &&
        p.local_image,
    ),
  );
  assert.deepEqual(
    Object.fromEntries(
      ["EASY", "MEDIUM", "HARD"].map((x) => [
        x,
        products.filter((p) => p.difficulty === x).length,
      ]),
    ),
    { EASY: 20, MEDIUM: 20, HARD: 20 },
  );
});
test("vegetarian grocery baskets", () => {
  assert.equal(baskets.length, 10);
  assert.equal(baskets.flatMap((b) => b.items).length, 200);
  for (const b of baskets) {
    assert.equal(b.items.length, 20);
    assert.equal(b.item_count, 20);
    const cents = b.items.reduce(
      (s, x) => s + Math.round(x.extended_price * 100),
      0,
    );
    assert.equal(cents, Math.round(b.basket_total * 100));
    assert.ok(cents >= 4800 && cents <= 5200);
    assert.ok(
      b.items.every(
        (x) =>
          x.image_url &&
          x.local_image &&
          x.vegetarian_verified &&
          x.egg_free &&
          x.meat_free &&
          x.fish_seafood_free &&
          x.gelatin_free,
      ),
    );
  }
});
