import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product, normalizeProduct } from '../data/products';

interface UseProductsOptions {
  category?: string | null;
  gender?: string | null;
  line?: string | null;
  isUsed?: boolean | null;
  onlyActive?: boolean;
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const { category, gender, line, isUsed, onlyActive = true } = options;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (onlyActive) {
        query = query.eq('active', true);
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (gender) {
        query = query.eq('gender', gender);
      }

      if (line) {
        query = query.eq('line', line);
      }

      if (isUsed !== null && isUsed !== undefined) {
        query = query.eq('is_used', isUsed);
      }

      const { data, error: supaError } = await query;

      if (cancelled) return;

      if (supaError) {
        setError(supaError.message);
        setLoading(false);
        return;
      }

      setProducts((data ?? []).map(normalizeProduct));
      setLoading(false);
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [category, gender, line, isUsed, onlyActive, tick]);

  return {
    products,
    loading,
    error,
    refetch: () => setTick(t => t + 1),
  };
}
