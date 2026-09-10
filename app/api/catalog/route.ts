import products from "../../data/priceIsRightProducts.json";
import baskets from "../../data/groceryBaskets.json";

const safeProduct = (p: any) => ({
  id: p.id,
  product_name: p.product_name,
  brand: p.brand,
  category: p.category,
  difficulty: p.difficulty,
  price_range: p.price_range,
  image_url: p.image_url,
});
const safeBasket = (b: any) => ({
  basket_id: b.basket_id,
  basket_name: b.basket_name,
  retailer: b.retailer,
  difficulty: b.difficulty,
  item_count: b.item_count,
  items: b.items.map((x: any) => ({
    id: x.id,
    product_name: x.product_name,
    brand: x.brand,
    category: x.category,
    package_size: x.package_size,
    quantity: x.quantity,
    image_url: x.image_url,
  })),
});

export async function GET(request: Request) {
  const url = new URL(request.url),
    answers = url.searchParams.get("answers") === "1";
  return Response.json({
    products: answers ? products : products.map(safeProduct),
    baskets: answers ? baskets : baskets.map(safeBasket),
  });
}
