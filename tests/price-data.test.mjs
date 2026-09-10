import test from "node:test";
import assert from "node:assert/strict";
import products from "../app/data/priceIsRightProducts.json" with { type: "json" };
import baskets from "../app/data/groceryBaskets.json" with { type: "json" };

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
        p.image_url,
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
          x.vegetarian_verified &&
          x.egg_free &&
          x.meat_free &&
          x.fish_seafood_free &&
          x.gelatin_free,
      ),
    );
  }
});
