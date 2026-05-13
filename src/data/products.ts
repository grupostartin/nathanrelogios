export interface Product {
  id: string;
  name: string;
  reference: string;
  price: number;
  oldPrice?: number;
  category: string;
  gender: string;
  line: string;
  mechanism: string;
  caseMaterial: string;
  strapMaterial: string;
  dialColor: string;
  waterResistance: string;
  caseSize: string;
  thickness: string;
  images: string[];
  description: string;
  isNew?: boolean;
  isBestseller?: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Citizen Promaster Aqualand',
    reference: 'BN2036-14E',
    price: 3890.0,
    oldPrice: 4290.0,
    category: 'Mergulho',
    gender: 'Masculino',
    line: 'Eco-Drive',
    mechanism: 'Eco-Drive (Solar)',
    caseMaterial: 'Aço Inox',
    strapMaterial: 'Borracha',
    dialColor: 'Preto',
    waterResistance: '200m / 20 ATM',
    caseSize: '46mm',
    thickness: '16mm',
    description: 'Um ícone para mergulhadores profissionais. O Promaster Aqualand combina precisão Eco-Drive com medição de profundidade.',
    isBestseller: true,
    images: [
      'https://images.unsplash.com/photo-1548171915-e76a3ff999de?w=800&q=80',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80',
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80'
    ]
  },
  {
    id: '2',
    name: 'Citizen Tsuyosa Automático',
    reference: 'NJ0150-81Z',
    price: 2490.0,
    category: 'Casual',
    gender: 'Masculino',
    line: 'Automático',
    mechanism: 'Automático Calibre 8210',
    caseMaterial: 'Aço Inox',
    strapMaterial: 'Aço Inox',
    dialColor: 'Amarelo',
    waterResistance: '50m / 5 ATM',
    caseSize: '40mm',
    thickness: '11mm',
    description: 'A coleção Tsuyosa traz um design integrado de caixa e pulseira em aço, com um mostrador vibrante sob vidro de safira.',
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80',
      'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80',
      'https://images.unsplash.com/photo-1524592094714-cb9c76eb8f25?w=800&q=80',
      'https://images.unsplash.com/photo-1539874754593-ba824fa54228?w=800&q=80'
    ]
  },
  {
    id: '3',
    name: 'Citizen Elegance Titanium',
    reference: 'BM7431-51E',
    price: 1990.0,
    category: 'Social',
    gender: 'Masculino',
    line: 'Eco-Drive',
    mechanism: 'Eco-Drive (Solar)',
    caseMaterial: 'Super Titânio',
    strapMaterial: 'Super Titânio',
    dialColor: 'Preto',
    waterResistance: '100m / 10 ATM',
    caseSize: '43mm',
    thickness: '10mm',
    description: 'O luxo do Super Titânio, mais leve e resistente que o aço, combinado com a conveniência de nunca precisar trocar a bateria.',
    images: [
      'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800&q=80',
      'https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=800&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80',
      'https://images.unsplash.com/photo-1549972352-7e0e7a8eef3c?w=800&q=80'
    ]
  },
  {
    id: '4',
    name: 'Citizen L Ambiluna Collection',
    reference: 'EM0640-58D',
    price: 2150.0,
    category: 'Social',
    gender: 'Feminino',
    line: 'Eco-Drive',
    mechanism: 'Eco-Drive (Solar)',
    caseMaterial: 'Aço Inox',
    strapMaterial: 'Aço Inox (Malha)',
    dialColor: 'Madrepérola',
    waterResistance: '50m / 5 ATM',
    caseSize: '31mm',
    thickness: '8mm',
    description: 'A delicadeza e força da coleção Citizen L, inspirada na harmonia da natureza, com vidro de safira curvo.',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
      'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=800&q=80',
      'https://images.unsplash.com/photo-1501162946741-4960f913f01c?w=800&q=80',
      'https://images.unsplash.com/photo-1614729939124-032f0b5609ce?w=800&q=80'
    ]
  },
  {
    id: '5',
    name: 'Citizen Promaster Nighthawk',
    reference: 'BJ7000-52E',
    price: 3200.0,
    category: 'Esportivo',
    gender: 'Masculino',
    line: 'Eco-Drive',
    mechanism: 'Eco-Drive (Solar) Dual Time',
    caseMaterial: 'Aço Inox',
    strapMaterial: 'Aço Inox',
    dialColor: 'Preto',
    waterResistance: '200m / 20 ATM',
    caseSize: '42mm',
    thickness: '12mm',
    description: 'Design voltado para aviação com régua de cálculo no aro interno e segundo fuso horário. Estética instrumental e robusta.',
    isBestseller: true,
    images: [
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80',
      'https://images.unsplash.com/photo-1548171915-e76a3ff999de?w=800&q=80',
      'https://images.unsplash.com/photo-1587836374828-cb4387df3eb7?w=800&q=80',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80'
    ]
  },
  {
    id: '6',
    name: 'Citizen Silhouette Crystal',
    reference: 'EX1480-15D',
    price: 1590.0,
    category: 'Casual',
    gender: 'Feminino',
    line: 'Eco-Drive',
    mechanism: 'Eco-Drive (Solar)',
    caseMaterial: 'Aço Inox',
    strapMaterial: 'Couro',
    dialColor: 'Preto',
    waterResistance: '30m / 3 ATM',
    caseSize: '29mm',
    thickness: '7mm',
    description: 'A elegância encontra o estilo de dia-a-dia em um relógio cravejado de cristais e pulseira de couro macio.',
    images: [
      'https://images.unsplash.com/photo-1584208124888-3a20b9c799e2?w=800&q=80',
      'https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=800&q=80',
      'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=800&q=80',
      'https://images.unsplash.com/photo-1517464016625-a13123869cb0?w=800&q=80'
    ]
  }
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};
