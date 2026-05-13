import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, normalizeProduct, formatPrice, CONDITIONS } from '../data/products';
import ImageUploader from '../components/ImageUploader';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Loader2,
  LogOut, Save, X, ChevronLeft, Package, Layout, LayoutDashboard, Mail
} from 'lucide-react';

const ADMIN_PASSWORD = 'nathan2025';

interface SoldProduct {
  id: string;
  original_id?: string;
  name: string;
  reference: string;
  price: number;
  category: string;
  gender: string;
  is_used: boolean;
  condition?: string | null;
  images: string[];
  sold_at: string;
}

interface HomeSection {
  id: string;
  type: 'hero' | 'featured_products' | 'category_grid' | 'trust_bar' | 'banner_split' | 'instagram' | 'newsletter' | 'flash_sale';
  position: number;
  active: boolean;
  title?: string | null;
  subtitle?: string | null;
  label?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  image_url?: string | null;
  bg_color?: string | null;
  config: Record<string, any>;
}

interface NewsletterSubscription {
  id: string;
  email: string;
  created_at: string;
}


// ─── Formulário em branco ────────────────────────────────────────────────────
const emptyForm = {
  name: '',
  reference: '',
  price: '',
  old_price: '',
  category: '',
  gender: 'Masculino',
  line: '',
  mechanism: '',
  case_material: '',
  strap_material: '',
  dial_color: '',
  water_resistance: '',
  case_size: '',
  thickness: '',
  images: [] as string[],
  description: '',
  is_new: false,
  is_bestseller: false,
  is_used: false,
  condition: '',
  active: true,
};

type FormData = typeof emptyForm;

