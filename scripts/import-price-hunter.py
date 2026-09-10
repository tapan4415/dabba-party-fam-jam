import json, math, sys
from pathlib import Path
import pandas as pd

SOURCE = Path(sys.argv[1])
OUT = Path(sys.argv[2])
MANIFEST = Path(sys.argv[3]) if len(sys.argv)>3 else None
manifest_images=json.loads(MANIFEST.read_text())["images"] if MANIFEST else []
product_images={int(x["product_id"]):x["downloaded_file"] for x in manifest_images if x["type"]=="individual" and x["status"]=="downloaded"}
grocery_images={(int(x["basket_id"]),int(x["item_position"])):x["downloaded_file"] for x in manifest_images if x["type"]=="grocery" and x["status"]=="downloaded"}

def sheet(name):
    raw = pd.read_excel(SOURCE, sheet_name=name, header=None)
    headers = [str(x).strip() for x in raw.iloc[1].tolist()]
    data = raw.iloc[2:].copy()
    data.columns = headers
    return data.where(pd.notna(data), None).to_dict("records")

def clean(v):
    if isinstance(v, float) and math.isnan(v): return None
    if hasattr(v, "isoformat"): return v.isoformat()
    return v

def key(s):
    return str(s).strip().lower().replace("/", "_").replace(" ", "_").replace("-", "_")

products=[]
for r in sheet("Products Host"):
    x={key(k):clean(v) for k,v in r.items()}
    products.append({
      "id":int(x["id"]), "product_name":x["product_name"], "brand":x["brand"],
      "category":x["category"], "price":float(x["price"]),
      "original_price":None if x["original_price"] is None else float(x["original_price"]),
      "on_sale":bool(x["on_sale"]), "retailer":x["retailer"], "sold_by":x["sold_by"],
      "condition":x["condition"], "refurbished":bool(x["refurbished"] or False),
      "marketplace":bool(x["marketplace"]), "difficulty":x["difficulty"],
      "price_range":x["price_range"], "availability":x["availability"],
      "product_url":x["product_url"], "image_url":x["image_url"], "remote_image_url":x["image_url"],
      "local_image":f"/assets/price-hunter/{product_images[int(x['id'])]}" if int(x["id"]) in product_images else x["image_url"],
      "checked_at":str(x["checked_at"] or "").lstrip("'"), "verification_notes":x["verification_notes"]
    })

summary={int(r["Basket ID"]):r for r in sheet("Grocery Summary")}
groups={}
for pos,r in enumerate(sheet("Grocery Host")):
    x={key(k):clean(v) for k,v in r.items()}; bid=int(x["basket_id"])
    groups.setdefault(bid,[]).append({
      "id":f"grocery-{bid}-{len(groups.get(bid,[]))+1:02d}", "product_name":x["product_name"],
      "brand":x["brand"], "category":x["category"], "package_size":x["package_size"],
      "quantity":int(x["qty"]), "unit_price":float(x["unit_price"]),
      "extended_price":float(x["extended_price"]), "retailer":x["retailer"],
      "sold_by":x["sold_by"], "product_url":x["product_url"], "image_url":x["image_url"],
      "ingredients":x["ingredients"], "vegetarian_verified":bool(x["vegetarian_verified"]),
      "egg_free":bool(x["egg_free"]), "meat_free":bool(x["meat_free"]),
      "fish_seafood_free":bool(x["fish_seafood_free"]), "gelatin_free":bool(x["gelatin_free"]),
      "checked_at":str(x["checked_at"] or "").lstrip("'"), "verification_notes":x["verification_notes"],
      "local_image":f"/assets/price-hunter/{grocery_images[(bid,len(groups.get(bid,[]))+1)]}" if (bid,len(groups.get(bid,[]))+1) in grocery_images else x["image_url"],
      "remote_image_url":x["image_url"]
    })
baskets=[]
for bid,items in sorted(groups.items()):
    s=summary[bid]
    baskets.append({"basket_id":bid,"basket_name":s["Basket Name"],"retailer":s["Retailer"],
      "difficulty":s["Difficulty"],"item_count":int(s["Items"]),"basket_total":float(s["Actual Total"]),"items":items})

OUT.mkdir(parents=True,exist_ok=True)
(OUT/"priceIsRightProducts.json").write_text(json.dumps(products,indent=2,ensure_ascii=False)+"\n")
(OUT/"groceryBaskets.json").write_text(json.dumps(baskets,indent=2,ensure_ascii=False)+"\n")
print(f"Imported {len(products)} products, {len(baskets)} baskets, {sum(len(b['items']) for b in baskets)} grocery rows")
