import type {
  AvailableCatalogContext,
  AvailableCatalogItem,
  AvailableModifierItem,
  DashboardModifierAvailability,
  DashboardProductAvailability
} from "./types.js";

const additionNames = new Set([
  "helado",
  "queso",
  "nutella",
  "chocorramo",
  "dulce de mora",
  "crema adicional",
  "barquillo",
  "cerezas",
  "arandanos"
]);

export interface DashboardAvailabilityInput {
  products: DashboardProductAvailability[];
  modifiers?: DashboardModifierAvailability[];
}

export function buildAvailableCatalogContext(
  input: DashboardAvailabilityInput
): AvailableCatalogContext {
  const products = input.products.map(normalizeDashboardProduct);
  const modifiers = (input.modifiers ?? []).map(normalizeDashboardModifier);

  return {
    productos: products.filter(isAvailableProduct),
    toppings: modifiers.filter((modifier) => modifier.isActive && modifier.kind === "topping"),
    adiciones: modifiers.filter((modifier) => modifier.isActive && modifier.kind === "adicion"),
    unavailableProducts: products.filter((product) => !isAvailableProduct(product)),
    unavailableModifiers: modifiers.filter((modifier) => !modifier.isActive)
  };
}

export function buildFlowiseAvailableCatalogText(context: AvailableCatalogContext): string {
  return JSON.stringify(
    {
      productos: context.productos.map(compactProduct),
      toppings: context.toppings.map(compactModifier),
      adiciones: context.adiciones.map(compactModifier)
    },
    null,
    2
  );
}

export function isProductAvailableByName(
  name: string,
  context?: AvailableCatalogContext
): boolean | undefined {
  const normalizedName = normalizeName(name);
  const available = context?.productos.some((product) => normalizeName(product.name) === normalizedName);
  if (available) {
    return true;
  }

  const unavailable = context?.unavailableProducts?.some(
    (product) => normalizeName(product.name) === normalizedName
  );
  if (unavailable) {
    return false;
  }

  return undefined;
}

export function isKnownProductName(name: string, context?: AvailableCatalogContext): boolean {
  const normalizedName = normalizeName(name);

  if (context) {
    return [...context.productos, ...(context.unavailableProducts ?? [])].some(
      (product) => normalizeName(product.name) === normalizedName
    );
  }

  return fallbackProductNames.has(normalizedName);
}

export function isModifierAvailableByName(
  name: string,
  context?: AvailableCatalogContext
): boolean | undefined {
  const normalizedName = normalizeName(name);
  const available = [...(context?.toppings ?? []), ...(context?.adiciones ?? [])].some(
    (modifier) => normalizeName(modifier.name) === normalizedName
  );
  if (available) {
    return true;
  }

  const unavailable = context?.unavailableModifiers?.some(
    (modifier) => normalizeName(modifier.name) === normalizedName
  );
  if (unavailable) {
    return false;
  }

  return undefined;
}

export function availableFresasOptions(context?: AvailableCatalogContext): string[] {
  const fallback = [
    "tradicional",
    "con helado",
    "crema de Oreo",
    "Mix Oreo",
    "Mix Oreo Milo",
    "fresa con crema + Oreo + Milo",
    "chocolate",
    "explosion de chocolate",
    "frutos rojos"
  ];

  if (!context) {
    return fallback;
  }

  const options = [
    ["Fresas con crema tradicional", "tradicional"],
    ["Fresas con helado", "con helado"],
    ["Fresas con crema de Oreo", "crema de Oreo"],
    ["Mix Oreo", "Mix Oreo"],
    ["Mix Oreo Milo", "Mix Oreo Milo"],
    ["Fresa con crema + Oreo + Milo", "fresa con crema + Oreo + Milo"],
    ["Fresas con chocolate", "chocolate"],
    ["Fresas explosion de chocolate", "explosion de chocolate"],
    ["Fresas frutos rojos", "frutos rojos"]
  ];

  return options
    .filter(([productName]) => isProductAvailableByName(productName, context) !== false)
    .map(([, label]) => label);
}

function normalizeDashboardProduct(product: DashboardProductAvailability): AvailableCatalogItem {
  const isActive = product.isActive !== false;
  const isOutOfStock =
    Boolean(product.isOutOfStock) || product.availabilityStatus === "out_of_stock";
  const availabilityStatus = !isActive ? "hidden" : isOutOfStock ? "out_of_stock" : "available";

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.basePrice ?? product.price ?? 0,
    isActive,
    isOutOfStock,
    availabilityStatus
  };
}

function normalizeDashboardModifier(modifier: DashboardModifierAvailability): AvailableModifierItem {
  const name = modifier.name;

  return {
    id: modifier.id ?? name,
    name,
    price: modifier.priceDelta ?? modifier.price ?? 0,
    isActive: modifier.isActive !== false,
    kind: additionNames.has(normalizeName(name)) ? "adicion" : "topping"
  };
}

function isAvailableProduct(product: AvailableCatalogItem): boolean {
  return product.isActive && !product.isOutOfStock && product.availabilityStatus === "available";
}

function compactProduct(product: AvailableCatalogItem) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price
  };
}

function compactModifier(modifier: AvailableModifierItem) {
  return {
    id: modifier.id,
    name: modifier.name,
    price: modifier.price
  };
}

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

const fallbackProductNames = new Set(
  [
    "Fresas con crema tradicional",
    "Fresas con helado",
    "Durazno con crema",
    "Combinado fresa durazno con crema",
    "Combinado fresa durazno con helado",
    "Combinado fresa banano con crema",
    "Fresas con crema de Oreo",
    "Mix Oreo",
    "Mix Oreo Milo",
    "Fresa con crema + Oreo + Milo",
    "Fresas con chocolate",
    "Fresas explosion de chocolate",
    "Fresas frutos rojos",
    "Love Banana",
    "Maracufresa",
    "Arequipe",
    "Arequipe crema",
    "Arequipe dulce de mora",
    "Arequipe queso",
    "Nutella",
    "Arequipe crema y dulce de mora",
    "Arequipe queso y crema",
    "Crema y Nutella",
    "Arequipe queso crema dulce de mora",
    "Arequipe queso crema fresa",
    "Arequipe queso crema durazno",
    "Arequipe queso crema dulce de mora fresa",
    "Arequipe queso crema dulce de mora durazno",
    "Oblea arequipe",
    "Oblea arequipe crema",
    "Oblea arequipe dulce de mora",
    "Oblea arequipe queso",
    "Oblea Nutella",
    "Oblea arequipe crema y dulce de mora",
    "Oblea arequipe queso y crema",
    "Oblea crema y Nutella",
    "Oblea arequipe queso crema dulce de mora",
    "Oblea arequipe queso crema fresa",
    "Oblea arequipe queso crema durazno",
    "Oblea arequipe queso crema dulce de mora fresa",
    "Oblea arequipe queso crema dulce de mora durazno",
    "Malteada de Fresa",
    "Malteada de Chocolate",
    "Malteada de Vainilla",
    "Malteada de Oreo",
    "Malteada",
    "Brownie con helado",
    "Wafle tradicional",
    "Wafle chocolate",
    "Vaso fantasia",
    "Pavlova",
    "Vaso helado un sabor",
    "Vaso helado dos sabores",
    "Vaso waffle"
  ].map(normalizeName)
);