// ─── Admin Page ──────────────────────────────────────────────────────────────
export default function Admin() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [soldModal, setSoldModal] = useState<Product | null>(null);

  const [view, setView] = useState<'list' | 'form'>('list');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'home' | 'leads'>('dashboard');
  const [soldProducts, setSoldProducts] = useState<SoldProduct[]>([]);
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState<NewsletterSubscription[]>([]);

  const [sections, setSections] = useState<HomeSection[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [formError, setFormError] = useState('');

  // ── Auth ──────────────────────────────────────────────────────────────────
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  }

  // ── Fetch products ────────────────────────────────────────────────────────
  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data.map(normalizeProduct));
    }
    setLoading(false);
  }

  async function fetchSoldProducts() {
    const { data } = await supabase
      .from('sold_products')
      .select('*')
      .order('sold_at', { ascending: false });
    if (data) setSoldProducts(data as SoldProduct[]);
  }

  async function fetchSections() {
    const { data } = await supabase
      .from('homepage_sections')
      .select('*')
      .order('position');
    if (data) setSections(data as HomeSection[]);
  }

  async function fetchNewsletterSubscriptions() {
    const { data } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setNewsletterSubscriptions(data as NewsletterSubscription[]);
  }


  useEffect(() => {
    if (authenticated) {
      fetchProducts();
      fetchSoldProducts();
      fetchSections();
      fetchNewsletterSubscriptions();
    }
  }, [authenticated]);

  // ── Form helpers ──────────────────────────────────────────────────────────
  function openNew() {
    setEditingProduct(null);
    setForm(emptyForm);
    setFormError('');
    setView('form');
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      reference: product.reference,
      price: String(product.price),
      old_price: product.old_price ? String(product.old_price) : '',
      category: product.category,
      gender: product.gender,
      line: product.line,
      mechanism: product.mechanism,
      case_material: product.case_material,
      strap_material: product.strap_material,
      dial_color: product.dial_color,
      water_resistance: product.water_resistance,
      case_size: product.case_size,
      thickness: product.thickness,
      images: product.images,
      description: product.description,
      is_new: product.is_new ?? false,
      is_bestseller: product.is_bestseller ?? false,
      is_used: product.is_used ?? false,
      condition: product.condition ?? '',
      active: product.active ?? true,
    });
    setFormError('');
    setView('form');
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    if (!form.name || !form.reference || !form.price || !form.category || !form.description) {
      setFormError('Preencha todos os campos obrigatórios (*).');
      return;
    }

    const imagesArray = form.images.filter(Boolean);

    if (imagesArray.length === 0) {
      setFormError('Adicione pelo menos uma imagem.');
      return;
    }

    const payload = {
      name: form.name,
      reference: form.reference,
      price: parseFloat(form.price),
      old_price: form.old_price ? parseFloat(form.old_price) : null,
      category: form.category,
      gender: form.gender,
      line: form.line,
      mechanism: form.mechanism,
      case_material: form.case_material,
      strap_material: form.strap_material,
      dial_color: form.dial_color,
      water_resistance: form.water_resistance,
      case_size: form.case_size,
      thickness: form.thickness,
      images: imagesArray,
      description: form.description,
      is_new: form.is_new,
      is_bestseller: form.is_bestseller,
      is_used: form.is_used,
      condition: form.is_used ? (form.condition || null) : null,
      active: form.active,
    };

    setSaving(true);

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', editingProduct.id);
      if (error) { setFormError(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('products').insert([payload]);
      if (error) { setFormError(error.message); setSaving(false); return; }
    }

    setSaving(false);
    setView('list');
    fetchProducts();
  }

  async function toggleActive(product: Product) {
    setTogglingId(product.id);
    const { error } = await supabase
      .from('products')
      .update({ active: !product.active })
      .eq('id', product.id);
    if (error) {
      alert(`Erro ao alterar status: ${error.message}`);
    }
    setTogglingId(null);
    fetchProducts();
  }

  async function deleteProduct(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) return;
    setDeletingId(id);
    await supabase.from('products').delete().eq('id', id);
    setDeletingId(null);
    fetchProducts();
  }

  async function markAsSold(product: Product) {
    setDeletingId(product.id);
    // Registrar a venda antes de deletar
    await supabase.from('sold_products').insert([{
      original_id: product.id,
      name: product.name,
      reference: product.reference,
      price: product.price,
      category: product.category,
      gender: product.gender,
      is_used: product.is_used ?? false,
      condition: product.condition ?? null,
      images: product.images,
    }]);
    await supabase.from('products').delete().eq('id', product.id);
    setDeletingId(null);
    setSoldModal(null);
    fetchProducts();
    fetchSoldProducts();
  }

  // ── Sold confirmation modal ───────────────────────────────────────────────
  const SoldModal = soldModal ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'rgba(0,0,0,0.55)' }}>
      <div className="bg-secondary w-full max-w-md p-10 shadow-2xl">
        <div className="flex items-start gap-5 mb-8">
          <div className="shrink-0 w-16 h-16 bg-offwhite border border-gray-light overflow-hidden">
            <img src={soldModal.images[0]} alt={soldModal.name} className="w-full h-full object-cover mix-blend-multiply" />
          </div>
          <div>
            <h2 className="font-serif text-xl mb-1">Marcar como Vendido?</h2>
            <p className="font-sans text-sm font-medium text-primary">{soldModal.name}</p>
            <p className="font-mono text-xs text-gray-medium mt-0.5">{soldModal.reference}</p>
          </div>
        </div>
        <p className="font-sans text-sm text-gray-medium mb-8 leading-relaxed">
          O produto será <strong>removido permanentemente</strong> do catálogo.
          Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setSoldModal(null)}
            className="flex-1 py-4 border border-gray-light text-gray-medium font-sans uppercase text-xs tracking-widest hover:border-primary hover:text-primary transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => markAsSold(soldModal)}
            disabled={deletingId === soldModal.id}
            className="flex-1 py-4 bg-gold text-secondary font-sans uppercase text-xs tracking-widest font-semibold hover:bg-primary transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {deletingId === soldModal.id
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : '✓ Confirmar Venda'
            }
          </button>
        </div>
      </div>
    </div>
  ) : null;

  // ── Login Screen ──────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-6">
        <div className="w-full max-w-sm bg-secondary p-10 shadow-2xl">
          <div className="text-center mb-10">
            <span className="label-caps text-gold block mb-3">Nathan Relógios</span>
            <h1 className="font-serif text-3xl">Painel Admin</h1>
            <p className="font-sans text-xs text-gray-medium mt-2 tracking-wider">Acesso restrito</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="label-caps text-gray-medium block mb-2">Senha</label>
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className={`w-full border px-4 py-3 font-sans text-sm bg-offwhite outline-none focus:border-primary transition-colors ${passwordError ? 'border-red-400' : 'border-gray-light'}`}
                placeholder="••••••••"
                autoFocus
              />
              {passwordError && (
                <p className="font-sans text-xs text-red-500 mt-2">Senha incorreta.</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-primary text-secondary font-sans uppercase text-xs tracking-widest font-semibold hover:bg-gold transition-colors duration-300"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  if (view === 'form') {
    return (
      <div className="min-h-screen bg-offwhite">
        <header className="bg-secondary border-b border-gray-light px-6 lg:px-16 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView('list')}
              className="text-gray-medium hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="font-serif text-xl">
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </h1>
          </div>
          <button
            onClick={() => { setAuthenticated(false); setPasswordInput(''); }}
            className="flex items-center gap-2 text-gray-medium hover:text-primary text-xs uppercase tracking-widest transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <form onSubmit={handleSave} className="space-y-8">

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 font-sans text-sm flex items-center gap-3">
                <X className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            {/* Seção: Identificação */}
            <div className="bg-secondary p-8 border border-gray-light">
              <h2 className="font-serif text-lg mb-6 pb-4 border-b border-gray-light">Identificação</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Nome do Produto *" name="name" value={form.name} onChange={handleChange} />
                <Field label="Referência *" name="reference" value={form.reference} onChange={handleChange} placeholder="Ex: BN2036-14E" />
                <Field label="Preço (R$) *" name="price" value={form.price} onChange={handleChange} type="number" placeholder="3890.00" />
                <Field label="Preço Antigo (R$)" name="old_price" value={form.old_price} onChange={handleChange} type="number" placeholder="Opcional" />
                <div>
                  <label className="label-caps text-gray-medium block mb-2">Categoria *</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full border border-gray-light px-4 py-3 font-sans text-sm bg-offwhite outline-none focus:border-primary transition-colors">
                    <option value="">Selecione...</option>
                    {['Mergulho', 'Esportivo', 'Social', 'Casual', 'Colecionável'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-caps text-gray-medium block mb-2">Gênero *</label>
                  <select name="gender" value={form.gender} onChange={handleChange}
                    className="w-full border border-gray-light px-4 py-3 font-sans text-sm bg-offwhite outline-none focus:border-primary transition-colors">
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Unissex">Unissex</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Seção: Especificações */}
            <div className="bg-secondary p-8 border border-gray-light">
              <h2 className="font-serif text-lg mb-6 pb-4 border-b border-gray-light">Especificações Técnicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Linha" name="line" value={form.line} onChange={handleChange} placeholder="Ex: Eco-Drive" />
                <Field label="Mecanismo" name="mechanism" value={form.mechanism} onChange={handleChange} placeholder="Ex: Eco-Drive (Solar)" />
                <Field label="Material da Caixa" name="case_material" value={form.case_material} onChange={handleChange} placeholder="Ex: Aço Inox" />
                <Field label="Material da Pulseira" name="strap_material" value={form.strap_material} onChange={handleChange} placeholder="Ex: Borracha" />
                <Field label="Cor do Mostrador" name="dial_color" value={form.dial_color} onChange={handleChange} placeholder="Ex: Preto" />
                <Field label="Resistência à Água" name="water_resistance" value={form.water_resistance} onChange={handleChange} placeholder="Ex: 200m / 20 ATM" />
                <Field label="Tamanho da Caixa" name="case_size" value={form.case_size} onChange={handleChange} placeholder="Ex: 46mm" />
                <Field label="Espessura" name="thickness" value={form.thickness} onChange={handleChange} placeholder="Ex: 16mm" />
              </div>
            </div>

            {/* Seção: Descrição e Imagens */}
            <div className="bg-secondary p-8 border border-gray-light">
              <h2 className="font-serif text-lg mb-6 pb-4 border-b border-gray-light">Descrição e Imagens</h2>
              <div className="space-y-6">
                <div>
                  <label className="label-caps text-gray-medium block mb-2">Descrição *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-light px-4 py-3 font-sans text-sm bg-offwhite outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Descreva o produto..."
                  />
                </div>
                <ImageUploader
                  images={form.images}
                  onChange={imgs => setForm(f => ({ ...f, images: imgs }))}
                />
              </div>
            </div>

            {/* Seção: Flags */}
            <div className="bg-secondary p-8 border border-gray-light">
              <h2 className="font-serif text-lg mb-6 pb-4 border-b border-gray-light">Configurações e Status</h2>

              {/* Status ativo/inativo — destaque */}
              <div className="mb-8 p-5 border-2 border-gray-light flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-sans text-sm font-semibold">
                    Status do Produto
                  </p>
                  <p className="font-sans text-xs text-gray-medium mt-1">
                    Produtos inativos ficam ocultos na loja, mas continuam cadastrados.
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, active: true }))}
                    className={`px-6 py-3 font-sans text-xs uppercase tracking-widest font-semibold border transition-colors ${
                      form.active
                        ? 'bg-primary text-secondary border-primary'
                        : 'border-gray-light text-gray-medium hover:border-primary hover:text-primary'
                    }`}
                  >
                    ✓ Ativo
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, active: false }))}
                    className={`px-6 py-3 font-sans text-xs uppercase tracking-widest font-semibold border transition-colors ${
                      !form.active
                        ? 'bg-gray-medium text-secondary border-gray-medium'
                        : 'border-gray-light text-gray-medium hover:border-gray-medium'
                    }`}
                  >
                    ✗ Inativo
                  </button>
                </div>
              </div>

              {/* Relógio Usado */}
              <div className="mb-6 p-5 border border-gray-light">
                <CheckboxField
                  label="Relógio Usado / Seminovo"
                  name="is_used"
                  checked={form.is_used}
                  onChange={handleChange}
                  description="Marque se este é um relógio de segunda mão"
                />
                {form.is_used && (
                  <div className="mt-5 ml-7">
                    <label className="label-caps text-gray-medium block mb-2">Condição *</label>
                    <div className="flex flex-wrap gap-2">
                      {CONDITIONS.map(cond => (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, condition: cond }))}
                          className={`px-4 py-2 font-sans text-xs uppercase tracking-widest border transition-colors ${
                            form.condition === cond
                              ? conditionStyle(cond).selected
                              : 'border-gray-light text-gray-medium hover:border-primary hover:text-primary'
                          }`}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                    {!form.condition && (
                      <p className="font-sans text-xs text-red-400 mt-2">Selecione uma condição.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-8">
                <CheckboxField label="Produto Novo" name="is_new" checked={form.is_new} onChange={handleChange} description="Exibe badge 'Novo'" />
                <CheckboxField label="Produto Destaque" name="is_bestseller" checked={form.is_bestseller} onChange={handleChange} description="Exibe badge 'Destaque' e aparece na Home" />
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => setView('list')}
                className="px-8 py-4 border border-gray-light text-gray-medium font-sans uppercase text-xs tracking-widest hover:border-primary hover:text-primary transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-10 py-4 bg-primary text-secondary font-sans uppercase text-xs tracking-widest font-semibold hover:bg-gold transition-colors duration-300 flex items-center gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Salvando...' : 'Salvar Produto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── List ──────────────────────────────────────────────────────────────────
  return (
    <>
      {SoldModal}
      <div className="min-h-screen bg-offwhite">
      <header className="bg-secondary border-b border-gray-light px-6 lg:px-16 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-5 h-5 text-gold" />
          <h1 className="font-serif text-xl">Nathan Relógios Admin</h1>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'products' && (
            <button
              onClick={openNew}
              className="flex items-center gap-2 bg-primary text-secondary px-5 py-2.5 font-sans uppercase text-xs tracking-widest font-semibold hover:bg-gold transition-colors duration-300"
            >
              <Plus className="w-4 h-4" />
              Novo Produto
            </button>
          )}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 border border-gray-light text-gray-medium hover:border-primary hover:text-primary px-4 py-2.5 text-xs uppercase tracking-widest transition-colors font-sans"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar à Loja
          </button>
          <button
            onClick={() => { setAuthenticated(false); setPasswordInput(''); }}
            className="flex items-center gap-2 text-gray-medium hover:text-primary text-xs uppercase tracking-widest transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      {/* Tab navigation */}
      <div className="bg-secondary border-b border-gray-light px-6 lg:px-16">
        <nav className="flex gap-0">
          {([['dashboard', 'Dashboard'], ['products', 'Produtos'], ['home', 'Página Inicial']] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 font-sans text-xs uppercase tracking-widest font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-medium hover:text-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-12">

        {activeTab === 'dashboard' ? (
          <Dashboard
            products={products}
            soldProducts={soldProducts}
          />
        ) : activeTab === 'leads' ? (
          <div className="bg-secondary border border-gray-light">
            <div className="p-8 border-b border-gray-light flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl mb-1">Inscritos na Newsletter</h2>
                <p className="font-sans text-xs text-gray-medium uppercase tracking-widest">
                  {newsletterSubscriptions.length} contatos capturados
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-offwhite border-b border-gray-light">
                    <th className="px-8 py-4 font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-gray-medium">E-mail</th>
                    <th className="px-8 py-4 font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-gray-medium">Data de Cadastro</th>
                  </tr>
                </thead>
                <tbody>
                  {newsletterSubscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b border-gray-light hover:bg-offwhite/50 transition-colors">
                      <td className="px-8 py-6 font-sans text-sm font-medium">{sub.email}</td>
                      <td className="px-8 py-6 font-sans text-xs text-gray-medium uppercase tracking-wider">
                        {new Date(sub.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                  {newsletterSubscriptions.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-8 py-12 text-center font-sans text-gray-medium italic">
                        Nenhum inscrito ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'home' ? (
          <HomeEditor
            sections={sections}
            onRefresh={fetchSections}
          />
        ) : (
          <>
            {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total de Produtos', value: products.length },
            { label: 'Ativos', value: products.filter(p => p.active).length },
            { label: 'Inativos', value: products.filter(p => !p.active).length },
            { label: 'Destaques', value: products.filter(p => p.is_bestseller).length },
          ].map(stat => (
            <div key={stat.label} className="bg-secondary border border-gray-light p-6 text-center">
              <p className="font-serif text-3xl mb-1">{stat.value}</p>
              <p className="label-caps text-gray-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-10 h-10 text-gold animate-spin" />
          </div>
        ) : (
          <div className="bg-secondary border border-gray-light overflow-hidden">
            <table className="w-full">
              <thead className="bg-offwhite border-b border-gray-light">
                <tr>
                  <th className="text-left px-6 py-4 label-caps text-gray-medium">Produto</th>
                  <th className="text-left px-6 py-4 label-caps text-gray-medium hidden md:table-cell">Referência</th>
                  <th className="text-left px-6 py-4 label-caps text-gray-medium hidden lg:table-cell">Categoria</th>
                  <th className="text-right px-6 py-4 label-caps text-gray-medium">Preço</th>
                  <th className="text-center px-6 py-4 label-caps text-gray-medium">Status</th>
                  <th className="text-right px-6 py-4 label-caps text-gray-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-light">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-offwhite/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 shrink-0 bg-offwhite border border-gray-light overflow-hidden hidden sm:block">
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                        </div>
                        <div>
                          <p className="font-sans text-sm font-medium text-primary">{product.name}</p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {product.is_new && <span className="font-sans text-[9px] uppercase tracking-widest bg-primary text-secondary px-2 py-0.5">Novo</span>}
                            {product.is_bestseller && <span className="font-sans text-[9px] uppercase tracking-widest bg-gold text-secondary px-2 py-0.5">Destaque</span>}
                            {product.is_used && (
                              <span className={`font-sans text-[9px] uppercase tracking-widest px-2 py-0.5 border ${
                                conditionStyle(product.condition ?? '').badge
                              }`}>
                                {product.condition ?? 'Usado'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="font-mono text-xs text-gray-medium">{product.reference}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="font-sans text-xs text-gray-medium">{product.category} · {product.gender}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-sans text-sm font-medium">{formatPrice(product.price)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => toggleActive(product)}
                          title={product.active ? 'Clique para desativar' : 'Clique para ativar'}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-widest font-sans font-semibold border transition-all duration-200 ${
                            product.active
                              ? 'border-green-300 text-green-700 bg-green-50 hover:bg-red-50 hover:border-red-300 hover:text-red-700'
                              : 'border-gray-light text-gray-medium bg-white hover:border-green-300 hover:text-green-700 hover:bg-green-50'
                          } ${togglingId === product.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={togglingId === product.id}
                        >
                          {togglingId === product.id
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : product.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />
                          }
                          {togglingId === product.id ? '...' : product.active ? 'Ativo' : 'Inativo'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSoldModal(product)}
                          title="Marcar como Vendido"
                          className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-sans font-semibold border border-gold text-gold hover:bg-gold hover:text-secondary transition-colors"
                        >
                          Vendido
                        </button>
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 text-gray-medium hover:text-primary transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          disabled={deletingId === product.id}
                          className="p-2 text-gray-medium hover:text-red-500 transition-colors disabled:opacity-40"
                          title="Excluir permanentemente"
                        >
                          {deletingId === product.id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && !loading && (
              <div className="py-24 text-center">
                <Package className="w-12 h-12 text-gray-light mx-auto mb-4" />
                <p className="font-serif text-xl text-gray-medium">Nenhum produto cadastrado.</p>
                <button
                  onClick={openNew}
                  className="mt-6 font-sans text-sm uppercase tracking-widest text-gold hover:underline"
                >
                  Cadastrar primeiro produto
                </button>
              </div>
            )}
          </div>
        )}
        </>
        )}
      </div>
    </div>
    </>
  );
}

// ─── Dashboard Component ─────────────────────────────────────────────────────
interface DashboardProps {
  products: Product[];
  soldProducts: SoldProduct[];
}

function Dashboard({ products, soldProducts }: DashboardProps) {
  const total     = products.length;
  const ativos    = products.filter(p => p.active).length;
  const inativos  = products.filter(p => !p.active).length;
  const novos     = products.filter(p => p.is_new).length;
  const usados    = products.filter(p => p.is_used).length;
  const destaques = products.filter(p => p.is_bestseller).length;
  const vendidos  = soldProducts.length;
  const receita   = soldProducts.reduce((s, p) => s + Number(p.price), 0);

  const fmtR = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  // Bar chart por categoria
  const cats = products.reduce<Record<string, number>>((a, p) => {
    a[p.category] = (a[p.category] || 0) + 1; return a;
  }, {});
  const catEntries = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(...Object.values(cats), 1);

  // Gauge arc (SVG) para receita
  const maxRevEstimate = Math.max(receita * 1.5, 10000);
  const gaugePct = Math.min(receita / maxRevEstimate, 1);
  const r = 70; const cx = 90; const cy = 90;
  const arcLen = Math.PI * r;
  const dashOffset = arcLen * (1 - gaugePct);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }} className="space-y-5">

      {/* ── Row 1: Bento grid top ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* DARK CARD — Catálogo */}
        <div className="lg:col-span-2 rounded-3xl p-8 flex flex-col justify-between min-h-[280px]"
          style={{ background: '#111' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#999' }}>Estatísticas do Catálogo</p>
              <p className="text-5xl font-bold text-white leading-none">{total}</p>
              <p className="text-xs mt-1" style={{ color: '#6EE7B7' }}>↑ {ativos} ativos · {inativos} inativos</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: '#222', color: '#6EE7B7' }}>Catálogo</span>
          </div>

          {/* Bar chart por categoria */}
          <div className="mt-6 flex items-end gap-3 h-20">
            {catEntries.length === 0 ? (
              <p className="text-xs" style={{ color: '#666' }}>Sem produtos.</p>
            ) : catEntries.map(([cat, count], i) => {
              const pct = (count / maxCat) * 100;
              const colors = ['#6EE7B7', '#A78BFA', '#6EE7B7', '#A78BFA', '#6EE7B7'];
              return (
                <div key={cat} className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-[10px]" style={{ color: '#666' }}>{count}</span>
                  <div className="w-full rounded-xl transition-all duration-700 relative overflow-hidden"
                    style={{ height: `${Math.max(pct * 0.7, 14)}px`, background: '#222' }}>
                    <div className="absolute bottom-0 w-full rounded-xl transition-all duration-700"
                      style={{ height: `${Math.min(pct, 100)}%`, background: colors[i % colors.length] }} />
                  </div>
                  <span className="text-[9px] text-center truncate w-full" style={{ color: '#555' }}>{cat}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN — 2 mini cards stacked */}
        <div className="flex flex-col gap-5">
          {/* Vendidos chip */}
          <div className="rounded-3xl p-7 flex flex-col justify-between flex-1"
            style={{ background: '#A78BFA' }}>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest font-semibold text-white/70">Vendidos</p>
              <span className="text-lg">↗</span>
            </div>
            <div className="mt-4">
              <p className="text-5xl font-bold text-white leading-none">{vendidos}</p>
              <p className="text-xs text-white/70 mt-1">produtos vendidos</p>
            </div>
          </div>

          {/* Novos chip */}
          <div className="rounded-3xl p-7 flex flex-col justify-between flex-1"
            style={{ background: '#6EE7B7' }}>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#065F46' }}>Novos</p>
              <span className="text-lg">✦</span>
            </div>
            <div className="mt-4">
              <p className="text-5xl font-bold leading-none" style={{ color: '#065F46' }}>{novos}</p>
              <p className="text-xs mt-1" style={{ color: '#047857' }}>com badge "novo"</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Gauge + Stats + Recent ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* GAUGE — Receita */}
        <div className="rounded-3xl p-8 bg-white border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">Receita de Vendas</p>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">Total</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-4">
            <svg width="180" height="100" viewBox="0 0 180 100">
              {/* Track */}
              <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                fill="none" stroke="#F3F4F6" strokeWidth="14" strokeLinecap="round" />
              {/* Fill */}
              <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                fill="none" stroke="#6EE7B7" strokeWidth="14" strokeLinecap="round"
                strokeDasharray={arcLen}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 1s ease' }} />
              {/* Dot */}
              <circle r="5" fill="#065F46"
                cx={cx + r * Math.cos(Math.PI - gaugePct * Math.PI)}
                cy={cy - r * Math.sin(gaugePct * Math.PI)} />
            </svg>
            <p className="text-3xl font-bold text-gray-900 -mt-4">{fmtR(receita)}</p>
            <p className="text-xs text-gray-400 mt-1">de {vendidos} venda{vendidos !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* STATS GRID — 6 mini chips */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Ativos',    value: ativos,    bg: '#F0FDF4', color: '#16A34A' },
            { label: 'Inativos',  value: inativos,  bg: '#F9FAFB', color: '#6B7280' },
            { label: 'Usados',    value: usados,    bg: '#FFFBEB', color: '#D97706' },
            { label: 'Destaques', value: destaques, bg: '#FEF9C3', color: '#CA8A04' },
            { label: 'Categorias', value: catEntries.length, bg: '#EFF6FF', color: '#2563EB' },
            { label: 'Total',     value: total,     bg: '#111',    color: '#6EE7B7' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 flex flex-col justify-between"
              style={{ background: s.bg }}>
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: s.color, opacity: 0.7 }}>{s.label}</p>
              <p className="text-3xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* RECENT SALES */}
        <div className="rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800 text-sm">Últimas Vendas</p>
              <p className="text-xs text-gray-400 mt-0.5">{vendidos} registros</p>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#6EE7B7' }}>
              <span className="text-sm">↗</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {soldProducts.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-xs text-gray-400">Nenhuma venda ainda</p>
              </div>
            ) : soldProducts.slice(0, 5).map((s, i) => (
              <div key={s.id}
                className="flex items-center gap-3 px-6 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  {s.images[0] && <img src={s.images[0]} alt={s.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{s.name}</p>
                  <p className="text-[10px] text-gray-400">{fmtDate(s.sold_at)}</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 shrink-0">{fmtR(Number(s.price))}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── HomeEditor Component ─────────────────────────────────────────────────────
const SECTION_LABELS: Record<string, string> = {
  hero: 'Banner Principal (Hero)',
  featured_products: 'Produtos em Destaque',
  category_grid: 'Grade de Categorias',
  trust_bar: 'Barra de Confiança',
  banner_split: 'Banner Dividido (Texto + Imagem)',
  instagram: 'Feed do Instagram',
};

interface HomeEditorProps {
  sections: HomeSection[];
  onRefresh: () => void;
}

function HomeEditor({ sections, onRefresh }: HomeEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [localEdits, setLocalEdits] = useState<Partial<HomeSection>>({});
  const [embedCode, setEmbedCode] = useState('');

  function startEdit(s: HomeSection) {
    setEditingId(s.id);
    setEmbedCode(s.config?.embedCode || '');
    setLocalEdits({
      title: s.title, subtitle: s.subtitle, label: s.label,
      cta_label: s.cta_label, cta_url: s.cta_url,
      image_url: s.image_url, bg_color: s.bg_color,
    });
  }

  function cancelEdit() { setEditingId(null); setLocalEdits({}); }

  async function saveEdit(s: HomeSection) {
    setSavingId(s.id);
    const updatedConfig = { ...s.config, ...(s.type === 'instagram' ? { embedCode } : {}) };
    await supabase.from('homepage_sections').update({ ...localEdits, config: updatedConfig }).eq('id', s.id);
    setSavingId(null);
    setEditingId(null);
    onRefresh();
  }

  async function toggleActive(s: HomeSection) {
    await supabase.from('homepage_sections').update({ active: !s.active }).eq('id', s.id);
    onRefresh();
  }

  async function moveSection(s: HomeSection, dir: -1 | 1) {
    const sorted = [...sections].sort((a, b) => a.position - b.position);
    const idx = sorted.findIndex(x => x.id === s.id);
    const target = sorted[idx + dir];
    if (!target) return;
    await supabase.from('homepage_sections').update({ position: target.position }).eq('id', s.id);
    await supabase.from('homepage_sections').update({ position: s.position }).eq('id', target.id);
    onRefresh();
  }

  const sorted = [...sections].sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-2xl">Configurar Página Inicial</h2>
          <p className="font-sans text-sm text-gray-medium mt-1">Edite, reordene e ative/desative cada seção da home.</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="font-sans text-xs uppercase tracking-widest text-gold hover:underline flex items-center gap-1">
          Ver home ↗
        </a>
      </div>

      {sorted.map((s, idx) => (
        <div key={s.id} className={`bg-secondary border transition-all ${s.active ? 'border-gray-light' : 'border-dashed border-gray-light opacity-60'}`}>
          {/* Section header */}
          <div className="flex items-center gap-4 px-6 py-4">
            {/* Order arrows */}
            <div className="flex flex-col gap-0.5">
              <button onClick={() => moveSection(s, -1)} disabled={idx === 0}
                className="text-gray-light hover:text-primary disabled:opacity-20 transition-colors leading-none text-xs">▲</button>
              <button onClick={() => moveSection(s, 1)} disabled={idx === sorted.length - 1}
                className="text-gray-light hover:text-primary disabled:opacity-20 transition-colors leading-none text-xs">▼</button>
            </div>
            {/* Label */}
            <div className="flex-1">
              <p className="font-sans font-semibold text-sm">{SECTION_LABELS[s.type] || s.type}</p>
              <p className="font-mono text-[10px] text-gray-medium uppercase tracking-wider">{s.type}</p>
            </div>
            {/* Active toggle */}
            <button onClick={() => toggleActive(s)}
              className={`text-[10px] uppercase tracking-widest font-semibold px-3 py-1.5 border transition-colors ${
                s.active
                  ? 'border-green-300 text-green-700 bg-green-50 hover:bg-red-50 hover:border-red-300 hover:text-red-700'
                  : 'border-gray-light text-gray-medium hover:border-green-300 hover:text-green-700'
              }`}>
              {s.active ? 'Visível' : 'Oculta'}
            </button>
            {/* Edit toggle */}
            <button onClick={() => editingId === s.id ? cancelEdit() : startEdit(s)}
              className="p-2 text-gray-medium hover:text-primary transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
          </div>

          {/* Edit panel */}
          {editingId === s.id && (
            <div className="border-t border-gray-light px-6 py-6 bg-offwhite space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {['hero','featured_products','category_grid','trust_bar','banner_split','instagram'].includes(s.type) && (
                  <>
                    {s.type !== 'category_grid' && s.type !== 'trust_bar' && (
                      <div className="md:col-span-2">
                        <label className="label-caps text-gray-medium block mb-2">Título</label>
                        <input
                          value={localEdits.title || ''}
                          onChange={e => setLocalEdits(p => ({ ...p, title: e.target.value }))}
                          className="w-full border border-gray-light bg-secondary px-4 py-3 font-sans text-sm outline-none focus:border-primary"
                          placeholder="Título da seção"
                        />
                      </div>
                    )}
                    {['hero','banner_split','featured_products'].includes(s.type) && (
                      <div className="md:col-span-2">
                        <label className="label-caps text-gray-medium block mb-2">Subtítulo</label>
                        <textarea
                          value={localEdits.subtitle || ''}
                          onChange={e => setLocalEdits(p => ({ ...p, subtitle: e.target.value }))}
                          rows={2}
                          className="w-full border border-gray-light bg-secondary px-4 py-3 font-sans text-sm outline-none focus:border-primary resize-none"
                          placeholder="Subtítulo ou descrição"
                        />
                      </div>
                    )}
                    <div>
                      <label className="label-caps text-gray-medium block mb-2">Label (eyebrow)</label>
                      <input
                        value={localEdits.label || ''}
                        onChange={e => setLocalEdits(p => ({ ...p, label: e.target.value }))}
                        className="w-full border border-gray-light bg-secondary px-4 py-3 font-sans text-sm outline-none focus:border-primary"
                        placeholder="Ex: Seleção Exclusiva"
                      />
                    </div>
                    <div>
                      <label className="label-caps text-gray-medium block mb-2">Cor de fundo</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={localEdits.bg_color || '#ffffff'}
                          onChange={e => setLocalEdits(p => ({ ...p, bg_color: e.target.value }))}
                          className="w-10 h-10 border border-gray-light cursor-pointer"
                        />
                        <input
                          value={localEdits.bg_color || '#ffffff'}
                          onChange={e => setLocalEdits(p => ({ ...p, bg_color: e.target.value }))}
                          className="flex-1 border border-gray-light bg-secondary px-4 py-3 font-mono text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    {s.type !== 'category_grid' && s.type !== 'trust_bar' && s.type !== 'instagram' && (
                      <div className="md:col-span-2">
                        <label className="label-caps text-gray-medium block mb-2">URL da imagem</label>
                        <input
                          value={localEdits.image_url || ''}
                          onChange={e => setLocalEdits(p => ({ ...p, image_url: e.target.value }))}
                          className="w-full border border-gray-light bg-secondary px-4 py-3 font-sans text-sm outline-none focus:border-primary"
                          placeholder="https://..."
                        />
                        {localEdits.image_url && (
                          <div className="mt-2 h-24 overflow-hidden border border-gray-light">
                            <img src={localEdits.image_url} alt="preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    )}
                    <div>
                      <label className="label-caps text-gray-medium block mb-2">Botão (texto)</label>
                      <input
                        value={localEdits.cta_label || ''}
                        onChange={e => setLocalEdits(p => ({ ...p, cta_label: e.target.value }))}
                        className="w-full border border-gray-light bg-secondary px-4 py-3 font-sans text-sm outline-none focus:border-primary"
                        placeholder="Ex: Ver Coleção"
                      />
                    </div>
                    <div>
                      <label className="label-caps text-gray-medium block mb-2">Botão (URL)</label>
                      <input
                        value={localEdits.cta_url || ''}
                        onChange={e => setLocalEdits(p => ({ ...p, cta_url: e.target.value }))}
                        className="w-full border border-gray-light bg-secondary px-4 py-3 font-sans text-sm outline-none focus:border-primary"
                        placeholder="/catalogo"
                      />
                    </div>
                    {s.type === 'instagram' && (
                      <div className="md:col-span-2">
                        <label className="label-caps text-gray-medium block mb-2">Embed Code (Elfsight / Behold)</label>
                        <p className="font-sans text-xs text-gray-medium mb-3">
                          Cole aqui o código de embed do seu Instagram. Recomendamos o <a href="https://elfsight.com/instagram-feed-widget/" target="_blank" rel="noopener noreferrer" className="text-gold underline">Elfsight</a> (gratuito).
                        </p>
                        <textarea
                          value={embedCode}
                          onChange={e => setEmbedCode(e.target.value)}
                          rows={4}
                          className="w-full border border-gray-light bg-secondary px-4 py-3 font-mono text-xs outline-none focus:border-primary resize-y"
                          placeholder='<div class="elfsight-app-xxx"></div>&#10;<script src="https://static.elfsight.com/platform/platform.js"></script>'
                        />
                        {embedCode && (
                          <p className="text-xs text-emerald-600 mt-2">✓ Embed code definido — salve para ativar.</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => saveEdit(s)} disabled={savingId === s.id}
                  className="flex items-center gap-2 bg-primary text-secondary px-8 py-3 font-sans uppercase text-xs tracking-widest font-semibold hover:bg-gold transition-colors disabled:opacity-60">
                  {savingId === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Salvar
                </button>
                <button onClick={cancelEdit}
                  className="px-6 py-3 border border-gray-light text-gray-medium font-sans text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function conditionStyle(condition: string) {
  switch (condition) {
    case 'Seminovo':    return { selected: 'bg-emerald-600 text-white border-emerald-600', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'Ótimo Estado': return { selected: 'bg-green-600 text-white border-green-600',   badge: 'bg-green-100 text-green-800 border-green-200' };
    case 'Bom Estado':  return { selected: 'bg-blue-600 text-white border-blue-600',      badge: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'Com Detalhes': return { selected: 'bg-amber-600 text-white border-amber-600',   badge: 'bg-amber-100 text-amber-800 border-amber-200' };
    case 'Para Revisão': return { selected: 'bg-red-600 text-white border-red-600',       badge: 'bg-red-100 text-red-800 border-red-200' };
    default:            return { selected: 'bg-primary text-secondary border-primary',    badge: 'bg-gray-100 text-gray-700 border-gray-200' };
  }
}

// ─── Componentes auxiliares de formulário ────────────────────────────────────
function Field({
  label, name, value, onChange, type = 'text', placeholder
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="label-caps text-gray-medium block mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        step={type === 'number' ? '0.01' : undefined}
        className="w-full border border-gray-light px-4 py-3 font-sans text-sm bg-offwhite outline-none focus:border-primary transition-colors"
      />
    </div>
  );
}

function CheckboxField({
  label, name, checked, onChange, description
}: {
  label: string; name: string; checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 w-4 h-4 accent-primary"
      />
      <div>
        <span className="font-sans text-sm font-medium group-hover:text-primary transition-colors">{label}</span>
        {description && <p className="font-sans text-xs text-gray-medium mt-0.5">{description}</p>}
      </div>
    </label>
  );
}
