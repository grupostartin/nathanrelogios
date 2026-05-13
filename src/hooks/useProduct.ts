import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product, normalizeProduct } from '../data/products';

interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

export function useProduct(id: string | undefined): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchProduct() {
      setLoading(true);
      setError(null);

      const { data, error: supaError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('active', true)
        .single();

      if (cancelled) return;

      if (supaError) {
        setError(supaError.message);
        setProduct(null);
      } else {
        setProduct(data ? normalizeProduct(data) : null);
      }

      setLoading(false);
    }

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, loading, error };
}
