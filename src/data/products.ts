// Interface do produto — espelha a tabela `products` do Supabase
export interface Product {
  id: string;
  name: string;
  reference: string;
  price: number;
  old_price?: number;
  oldPrice?: number;
  category: string;
  gender: string;
  line: string;
  mechanism: string;
  case_material: string;
  caseMaterial: string;
  strap_material: string;
  strapMaterial: string;
  dial_color: string;
  dialColor: string;
  water_resistance: string;
  waterResistance: string;
  case_size: string;
  caseSize: string;
  thickness: string;
  images: string[];
  description: string;
  is_new?: boolean;
  isNew?: boolean;
  is_bestseller?: boolean;
  isBestseller?: boolean;
  is_used?: boolean;
  isUsed?: boolean;
  condition?: string | null;
  active?: boolean;
  created_at?: string;
}

export const CONDITIONS = [
  'Seminovo',
  'Ótimo Estado',
  'Bom Estado',
  'Com Detalhes',
  'Para Revisão',
] as const;

export type Condition = typeof CONDITIONS[number];

// Normaliza um produto do Supabase (snake_case) para o formato da UI (camelCase)
export function normalizeProduct(raw: Record<string, unknown>): Product {
  return {
    ...raw,
    id: raw.id as string,
    name: raw.name as string,
    reference: raw.reference as string,
    price: raw.price as number,
    old_price: raw.old_price as number | undefined,
    oldPrice: raw.old_price as number | undefined,
    category: raw.category as string,
    gender: raw.gender as string,
    line: raw.line as string,
    mechanism: raw.mechanism as string,
    case_material: raw.case_material as string,
    caseMaterial: raw.case_material as string,
    strap_material: raw.strap_material as string,
    strapMaterial: raw.strap_material as string,
    dial_color: raw.dial_color as string,
    dialColor: raw.dial_color as string,
    water_resistance: raw.water_resistance as string,
    waterResistance: raw.water_resistance as string,
    case_size: raw.case_size as string,
    caseSize: raw.case_size as string,
    thickness: raw.thickness as string,
    images: raw.images as string[],
    description: raw.description as string,
    is_new: raw.is_new as boolean | undefined,
    isNew: raw.is_new as boolean | undefined,
    is_bestseller: raw.is_bestseller as boolean | undefined,
    isBestseller: raw.is_bestseller as boolean | undefined,
    is_used: raw.is_used as boolean | undefined,
    isUsed: raw.is_used as boolean | undefined,
    condition: raw.condition as string | null | undefined,
    active: raw.active as boolean | undefined,
    created_at: raw.created_at as string | undefined,
  } as Product;
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};
