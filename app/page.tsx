"use client";
import { useEffect, useMemo, useRef, useState } from "react";
type Chain = { title: string; round: number; words: string[]; value: number };
type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  size: string;
  source: string;
  category?: string;
  brand?: string;
  difficulty?: string;
  priceRange?: string;
  originalPrice?: number | null;
  onSale?: boolean;
};
type GroceryItem = {
  id: string;
  product_name: string;
  brand: string;
  category: string;
  package_size: string;
  quantity: number;
  unit_price: number;
  extended_price: number;
  image_url: string;
};
type GroceryBasket = {
  basket_id: number;
  basket_name: string;
  retailer: string;
  difficulty: string;
  item_count: number;
  basket_total: number;
  items: GroceryItem[];
};
type Screen =
  "home" | "setup" | "chain" | "price" | "settings" | "content" | "scoreboard";
const colors = [
  "#ff6147",
  "#00bfa6",
  "#ffc837",
  "#8466ed",
  "#ec4899",
  "#38bdf8",
];
const initialTeams = [
  "TEAM MASALA",
  "TEAM TADKA",
  "TEAM CHAI",
  "TEAM DHOKLA",
].map((name, i) => ({ id: i + 1, name, color: colors[i], score: 0 }));
const initialChains: Chain[] = [
  {
    title: "Practice",
    round: 0,
    words: ["ICE", "CREAM", "CHEESE", "CAKE", "WALK", "WAY"],
    value: 0,
  },
  {
    title: "Morning Mix",
    round: 1,
    words: ["COFFEE", "BEAN", "BAG", "PIPE", "DREAM", "TEAM"],
    value: 100,
  },
  {
    title: "Bright Ideas",
    round: 1,
    words: ["SUN", "FLOWER", "POWER", "HOUSE", "PARTY", "LINE"],
    value: 100,
  },
  {
    title: "On The Move",
    round: 2,
    words: ["ROAD", "TRIP", "WIRE", "TAP", "DANCE", "FLOOR"],
    value: 200,
  },
  {
    title: "All Business",
    round: 3,
    words: ["SHOW", "CASE", "LOAD", "STAR", "FISH", "TANK"],
    value: 300,
  },
];
const initialProducts: Product[] = [
  {
    id: 1,
    name: "QuikTea Masala Tea Bags",
    image: "/products/quiktea.png",
    price: 7.99,
    size: "72 count · 5.08 oz",
    source: "Walmart · checked Sep 8, 2026",
  },
  {
    id: 2,
    name: "Bombay Original Basmati Rice",
    image: "/products/bombay-rice.jpg",
    price: 18.18,
    size: "10 lb bag",
    source: "Walmart · checked Sep 8, 2026",
  },
  {
    id: 3,
    name: "Sukhi's Potato & Pea Samosas",
    image: "/products/sukhis-samosa.png",
    price: 7.87,
    size: "10 oz frozen appetizer",
    source: "Walmart · checked Sep 8, 2026",
  },
  {
    id: 4,
    name: "Servio Grass-Fed Ghee",
    image: "/products/servio-ghee.jpg",
    price: 5.74,
    size: "10.58 oz jar",
    source: "Walmart · checked Sep 8, 2026",
  },
  {
    id: 5,
    name: "Parle-G Original Cookies",
    image: "/products/parle-g.jpg",
    price: 2.49,
    size: "11.93 oz · 6 packs",
    source: "Walmart · checked Sep 8, 2026",
  },
  {
    id: 6,
    name: "Shan Mango Pickle",
    image: "/products/shan-pickle.png",
    price: 7.17,
    size: "300 g jar",
    source: "Walmart · checked Sep 8, 2026",
  },
  {
    id: 7,
    name: "Haldiram's Spicy Bhujia",
    image: "/products/haldiram-bhujia.jpg",
    price: 9.99,
    size: "14.10 oz bag",
    source: "Walmart · checked Sep 8, 2026",
  },
  {
    id: 8,
    name: "Amul Pure Ghee",
    image: "/products/amul-ghee.jpg",
    price: 22.99,
    size: "1 L · 905 g tin",
    source: "Walmart · checked Sep 8, 2026",
  },
];
const catalogGroups: [string, [string, number][]][] = [
  [
    "Electronics",
    [
      ["Wireless Earbuds", 29.99],
      ["Smart Speaker", 49.99],
      ["Gaming Monitor", 279.99],
      ["4K Television", 698],
      ["Laptop Computer", 1299],
      ["Mirrorless Camera", 1899],
      ["Gaming Desktop", 2499],
      ["Home Theater Projector", 3299],
      ["Professional Cinema Camera", 6499],
      ["Recording Studio Console", 14999],
    ],
  ],
  [
    "Vehicles",
    [
      ["Electric Scooter", 399],
      ["Commuter Bicycle", 649],
      ["E-Bike", 1699],
      ["Touring Motorcycle", 8999],
      ["Compact Sedan", 23995],
      ["Family SUV", 38990],
      ["Electric Pickup", 59990],
      ["Luxury Sports Coupe", 82900],
      ["Performance SUV", 94500],
      ["Premium Electric Sedan", 99900],
    ],
  ],
  [
    "Travel",
    [
      ["Carry-On Suitcase", 119],
      ["Weekend Hotel Stay", 480],
      ["Domestic Flight", 625],
      ["Theme Park Package", 1450],
      ["Caribbean Cruise", 3299],
      ["European Rail Vacation", 5490],
      ["African Safari", 8750],
      ["Maldives Villa Week", 12900],
      ["Private Island Retreat", 25000],
      ["Around-the-World Tour", 65000],
    ],
  ],
  [
    "Home",
    [
      ["Table Lamp", 34.99],
      ["Area Rug", 179],
      ["Dining Table", 899],
      ["Sectional Sofa", 2299],
      ["Adjustable Bed", 3499],
      ["Outdoor Kitchen", 7800],
      ["Designer Bedroom Set", 12500],
      ["Grand Piano", 28000],
      ["Backyard Pool Package", 55000],
      ["Prefab Tiny Home", 98000],
    ],
  ],
  [
    "Appliances",
    [
      ["Electric Kettle", 24.99],
      ["Air Fryer", 89.99],
      ["Stand Mixer", 449.99],
      ["Robot Vacuum", 799],
      ["French-Door Refrigerator", 2499],
      ["Washer and Dryer Set", 3198],
      ["Professional Range", 6999],
      ["Built-In Coffee System", 8500],
      ["Wine Cellar Cabinet", 12000],
      ["Luxury Smart Kitchen Suite", 24000],
    ],
  ],
  [
    "Fashion",
    [
      ["Designer Sunglasses", 195],
      ["Leather Handbag", 495],
      ["Premium Sneakers", 750],
      ["Cashmere Coat", 1495],
      ["Designer Evening Dress", 3200],
      ["Luxury Watch", 7800],
      ["Diamond Tennis Bracelet", 14900],
      ["Couture Gown", 28000],
      ["Collector Handbag", 45000],
      ["Diamond Necklace", 99000],
    ],
  ],
  [
    "Sports",
    [
      ["Pickleball Set", 39.99],
      ["Basketball Hoop", 349],
      ["Treadmill", 1299],
      ["Carbon Road Bike", 3499],
      ["Golf Club Set", 4999],
      ["Home Gym", 8500],
      ["Competition Kayak", 11900],
      ["Personal Watercraft", 17999],
      ["Fishing Boat", 42000],
      ["Wake Sports Boat", 95000],
    ],
  ],
  [
    "Tools",
    [
      ["Cordless Drill Kit", 129],
      ["Rolling Tool Chest", 699],
      ["Portable Generator", 1199],
      ["Riding Lawn Mower", 2999],
      ["Compact Tractor", 17999],
      ["Commercial Zero-Turn Mower", 22900],
      ["Mini Excavator", 35900],
      ["Skid Steer Loader", 52900],
      ["Farm Tractor", 78500],
      ["Commercial Forklift", 99000],
    ],
  ],
  [
    "Toys & Games",
    [
      ["Strategy Board Game", 49.99],
      ["LEGO Collector Set", 299.99],
      ["Arcade Cabinet", 599],
      ["Gaming Console Bundle", 749],
      ["Premium Pinball Machine", 8999],
      ["Golf Simulator", 14999],
      ["Racing Simulator", 24900],
      ["Backyard Playground", 32000],
      ["Vintage Arcade Collection", 57500],
      ["Luxury Game Room", 88000],
    ],
  ],
  [
    "Outdoors",
    [
      ["Camping Tent", 149],
      ["Pellet Grill", 699],
      ["Patio Set", 1499],
      ["Hot Tub", 6999],
      ["Greenhouse", 12500],
      ["Travel Trailer", 28900],
      ["Luxury Fifth Wheel", 62000],
      ["Expedition Camper", 78000],
      ["Class B Camper Van", 95000],
      ["Off-Grid Cabin Kit", 99900],
    ],
  ],
  [
    "Music",
    [
      ["Bluetooth Turntable", 249],
      ["Electric Guitar", 799],
      ["Digital Piano", 1499],
      ["Drum Kit", 2199],
      ["Vintage Guitar", 8999],
      ["Concert Harp", 15000],
      ["Professional DJ Rig", 22000],
      ["Recording Booth", 35000],
      ["Concert Grand Piano", 79900],
      ["Touring Sound System", 99000],
    ],
  ],
  [
    "Food & Lifestyle",
    [
      ["Artisan Chocolate Box", 19.99],
      ["Premium Olive Oil", 79.99],
      ["Espresso Machine", 699],
      ["Outdoor Pizza Oven", 1299],
      ["Wine Subscription", 2400],
      ["Chef's Tasting Dinner", 3500],
      ["Private Chef Weekend", 7500],
      ["Restaurant Catering Package", 15000],
      ["Wine Cellar Collection", 45000],
      ["Luxury Wedding Catering", 95000],
    ],
  ],
];
const expandedProducts: Product[] = catalogGroups.flatMap(([category, items]) =>
  items.map(([name, price], i) => {
    const id = 100 + catalogGroups.findIndex((g) => g[0] === category) * 10 + i;
    return {
      id,
      name,
      price,
      image: `https://loremflickr.com/640/480/${encodeURIComponent(category)},${encodeURIComponent(name)}?lock=${id}`,
      size: category,
      category,
      source: "Game catalog price · host editable",
    };
  }),
);
const featuredProducts: Product[] = [
  {
    id: 9,
    name: "Apple AirPods Pro 3",
    image: "/products/airpods-pro-3.webp",
    price: 199.99,
    size: "USB-C charging case",
    category: "Electronics",
    source: "Best Buy · checked Sep 2026",
  },
  {
    id: 10,
    name: "Sony PlayStation 5 Pro",
    image: "/products/ps5-pro.png",
    price: 899.99,
    size: "2 TB digital console",
    category: "Electronics",
    source: "PlayStation Direct · checked Sep 2026",
  },
  {
    id: 11,
    name: "Dyson V15 Detect Extra",
    image: "/products/dyson-v15.png",
    price: 649.99,
    size: "Cordless vacuum · 10 accessories",
    category: "Appliances",
    source: "Best Buy · checked Sep 2026",
  },
  {
    id: 12,
    name: "Canon EOS R6 Mark II",
    image: "/products/canon-r6.jpg",
    price: 1999,
    size: "Body only · model 5666C002",
    category: "Cameras",
    source: "Best Buy · checked Sep 2026",
  },
  {
    id: 13,
    name: "KitchenAid Artisan KSM150PSER",
    image: "/products/kitchenaid.jpg",
    price: 319.99,
    size: "5-quart stand mixer",
    category: "Appliances",
    source: "Kohl's · checked Sep 2026",
  },
  {
    id: 14,
    name: "Weber Genesis E-325",
    image: "https://loremflickr.com/640/480/weber,gas,grill?lock=14",
    price: 849,
    size: "3-burner propane grill",
    category: "Outdoors",
    source: "ABT · checked Sep 2026",
  },
  {
    id: 15,
    name: "LEGO Star Wars Millennium Falcon 75192",
    image: "/products/lego-falcon.jpg",
    price: 849.99,
    size: "7,541-piece UCS set",
    category: "Toys",
    source: "LEGO retail price · checked Sep 2026",
  },
  {
    id: 16,
    name: "Trek Domane AL 5 Gen 4",
    image: "/products/trek-domane.jpg",
    price: 2099.99,
    size: "2026 aluminum road bike",
    category: "Sports",
    source: "Trek retailer · checked Sep 2026",
  },
];
void initialProducts;
void expandedProducts;
void featuredProducts;
const placeholderProduct: Product = {
  id: 0,
  name: "Loading verified product…",
  brand: "",
  category: "",
  price: 0,
  image: "",
  size: "",
  source: "",
};
const cash = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
export default function Home() {
  const [screen, setScreen] = useState<Screen>("home"),
    [host, setHost] = useState(true),
    [teams, setTeams] = useState(initialTeams),
    [active, setActive] = useState(0),
    [chains, setChains] = useState(initialChains),
    [ci, setCi] = useState(0),
    [shown, setShown] = useState<number[]>([0, 5]),
    [clues, setClues] = useState<Record<number, number>>({}),
    [products, setProducts] = useState<Product[]>([placeholderProduct]),
    [allBaskets, setAllBaskets] = useState<GroceryBasket[]>([]),
    [pi, setPi] = useState(0),
    [bi, setBi] = useState(0),
    [priceDeck, setPriceDeck] = useState<number[]>([]),
    [priceDeck2, setPriceDeck2] = useState<number[]>([]),
    [p2i, setP2i] = useState(0),
    [practice, setPractice] = useState(true),
    [stage, setStage] = useState(1),
    [timer, setTimer] = useState(10),
    [running, setRunning] = useState(false),
    [guesses, setGuesses] = useState<Record<number, string>>({}),
    [choices, setChoices] = useState<Record<number, string>>({}),
    [carts, setCarts] = useState<Record<number, (number | string)[]>>({}),
    [cartAmounts, setCartAmounts] = useState<Record<number, number>>({}),
    [basketDeck, setBasketDeck] = useState<number[]>([]),
    [locked, setLocked] = useState<number[]>([]),
    [priceOpen, setPriceOpen] = useState(false),
    [priceResult, setPriceResult] = useState(""),
    [toast, setToast] = useState(""),
    [history, setHistory] = useState<any[]>([]),
    [help, setHelp] = useState(false),
    [eventName, setEventName] = useState("DABBA PARTY FAM JAM"),
    [hydrated, setHydrated] = useState(false);
  const [settings, setSettings] = useState({
    hard: true,
    chainPractice: true,
    pricePractice: true,
    chainTimer: 10,
    priceTimer: 5,
    rule: "under",
    exact: 250,
    target: 50,
    hostTotal: true,
    sound: true,
    productDifficulty: "ALL",
    productCategory: "ALL",
    productPriceRange: "ALL",
  });
  const clock = useRef<any>(null);
  const changeHost = (value: boolean) => {
    setHost(value);
    localStorage.setItem("dabba-view", value ? "host" : "audience");
  };
  const applyShared = (s: any) => {
    if (!s) return;
    setScreen(s.screen || "home");
    setTeams(s.teams || initialTeams);
    setActive(s.active || 0);
    setChains(s.chains || initialChains);
    setCi(s.ci || 0);
    setShown(s.shown || [0, 5]);
    setClues(s.clues || {});
    setPi(s.pi || 0);
    setBi(s.bi || 0);
    setPriceDeck(s.priceDeck || []);
    setPriceDeck2(s.priceDeck2 || []);
    setP2i(s.p2i || 0);
    setPractice(s.practice ?? true);
    setStage(s.stage || 1);
    setTimer(s.timer ?? 10);
    setRunning(s.running ?? false);
    setGuesses(s.guesses || {});
    setChoices(s.choices || {});
    setCarts(s.carts || {});
    setCartAmounts(s.cartAmounts || {});
    setBasketDeck(s.basketDeck || []);
    setLocked(s.locked || []);
    setPriceOpen(s.priceOpen ?? false);
    setPriceResult(s.priceResult || "");
    setSettings((x) => ({ ...x, ...s.settings }));
    setEventName(s.eventName || "DABBA PARTY FAM JAM");
  };
  useEffect(() => {
    if (localStorage.getItem("dabba-view") === "audience") setHost(false);
  }, []);
  useEffect(() => {
    fetch("/api/state")
      .then((r) => r.json())
      .then(({ state }) => {
        if (state) applyShared(state);
        setHydrated(true);
      })
      .catch(() => {
        try {
          const s = JSON.parse(localStorage.getItem("dabba") || "null");
          if (s) applyShared(s);
        } catch {}
        setHydrated(true);
      });
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    if (host) {
      const id = setTimeout(
        () =>
          fetch("/api/state", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              dataVersion: 6,
              screen,
              teams,
              active,
              chains,
              ci,
              shown,
              clues,
              pi,
              bi,
              priceDeck,
              priceDeck2,
              p2i,
              practice,
              stage,
              timer,
              running,
              guesses,
              choices,
              carts,
              cartAmounts,
              basketDeck,
              locked,
              priceOpen,
              priceResult,
              settings,
              eventName,
            }),
          }).catch(() => {}),
        120,
      );
      return () => clearTimeout(id);
    }
    const id = setInterval(
      () =>
        fetch("/api/state")
          .then((r) => r.json())
          .then(({ state }) => applyShared(state))
          .catch(() => {}),
      650,
    );
    return () => clearInterval(id);
  }, [
    hydrated,
    host,
    screen,
    teams,
    active,
    chains,
    ci,
    shown,
    clues,
    pi,
    bi,
    priceDeck,
    priceDeck2,
    p2i,
    practice,
    stage,
    timer,
    running,
    guesses,
    choices,
    carts,
    cartAmounts,
    basketDeck,
    locked,
    priceOpen,
    priceResult,
    settings,
    eventName,
  ]);
  useEffect(() => {
    fetch(`/api/catalog?answers=${host || priceOpen ? 1 : 0}`)
      .then((r) => r.json())
      .then(({ products: raw, baskets }) => {
        const mapped = raw.map((p: any) => ({
          id: p.id,
          name: p.product_name,
          brand: p.brand,
          category: p.category,
          price: p.price || 0,
          originalPrice: p.original_price,
          onSale: p.on_sale,
          difficulty: p.difficulty,
          priceRange: p.price_range,
          image: p.image_url,
          size: p.brand,
          source: p.retailer || "",
        }));
        setProducts(mapped);
        if (host && !priceDeck.length) {
          const pick = (level: string, n = 4, expensive = false) => {
            const pool = mapped
              .filter((p: Product) => p.difficulty === level)
              .sort(
                expensive
                  ? (a: Product, b: Product) => b.price - a.price
                  : () => Math.random() - 0.5,
              )
              .slice(0, expensive ? 10 : 20)
              .sort(() => Math.random() - 0.5)
              .slice(0, n);
            return pool.map((p: Product) => p.id);
          };
          setPriceDeck([
            ...pick("EASY"),
            ...pick("MEDIUM"),
            ...pick("HARD", 4, true),
          ]);
        }
        if (host && priceDeck.length && !priceDeck2.length) {
          const used = new Set(priceDeck);
          setPriceDeck2(
            mapped
              .filter((p: Product) => !used.has(p.id))
              .sort(() => Math.random() - 0.5)
              .slice(0, 10)
              .map((p: Product) => p.id),
          );
        }
        setAllBaskets(baskets);
        if (host && !basketDeck.length)
          setBasketDeck(
            baskets
              .map((b: GroceryBasket) => b.basket_id)
              .sort(() => Math.random() - 0.5),
          );
      })
      .catch(() => {
        setToast("CATALOG COULD NOT LOAD");
        setTimeout(() => setToast(""), 1600);
      });
  }, [host, priceOpen, priceDeck.length, priceDeck2.length, basketDeck.length]);
  useEffect(() => {
    localStorage.setItem(
      "dabba",
      JSON.stringify({
        dataVersion: 6,
        teams,
        chains,
        settings,
        eventName,
      }),
    );
  }, [teams, chains, settings, eventName]);
  const playableProducts = useMemo(
    () =>
      products
        .filter(
          (p) =>
            (settings.productDifficulty === "ALL" ||
              p.difficulty === settings.productDifficulty) &&
            (settings.productCategory === "ALL" ||
              p.category === settings.productCategory) &&
            (settings.productPriceRange === "ALL" ||
              p.priceRange === settings.productPriceRange),
        )
        .sort((a, b) => ((a.id * 37) % 61) - ((b.id * 37) % 61)),
    [
      products,
      settings.productDifficulty,
      settings.productCategory,
      settings.productPriceRange,
    ],
  );
  const chain = chains[ci],
    sessionProducts = priceDeck.length
      ? (priceDeck
          .map((id) => products.find((p) => p.id === id))
          .filter(Boolean) as Product[])
      : playableProducts,
    secondProducts = priceDeck2
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean) as Product[],
    product =
      stage === 2
        ? secondProducts[p2i] || products[0]
        : sessionProducts[pi % Math.max(1, sessionProducts.length)] ||
          products[0],
    referenceProduct =
      stage === 2
        ? p2i > 0
          ? secondProducts[p2i - 1]
          : sessionProducts[sessionProducts.length - 1]
        : product,
    basket = allBaskets.find(
      (b) => b.basket_id === basketDeck[bi % Math.max(1, basketDeck.length)],
    ) ||
      allBaskets[0] || {
        basket_id: 0,
        basket_name: "Loading verified basket…",
        retailer: "",
        difficulty: "",
        item_count: 0,
        basket_total: 0,
        items: [],
      };
  const basketPool = useMemo(() => {
    const groceryDecoys = allBaskets
      .filter((b) => b.basket_id !== basket.basket_id)
      .flatMap((b) => b.items)
      .filter(
        (x) => !basket.items.some((i) => i.product_name === x.product_name),
      )
      .slice(0, 8);
    const productDecoys = products
      .filter((p) => p.id && p.price >= 20)
      .sort((a, b) => b.price - a.price)
      .slice(0, 8)
      .map((p) => ({
        id: `product-${p.id}`,
        product_name: p.name,
        brand: p.brand || "",
        category: p.category || "General",
        package_size: "1 item",
        quantity: 1,
        unit_price: p.price,
        extended_price: p.price,
        image_url: p.image,
      }));
    return [...basket.items, ...groceryDecoys, ...productDecoys].sort(
      (a, b) =>
        String(a.id).localeCompare(String(b.id)) *
        (basket.basket_id % 2 ? 1 : -1),
    );
  }, [basket, allBaskets, products]);
  const say = (x: string) => {
      setToast(x);
      setTimeout(() => setToast(""), 1600);
    },
    save = () =>
      setHistory((h) => [
        ...h.slice(-14),
        { teams, active, shown, clues, carts, guesses, choices },
      ]),
    nextTeam = () => {
      setActive((a) => (a + 1) % teams.length);
      setTimer(settings.chainTimer);
      say(`CONTROL PASSES TO ${teams[(active + 1) % teams.length].name}`);
    };
  const addGrocery = (teamId: number, itemId: string) => {
    if (!host || locked.includes(teamId)) return;
    const item = basketPool.find((x) => x.id === itemId);
    if (!item) return;
    if ((carts[teamId] || []).includes(itemId))
      return say("THAT ITEM IS ALREADY IN THIS CART");
    save();
    setCarts((c) => ({ ...c, [teamId]: [...(c[teamId] || []), itemId] }));
    setCartAmounts((a) => ({
      ...a,
      [teamId]:
        ((a[teamId] || 0) * 100 + Math.round(item.extended_price * 100)) / 100,
    }));
  };
  const removeGrocery = (teamId: number, itemId: string) => {
    const item = basketPool.find((x) => x.id === itemId);
    setCarts((c) => ({
      ...c,
      [teamId]: (c[teamId] || []).filter((id) => id !== itemId),
    }));
    if (item)
      setCartAmounts((a) => ({
        ...a,
        [teamId]: Math.max(
          0,
          Math.round(((a[teamId] || 0) - item.extended_price) * 100) / 100,
        ),
      }));
  };
  const openWord = () =>
    chain.words.findIndex(
      (_, i) => i > 0 && i < chain.words.length - 1 && !shown.includes(i),
    );
  const addLetter = () => {
    const n = openWord();
    if (n < 0) return;
    setClues((c) => ({
      ...c,
      [n]: Math.min((c[n] || 0) + 1, chain.words[n].length),
    }));
  };
  const correct = () => {
    if (screen !== "chain") return;
    const n = openWord();
    if (n < 0) return;
    save();
    setShown((s) => [...s, n]);
    if (!practice)
      setTeams((t) =>
        t.map((x, i) =>
          i === active ? { ...x, score: x.score + chain.value } : x,
        ),
      );
    say(
      practice
        ? "CORRECT! · PRACTICE — NO SCORE"
        : `CORRECT! · +${cash(chain.value)}`,
    );
  };
  const wrong = () => {
      if (screen === "chain") {
        save();
        addLetter();
      }
      say("WRONG! · NEXT TEAM GETS ANOTHER LETTER");
      setTimeout(nextTeam, 500);
    },
    reveal = () => {
      const n = openWord();
      if (n >= 0) {
        save();
        addLetter();
        say("ONE LETTER REVEALED");
      }
    };
  useEffect(() => {
    if (!running) return;
    clock.current = setInterval(
      () =>
        setTimer((t) => {
          if (t <= 1) {
            setRunning(false);
            if (screen === "chain") addLetter();
            setTimeout(nextTeam, 50);
            say("TIME UP! · NEXT TEAM GETS ANOTHER LETTER");
            return settings.chainTimer;
          }
          return t - 1;
        }),
      1000,
    );
    return () => clearInterval(clock.current);
  }, [running, active]);
  const goChain = (p: boolean) => {
      setPractice(p);
      const i = p
        ? 0
        : Math.max(
            1,
            chains.findIndex((c) => c.round === 1),
          );
      setCi(i);
      setShown([0, chains[i].words.length - 1]);
      setClues({});
      setTimer(settings.chainTimer);
      setScreen("chain");
    },
    nextChain = () => {
      if (ci >= chains.length - 1) {
        setScreen("price");
        setStage(1);
        setPi(0);
        setP2i(0);
        setPractice(false);
        setPriceDeck([]);
        setPriceDeck2([]);
        setPriceOpen(false);
        return;
      }
      let n = Math.min(ci + 1, chains.length - 1);
      if (!settings.hard && chains[n]?.round === 3) n = 1;
      setCi(n);
      setPractice(false);
      setShown([0, chains[n].words.length - 1]);
      setClues({});
      setRunning(false);
    };
  const undo = () => {
    const x = history.at(-1);
    if (!x) return;
    setTeams(x.teams);
    setActive(x.active);
    setShown(x.shown);
    setClues(x.clues || {});
    setCarts(x.carts);
    setGuesses(x.guesses);
    setChoices(x.choices);
    setHistory((h) => h.slice(0, -1));
    say("LAST ACTION UNDONE");
  };
  const revealPrice = () => {
    if (priceOpen) return;
    if (
      stage === 1 &&
      teams.some(
        (t) =>
          !guesses[t.id]?.trim() ||
          !Number.isFinite(Number(guesses[t.id])) ||
          Number(guesses[t.id]) < 0,
      )
    )
      return say("ENTER A VALID GUESS FOR EVERY TEAM");
    if (stage === 2 && teams.some((t) => !choices[t.id]))
      return say("EVERY TEAM MUST CHOOSE UP OR DOWN");
    save();
    setPriceOpen(true);
    if (practice) {
      setPriceResult("PRACTICE REVEAL · NO MONEY AWARDED");
      return say("PRACTICE ONLY · $0 AWARDED");
    }
    if (stage === 1) {
      const entries = teams.map((t, i) => ({
        i,
        g: Number(guesses[t.id]),
        d: Math.abs(Number(guesses[t.id]) - product.price),
      }));
      const best = Math.min(...entries.map((x) => x.d)),
        winners = entries.filter((x) => x.d === best),
        exact = best === 0,
        prize = exact ? 200 : 100;
      setTeams((t) =>
        t.map((x, i) =>
          winners.some((w) => w.i === i) ? { ...x, score: x.score + prize } : x,
        ),
      );
      const names = winners.map((w) => teams[w.i].name).join(" + ");
      setPriceResult(
        `${names} ${winners.length > 1 ? "TIE" : "WINS"} · ${exact ? "EXACT PRICE — DOUBLE" : "CLOSEST GUESS"} · +${cash(prize)}`,
      );
      say(
        `${names} ${winners.length > 1 ? "TIE" : "IS CLOSEST"} · +${cash(prize)}`,
      );
    } else if (stage === 2) {
      const answer = product.price > referenceProduct.price ? "UP" : "DOWN",
        winners = teams.filter((x) => choices[x.id] === answer);
      setTeams((t) =>
        t.map((x) =>
          choices[x.id] === answer ? { ...x, score: x.score + 200 } : x,
        ),
      );
      setPriceResult(
        `${answer} IS CORRECT · ${winners.length ? winners.map((x) => x.name).join(" + ") : "NO WINNER"}${winners.length ? " · +$200 EACH" : ""}`,
      );
      say("CORRECT TEAMS WIN $200");
    }
  };
  const revealBaskets = () => {
    if (priceOpen) return;
    if (teams.some((t) => !(carts[t.id] || []).length))
      return say("EVERY TEAM MUST ADD AT LEAST ONE ITEM");
    const targetCents = Math.round(settings.target * 100),
      entries = teams.map((t, i) => ({
        i,
        totalCents: Math.round((cartAmounts[t.id] || 0) * 100),
      }));
    setPriceOpen(true);
    if (practice) {
      setPriceResult("PRACTICE REVEAL · NO MONEY AWARDED");
      return say("PRACTICE ONLY · $0 AWARDED");
    }
    const best = Math.min(
      ...entries.map((x) => Math.abs(x.totalCents - targetCents)),
    );
    const winners = entries
      .filter((x) => Math.abs(x.totalCents - targetCents) === best)
      .map((x) => teams[x.i]);
    setTeams((t) =>
      t.map((x) =>
        winners.some((w) => w.id === x.id) ? { ...x, score: x.score + 300 } : x,
      ),
    );
    setPriceResult(
      `${winners.map((x) => x.name).join(" + ")} ${winners.length > 1 ? "TIE" : "WINS"} · CLOSEST TO ${cash(settings.target)} · +$300`,
    );
    say(
      `${winners.map((x) => x.name).join(" + ")} ${winners.length > 1 ? "TIE" : "IS CLOSEST"} · +$300`,
    );
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.code === "Space") {
        e.preventDefault();
        setRunning((x) => !x);
      }
      if (e.key === "Enter") correct();
      if (e.key.toLowerCase() === "x") wrong();
      if (e.key.toLowerCase() === "r") reveal();
      if (e.key === "ArrowLeft")
        setActive((a) => (a - 1 + teams.length) % teams.length);
      if (e.key === "ArrowRight" && screen === "chain") nextChain();
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  });
  const resetShow = () => {
    setTeams(initialTeams);
    setActive(0);
    setCi(0);
    setShown([0, 5]);
    setClues({});
    setPi(0);
    setP2i(0);
    setBi(0);
    setPriceDeck([]);
    setPriceDeck2([]);
    setBasketDeck([]);
    setCarts({});
    setCartAmounts({});
    setLocked([]);
    setGuesses({});
    setChoices({});
    setPriceOpen(false);
    setPriceResult("");
    setPractice(true);
    setStage(1);
    setScreen("home");
    say("FULL GAME RESET · NEW RANDOM QUESTIONS READY");
  };
  const jumpPrice = (round: number) => {
    setPractice(false);
    setStage(round);
    setPriceOpen(false);
    setPriceResult("");
    if (round === 1) setPi(0);
    if (round === 2) setP2i(0);
    if (round === 3) {
      setBi(0);
      setCarts({});
      setCartAmounts({});
      setLocked([]);
    }
    setScreen("price");
  };
  const Nav = () => (
    <>
      <header>
        <button className="brand" onClick={() => setScreen("home")}>
          <small>LIVE GAME SHOW</small>
          {eventName}
        </button>
        <nav>
          {(
            ["home", "setup", "content", "settings", "scoreboard"] as Screen[]
          ).map((x) => (
            <button
              key={x}
              className={screen === x ? "on" : ""}
              onClick={() => setScreen(x)}
            >
              {x}
            </button>
          ))}
        </nav>
        <button onClick={() => changeHost(!host)}>
          {host ? "◉ HOST" : "◉ AUDIENCE"}
        </button>
        <button
          onClick={() =>
            document.fullscreenElement
              ? document.exitFullscreen()
              : document.documentElement.requestFullscreen()
          }
        >
          ⛶
        </button>
      </header>
      {screen !== "home" && (
        <div className="scores">
          {teams.map((t, i) => (
            <button
              key={t.id}
              className={active === i ? "active" : ""}
              style={{ "--team": t.color } as any}
              onClick={() => host && setActive(i)}
            >
              <i />
              <span>{t.name}</span>
              <b>{cash(t.score)}</b>
            </button>
          ))}
        </div>
      )}
    </>
  );
  const HostBar = () =>
    host ? (
      <aside>
        <div>
          <small>HOST CONTROL</small>
          <b>{teams[active].name} IS ACTIVE</b>
        </div>
        <button onClick={() => setRunning((x) => !x)}>
          {running ? "Ⅱ PAUSE" : "▶ START"}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setTimer(stage === 2 ? settings.priceTimer : settings.chainTimer);
          }}
        >
          ↻ TIMER
        </button>
        <button onClick={reveal}>◉ REVEAL</button>
        <button className="yes" onClick={correct}>
          ✓ CORRECT
        </button>
        <button className="no" onClick={wrong}>
          ✕ WRONG
        </button>
        <button onClick={nextTeam}>NEXT TEAM</button>
        <button onClick={undo}>↶ UNDO</button>
        <button onClick={() => setHelp(true)}>⌨</button>
      </aside>
    ) : null;
  return (
    <main className={host ? "" : "audience"}>
      {!host && (
        <button className="restorehost" onClick={() => changeHost(true)}>
          ← RETURN TO HOST MODE
        </button>
      )}
      <Nav />
      {!host && screen !== "home" && (
        <div className="audiencebanner">
          LIVE AUDIENCE VIEW · ALL GAMEPLAY IS SYNCED · ANSWERS AND UNREVEALED
          PRICES STAY HIDDEN
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
      {screen === "home" && (
        <section className="hero">
          <span>TONIGHT’S GAMES</span>
          <div className="logo">
            <small>★ THE GREAT FAMILY FACE-OFF ★</small>
            <h1>
              <em>
                {eventName.split(" ").slice(0, -2).join(" ") || eventName}
              </em>
              {eventName.split(" ").slice(-2).join(" ")}
            </h1>
            <p>BIG LAUGHS · BOLD GUESSES · SERIOUS BRAGGING RIGHTS</p>
          </div>
          <div className="picks">
            <button onClick={() => goChain(true)}>
              <i>01</i>
              <small>LINK THE WORDS</small>
              <b>
                CHAIN
                <br />
                REACTION
              </b>
              <u>START TEST ROUND →</u>
            </button>
            <button
              onClick={() => {
                setPractice(true);
                setStage(1);
                setPi(0);
                setPriceOpen(false);
                setScreen("price");
              }}
            >
              <i>02</i>
              <small>GUESS · CHOOSE · BUILD</small>
              <b>
                PRICE
                <br />
                CHALLENGE
              </b>
              <u>START TEST ROUND →</u>
            </button>
          </div>
          <div className="quickstart">
            <div>
              <button onClick={() => goChain(true)}>▶ TEST ROUND</button>
              <button onClick={() => goChain(false)}>
                SKIP TEST · START GAME →
              </button>
            </div>
            <div>
              <button
                onClick={() => {
                  setPractice(true);
                  setStage(1);
                  setPi(0);
                  setPriceOpen(false);
                  setScreen("price");
                }}
              >
                ▶ TEST ROUND
              </button>
              <button
                onClick={() => {
                  setPractice(false);
                  setStage(1);
                  setPi(0);
                  setPriceDeck([]);
                  setPriceDeck2([]);
                  setPriceOpen(false);
                  setScreen("price");
                }}
              >
                SKIP TEST · START GAME →
              </button>
            </div>
          </div>
          {host && (
            <div className="showjump">
              <b>HOST · START ANY ROUND</b>
              <button onClick={() => goChain(false)}>CHAIN ROUND 1</button>
              <button onClick={() => jumpPrice(1)}>PRICE ROUND 1</button>
              <button onClick={() => jumpPrice(2)}>
                PRICE ROUND 2 · 10 ITEMS
              </button>
              <button onClick={() => jumpPrice(3)}>BASKET ROUND</button>
              <button className="reset" onClick={resetShow}>
                RESET & RE-RANDOMIZE
              </button>
            </div>
          )}
          <p className="tip">
            ONE OPTIONAL TEST ROUND PER GAME · Test scores never affect team
            totals{" "}
            <button onClick={() => setScreen("setup")}>TEAM SETUP →</button>
          </p>
        </section>
      )}
      {screen === "setup" && (
        <section className="panel">
          <label className="eyebrow">PRE-SHOW</label>
          <h2>MEET THE TEAMS</h2>
          <p>Edit names and money at any time. Changes save automatically.</p>
          <div className="teamgrid">
            {teams.map((t, i) => (
              <article style={{ "--team": t.color } as any}>
                <small>TEAM {i + 1}</small>
                <input
                  value={t.name}
                  onChange={(e) =>
                    setTeams((a) =>
                      a.map((x) =>
                        x.id === t.id ? { ...x, name: e.target.value } : x,
                      ),
                    )
                  }
                />
                <label>
                  STARTING MONEY
                  <input
                    type="number"
                    value={t.score}
                    onChange={(e) =>
                      setTeams((a) =>
                        a.map((x) =>
                          x.id === t.id ? { ...x, score: +e.target.value } : x,
                        ),
                      )
                    }
                  />
                </label>
                <div>
                  {colors.map((c) => (
                    <button
                      style={{ background: c }}
                      onClick={() =>
                        setTeams((a) =>
                          a.map((x) =>
                            x.id === t.id ? { ...x, color: c } : x,
                          ),
                        )
                      }
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="controls">
            <button
              onClick={() =>
                setTeams((a) => [
                  ...a,
                  {
                    id: Date.now(),
                    name: `TEAM ${a.length + 1}`,
                    color: colors[a.length % 6],
                    score: 0,
                  },
                ])
              }
            >
              + ADD TEAM
            </button>
            {teams.length > 2 && (
              <button onClick={() => setTeams((a) => a.slice(0, -1))}>
                REMOVE LAST
              </button>
            )}
            <button className="primary" onClick={() => setScreen("home")}>
              SAVE & RETURN →
            </button>
          </div>
        </section>
      )}
      {screen === "chain" && (
        <section className="stage">
          <div className="stagehead">
            <div>
              <small>
                {practice
                  ? "PRACTICE ROUND · NO MONEY AT STAKE"
                  : `ROUND ${chain.round} · ${["", "EASY", "MEDIUM", "HARD"][chain.round]} · ${cash(chain.value)} PER WORD`}
              </small>
              <h2>CHAIN REACTION</h2>
            </div>
            <div className={timer <= 3 ? "timer danger" : "timer"}>
              <b>{timer}</b>
              <span>
                <i
                  style={{ width: `${(timer / settings.chainTimer) * 100}%` }}
                />
              </span>
            </div>
          </div>
          <div className="chain">
            {chain.words.map((w, i) => (
              <div className={shown.includes(i) ? "solved" : ""}>
                <small>{String(i + 1).padStart(2, "0")}</small>
                <b>
                  {shown.includes(i)
                    ? w
                    : clues[i]
                      ? w.slice(0, clues[i])
                      : "MYSTERY WORD"}
                </b>
                <em>{shown.includes(i) ? "SOLVED" : "OPEN WORD"}</em>
              </div>
            ))}
          </div>
          {shown.length === chain.words.length && (
            <div className="complete">✦ CHAIN COMPLETE ✦</div>
          )}
          <p className="prompt">
            {teams[active].name} IS UP · GUESS THE OPEN WORD
          </p>
          {host && (
            <div className="controls center">
              <button onClick={() => setRunning((x) => !x)}>
                {running ? "PAUSE" : "START TIMER"}
              </button>
              <button onClick={reveal}>REVEAL LETTER</button>
              <button className="yes" onClick={correct}>
                ✓ CORRECT
              </button>
              <button className="no" onClick={wrong}>
                ✕ WRONG
              </button>
              <button onClick={nextChain}>NEXT CHAIN →</button>
              {practice && (
                <>
                  <button className="primary" onClick={() => goChain(false)}>
                    TEST DONE · START ACTUAL GAME →
                  </button>
                  <button onClick={() => goChain(false)}>SKIP TEST</button>
                </>
              )}
            </div>
          )}
          {host && (
            <div className="secret">
              HOST ANSWER ·{" "}
              {chain.words.find((_, i) => !shown.includes(i)) || "COMPLETE"}{" "}
              <span>{chain.words.join(" → ")}</span>
            </div>
          )}
        </section>
      )}
      {screen === "price" && (
        <section className="stage">
          <div className="stagehead">
            <div>
              <small>
                {practice
                  ? `PRACTICE ${stage} · NO MONEY AT STAKE`
                  : stage === 1
                    ? `QUESTION ${pi + 1} OF 12 · ${product.difficulty} · 4 EASY / 4 MEDIUM / 4 HARD`
                    : stage === 2
                      ? `ROUND 2 · ITEM ${p2i + 1} OF 10 · ALL ITEMS ARE NEW`
                      : `ROUND 3 · BASKET ${bi + 1} OF ${basketDeck.length}`}
              </small>
              <h2>
                {["", "CLASSIC PRICE", "UP OR DOWN", "BUILD THE BASKET"][stage]}
              </h2>
            </div>
            {stage === 2 && (
              <div className="timer danger">
                <b>{timer}</b>
                <span>
                  <i
                    style={{ width: `${(timer / settings.priceTimer) * 100}%` }}
                  />
                </span>
              </div>
            )}
            <div className="tabs">
              {!practice &&
                [1, 2, 3].map((n) => (
                  <button
                    className={stage === n ? "on" : ""}
                    onClick={() => {
                      setStage(n);
                      setPriceOpen(false);
                      setPriceResult("");
                      if (n === 3) {
                        setBi(0);
                        setCarts({});
                        setCartAmounts({});
                        setLocked([]);
                      }
                      setTimer(settings.priceTimer);
                    }}
                  >
                    {n}
                  </button>
                ))}
            </div>
          </div>
          {stage < 3 ? (
            <>
              <div className="product">
                <div>
                  <SafeImage
                    src={product.image}
                    alt={`${product.brand || ""} ${product.name}`.trim()}
                  />
                </div>
                <article>
                  <small>SPOTLIGHT ITEM</small>
                  <h3>{product.name}</h3>
                  <p>
                    {product.brand} · {product.category} · {product.difficulty}
                  </p>
                  <p>{product.size}</p>
                  <u>{product.source}</u>
                  {stage === 2 && (
                    <label>
                      REFERENCE PRICE · {cash(referenceProduct.price)}
                    </label>
                  )}
                  {priceOpen && (
                    <strong>
                      {product.onSale ? "SALE PRICE" : "ACTUAL RETAIL PRICE"} ·{" "}
                      {cash(product.price)}{" "}
                      {product.onSale && product.originalPrice ? (
                        <del>{cash(product.originalPrice)}</del>
                      ) : (
                        ""
                      )}
                    </strong>
                  )}
                </article>
              </div>
              <div className="guessgrid">
                {teams.map((t) => (
                  <article style={{ "--team": t.color } as any}>
                    <b>{t.name}</b>
                    {stage === 1 ? (
                      <>
                        {host && (
                          <input
                            type="number"
                            step=".01"
                            value={guesses[t.id] || ""}
                            onChange={(e) =>
                              setGuesses((g) => ({
                                ...g,
                                [t.id]: e.target.value,
                              }))
                            }
                          />
                        )}
                        <strong>
                          {guesses[t.id] ? cash(+guesses[t.id]) : "—"}
                        </strong>
                      </>
                    ) : (
                      <>
                        <div>
                          <button
                            className={choices[t.id] === "UP" ? "chosen" : ""}
                            onClick={() =>
                              host &&
                              setChoices((c) => ({ ...c, [t.id]: "UP" }))
                            }
                          >
                            ↑ UP
                          </button>
                          <button
                            className={choices[t.id] === "DOWN" ? "chosen" : ""}
                            onClick={() =>
                              host &&
                              setChoices((c) => ({ ...c, [t.id]: "DOWN" }))
                            }
                          >
                            ↓ DOWN
                          </button>
                        </div>
                        {priceOpen && (
                          <strong>
                            {choices[t.id] ===
                            (product.price > referenceProduct.price
                              ? "UP"
                              : "DOWN")
                              ? "✓ CORRECT"
                              : "✕ WRONG"}
                          </strong>
                        )}
                      </>
                    )}
                  </article>
                ))}
              </div>
              {priceResult && (
                <div className="pricewinner">🏆 {priceResult}</div>
              )}
              {host && (
                <div className="controls center">
                  <button onClick={() => setRunning(true)}>START TIMER</button>
                  <button onClick={revealPrice}>LOCK & REVEAL</button>
                  <button
                    onClick={() => {
                      if (!practice && stage === 1 && pi >= 11) {
                        setStage(2);
                        setP2i(0);
                        return;
                      }
                      if (!practice && stage === 2 && p2i >= 9) {
                        setStage(3);
                        setBi(0);
                        setCarts({});
                        setCartAmounts({});
                        setLocked([]);
                      } else if (stage === 2) setP2i((i) => i + 1);
                      else setPi((i) => i + 1);
                      setGuesses({});
                      setChoices({});
                      setPriceOpen(false);
                      setPriceResult("");
                      setTimer(settings.priceTimer);
                    }}
                  >
                    {!practice && stage === 1 && pi >= 11
                      ? "CONTINUE TO ROUND 2 →"
                      : !practice && stage === 2 && p2i >= 9
                        ? "CONTINUE TO BASKET ROUND →"
                        : "NEXT UNIQUE PRODUCT →"}
                  </button>
                  {practice && (
                    <>
                      <button
                        className="primary"
                        onClick={() => {
                          setPractice(false);
                          setStage(1);
                          setPi(0);
                          setPriceDeck([]);
                          setPriceDeck2([]);
                          setPriceOpen(false);
                          setGuesses({});
                          setChoices({});
                        }}
                      >
                        TEST DONE · START ACTUAL GAME →
                      </button>
                      <button
                        onClick={() => {
                          setPractice(false);
                          setStage(1);
                          setPi(0);
                          setPriceDeck([]);
                          setPriceDeck2([]);
                          setPriceOpen(false);
                        }}
                      >
                        SKIP TEST
                      </button>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="target">
                <strong>BUILD A CART CLOSE TO {cash(settings.target)}</strong>
                <p>
                  PICK A SUBSET · {basketPool.length} MIXED ITEMS · GROCERIES +
                  EXPENSIVE DECOYS
                </p>
                {priceOpen && (
                  <b>ALL 20 ITEMS TOTAL · {cash(basket.basket_total)}</b>
                )}
              </div>
              <div className="grocerygrid">
                {basketPool.map((item) => (
                  <article
                    key={item.id}
                    draggable={host}
                    className={
                      (carts[teams[active].id] || []).includes(item.id)
                        ? "used"
                        : ""
                    }
                    onDragStart={(e) =>
                      e.dataTransfer.setData("text/plain", item.id)
                    }
                    onClick={() => addGrocery(teams[active].id, item.id)}
                  >
                    <SafeImage
                      src={item.image_url}
                      alt={`${item.brand} ${item.product_name}`}
                    />
                    <b>{item.product_name}</b>
                    <span>
                      {item.brand} · {item.package_size}
                      {item.quantity > 1 ? ` · QTY ${item.quantity}` : ""}
                    </span>
                    {priceOpen && <strong>{cash(item.extended_price)}</strong>}
                  </article>
                ))}
              </div>
              <div className="carts basketcarts">
                {teams.map((t, i) => (
                  <article
                    key={t.id}
                    className={i === active ? "activecart" : ""}
                    style={{ "--team": t.color } as any}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      addGrocery(t.id, e.dataTransfer.getData("text/plain"));
                    }}
                    onClick={() => host && setActive(i)}
                  >
                    <b>{t.name}</b>
                    <small>
                      DROP ITEMS HERE · {(carts[t.id] || []).length} UNIQUE
                      ITEMS
                    </small>
                    <div>
                      {(carts[t.id] || []).map((id) => {
                        const item = basketPool.find((x) => x.id === id);
                        return item ? (
                          <span key={String(id)}>
                            <SafeImage
                              src={item.image_url}
                              alt={`${item.brand} ${item.product_name}`}
                            />
                            {item.product_name}
                            {host && !priceOpen && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeGrocery(t.id, String(id));
                                }}
                              >
                                ×
                              </button>
                            )}
                          </span>
                        ) : null;
                      })}
                    </div>
                    <strong>{cash(cartAmounts[t.id] || 0)}</strong>
                    <em>
                      {cash(
                        Math.abs(settings.target - (cartAmounts[t.id] || 0)),
                      )}{" "}
                      FROM TARGET
                    </em>
                  </article>
                ))}
              </div>
              {priceResult && (
                <div className="pricewinner">🏆 {priceResult}</div>
              )}
              {host && (
                <div className="controls center">
                  <button onClick={revealBaskets}>LOCK CARTS & SCORE</button>
                  <button
                    onClick={() => {
                      setCarts((c) => ({ ...c, [teams[active].id]: [] }));
                      setCartAmounts((a) => ({ ...a, [teams[active].id]: 0 }));
                    }}
                  >
                    CLEAR ACTIVE CART
                  </button>
                  <button
                    onClick={() => {
                      if (bi >= basketDeck.length - 1) {
                        setScreen("scoreboard");
                        return;
                      }
                      setBi((i) => i + 1);
                      setGuesses({});
                      setCarts({});
                      setCartAmounts({});
                      setLocked([]);
                      setPriceOpen(false);
                      setPriceResult("");
                    }}
                  >
                    {bi >= basketDeck.length - 1
                      ? "FINISH BASKETS →"
                      : "NEXT UNIQUE BASKET →"}
                  </button>
                  {practice && (
                    <button
                      onClick={() => {
                        setPractice(false);
                        setStage(1);
                        setCarts({});
                        setLocked([]);
                      }}
                    >
                      START ROUND 1 →
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      )}
      {screen === "scoreboard" && (
        <section className="standings">
          <small>{eventName}</small>
          <h2>FINAL STANDINGS</h2>
          {[...teams]
            .sort((a, b) => b.score - a.score)
            .map((t, i) => (
              <article style={{ "--team": t.color } as any}>
                <b>{i + 1}</b>
                <span>{t.name}</span>
                <strong>{cash(t.score)}</strong>
              </article>
            ))}
          <div>
            🏆 CHAMPIONS ·{" "}
            {[...teams].sort((a, b) => b.score - a.score)[0].name} 🏆
          </div>
        </section>
      )}
      {screen === "settings" && (
        <section className="panel">
          <label className="eyebrow">SHOW CONTROL</label>
          <h2>GAME SETTINGS</h2>
          <div className="eventname">
            <label>EVENT OR GROUP NAME</label>
            <input
              value={eventName}
              onChange={(e) => setEventName(e.target.value.toUpperCase())}
              placeholder="YOUR PARTY NAME"
            />
            <small>
              Updates every game screen and every connected display.
            </small>
          </div>
          <div className="settinggrid">
            <article>
              <h3>CHAIN REACTION</h3>
              <Toggle
                label="Practice round"
                val={settings.chainPractice}
                set={(v) => setSettings((s) => ({ ...s, chainPractice: v }))}
              />
              <Toggle
                label="Hard round"
                val={settings.hard}
                set={(v) => setSettings((s) => ({ ...s, hard: v }))}
              />
              <Num
                label="Guess timer"
                val={settings.chainTimer}
                set={(v) => setSettings((s) => ({ ...s, chainTimer: v }))}
              />
            </article>
            <article>
              <h3>PRICE CHALLENGE</h3>
              <label>
                Difficulty
                <select
                  value={settings.productDifficulty}
                  onChange={(e) => {
                    setSettings((s) => ({
                      ...s,
                      productDifficulty: e.target.value,
                    }));
                    setPi(0);
                  }}
                >
                  {["ALL", "EASY", "MEDIUM", "HARD"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <label>
                Category
                <select
                  value={settings.productCategory}
                  onChange={(e) => {
                    setSettings((s) => ({
                      ...s,
                      productCategory: e.target.value,
                    }));
                    setPi(0);
                  }}
                >
                  {[
                    "ALL",
                    ...Array.from(
                      new Set(products.map((p) => p.category || "Other")),
                    ),
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <label>
                Price range
                <select
                  value={settings.productPriceRange}
                  onChange={(e) => {
                    setSettings((s) => ({
                      ...s,
                      productPriceRange: e.target.value,
                    }));
                    setPi(0);
                  }}
                >
                  {[
                    "ALL",
                    ...Array.from(
                      new Set(products.map((p) => p.priceRange || "Other")),
                    ),
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <Toggle
                label="Practice sequence"
                val={settings.pricePractice}
                set={(v) => setSettings((s) => ({ ...s, pricePractice: v }))}
              />
              <Toggle
                label="Host sees cart total"
                val={settings.hostTotal}
                set={(v) => setSettings((s) => ({ ...s, hostTotal: v }))}
              />
              <Num
                label="Up / Down timer"
                val={settings.priceTimer}
                set={(v) => setSettings((s) => ({ ...s, priceTimer: v }))}
              />
              <Num
                label="Exact price bonus"
                val={settings.exact}
                set={(v) => setSettings((s) => ({ ...s, exact: v }))}
              />
              <Num
                label="Basket target"
                val={settings.target}
                set={(v) => setSettings((s) => ({ ...s, target: v }))}
              />
              <label>
                Pricing rule
                <select
                  value={settings.rule}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, rule: e.target.value }))
                  }
                >
                  <option value="under">Closest without going over</option>
                  <option value="absolute">Absolute closest</option>
                </select>
              </label>
            </article>
          </div>
          <div className="dangerzone">
            <button
              onClick={() =>
                confirm("Reset all scores?") &&
                setTeams((t) => t.map((x) => ({ ...x, score: 0 })))
              }
            >
              RESET SCORES
            </button>
            <button
              onClick={() =>
                confirm(
                  "Reset the entire show and choose new random questions?",
                ) && resetShow()
              }
            >
              RESET GAME
            </button>
          </div>
        </section>
      )}
      {screen === "content" && (
        <section className="panel">
          <label className="eyebrow">ADMIN · SAVED LOCALLY</label>
          <h2>CONTENT STUDIO</h2>
          <div className="editgrid">
            <div>
              <h3>WORD CHAINS</h3>
              {chains.map((c, i) => (
                <article>
                  <div>
                    <b>{c.title}</b>
                    <span>
                      ROUND {c.round || "P"} · {c.words.join(" → ")}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setChains((x) => [
                        ...x,
                        { ...c, title: c.title + " Copy" },
                      ])
                    }
                  >
                    DUPLICATE
                  </button>
                  <button
                    onClick={() =>
                      setChains((x) => x.filter((_, j) => j !== i))
                    }
                  >
                    DELETE
                  </button>
                </article>
              ))}
              <button
                onClick={() =>
                  setChains((x) => [
                    ...x,
                    {
                      title: "New Chain",
                      round: 1,
                      words: [
                        "START",
                        "WORD",
                        "PLAY",
                        "GROUND",
                        "RULE",
                        "BOOK",
                      ],
                      value: 100,
                    },
                  ])
                }
              >
                + ADD CHAIN
              </button>
            </div>
            <div>
              <h3>PRODUCTS</h3>
              {products.map((p) => (
                <article>
                  <div>
                    <b>
                      <img className="editthumb" src={p.image} alt="" />{" "}
                      {p.name}
                    </b>
                    <span>{cash(p.price)}</span>
                  </div>
                  <button
                    onClick={() =>
                      setProducts((x) => [
                        ...x,
                        { ...p, id: Date.now(), name: p.name + " Copy" },
                      ])
                    }
                  >
                    DUPLICATE
                  </button>
                  <button
                    onClick={() =>
                      setProducts((x) => x.filter((q) => q.id !== p.id))
                    }
                  >
                    DELETE
                  </button>
                </article>
              ))}
              <button
                onClick={() =>
                  setProducts((x) => [
                    ...x,
                    {
                      id: Date.now(),
                      name: "New Product",
                      image: "/products/quiktea.png",
                      price: 9.99,
                      size: "Custom size",
                      source: "Host supplied",
                    },
                  ])
                }
              >
                + ADD PRODUCT
              </button>
            </div>
          </div>
        </section>
      )}
      {screen !== "home" && <HostBar />}
      {help && (
        <div className="modal" onClick={() => setHelp(false)}>
          <article>
            <h3>HOST SHORTCUTS</h3>
            <p>
              SPACE <b>Start / pause</b>
            </p>
            <p>
              ENTER <b>Correct</b>
            </p>
            <p>
              X <b>Wrong</b>
            </p>
            <p>
              R <b>Reveal</b>
            </p>
            <p>
              ← → <b>Team / question</b>
            </p>
          </article>
        </div>
      )}
    </main>
  );
}
function Toggle({
  label,
  val,
  set,
}: {
  label: string;
  val: boolean;
  set: (x: boolean) => void;
}) {
  return (
    <label>
      {label}
      <button
        className={val ? "toggle on" : "toggle"}
        onClick={() => set(!val)}
      >
        <i />
      </button>
    </label>
  );
}
function SafeImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span className="imagefallback">IMAGE UNAVAILABLE</span>
  ) : (
    <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
  );
}
function Num({
  label,
  val,
  set,
}: {
  label: string;
  val: number;
  set: (x: number) => void;
}) {
  return (
    <label>
      {label}
      <input type="number" value={val} onChange={(e) => set(+e.target.value)} />
    </label>
  );
}
