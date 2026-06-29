export interface SuperCategory {
  id: string;
  name: string;
  icon: string;
}

export interface SubCategory {
  id: string;
  name: string;
  icon: string;
  superCategoryId: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;            // Descripción corta (≤2 líneas en carta)
  superCategoryId: string;        // Relación con SuperCategory
  subCategoryId: string;          // Relación con SubCategory
  image: string;
  available: boolean;
  spicyLevel?: 0 | 1 | 2 | 3;

  // ── Campos para carta digital ─────────────────────────
  price?: number;                 // Precio en moneda local (opcional)
  priceIncludesTax?: boolean;     // true = "Impuestos incluidos", false = "+impuestos"
  isBestSeller?: boolean;         // Badge ⭐ Favorito / Más pedido
  isVegan?: boolean;              // Badge 🌱 Vegano / Vegetariano

  // Información progresiva (solo visible en modal de detalle)
  ingredients?: string;           // "Carne de res, cilantro, cebolla blanca..."
  includes?: string;              // "Consomé para dipear y limones incluidos"
  pairingNote?: string;           // "Combina muy bien con nuestra limonada de la casa"
  allergenNote?: string;          // "Libre de gluten. Contiene lácteos (opcional)."
}

// Mock inicial de Categorías Principales
export const MOCK_SUPER_CATEGORIES: SuperCategory[] = [
  { id: "alimentos", name: "Alimentos", icon: "🍲" },
  { id: "bebidas",   name: "Bebidas",   icon: "🥤" }
];

// Mock inicial de Subcategorías
export const MOCK_SUB_CATEGORIES: SubCategory[] = [
  { id: "caldos",   name: "Caldos",             icon: "🍜", superCategoryId: "alimentos" },
  { id: "mains",    name: "Segundos",            icon: "🌮", superCategoryId: "alimentos" },
  { id: "sides",    name: "Acompañantes",        icon: "🌽", superCategoryId: "alimentos" },
  { id: "desserts", name: "Postres",             icon: "🍮", superCategoryId: "alimentos" },
  { id: "aguas",    name: "Aguas Tradicionales", icon: "🥤", superCategoryId: "bebidas"   },
  { id: "sodas",    name: "Refrescos",           icon: "🥤", superCategoryId: "bebidas"   },
  { id: "hotdrinks",name: "Calientes",           icon: "☕", superCategoryId: "bebidas"   }
];

// Mock del Menú — con todos los campos de la carta digital
export const MOCK_MENU: MenuItem[] = [
  {
    id: "caldo-1",
    name: "Caldo de Gallina Especial",
    description: "Gallina tierna con fideos de huevo, huevo duro, cebollín y jengibre fresco en su propio consomé.",
    superCategoryId: "alimentos",
    subCategoryId: "caldos",
    image: "https://images.unsplash.com/photo-1602253057119-44d745d9b860?q=80&w=600&auto=format&fit=crop",
    available: true,
    spicyLevel: 0,
    price: 95,
    priceIncludesTax: true,
    isBestSeller: true,
    isVegan: false,
    ingredients: "Gallina de rancho, fideos de huevo artesanales, huevo duro, cebollín fresco, jengibre natural, sal de mar y especias de la casa.",
    includes: "Tortillas de maíz hechas a mano y limones.",
    pairingNote: "Combina perfecto con nuestro Agua de Jamaica Orgánica o una limonada fría.",
    allergenNote: "Contiene gluten (fideos) y huevo. Sin lácteos."
  },
  {
    id: "caldo-2",
    name: "Caldo de Res Casero",
    description: "Consomé concentrado con trozos de res, elote, yuca, zanahoria y calabacitas, servido bien caliente.",
    superCategoryId: "alimentos",
    subCategoryId: "caldos",
    image: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?q=80&w=600&auto=format&fit=crop",
    available: true,
    spicyLevel: 1,
    price: 110,
    priceIncludesTax: true,
    isBestSeller: false,
    isVegan: false,
    ingredients: "Carne de res de primera, elote tierno, yuca, zanahoria, calabacitas y hierbas de olor.",
    includes: "Dos tortillas de maíz y salsa verde.",
    pairingNote: "Ideal acompañado de nuestro Agua de Horchata Cremosa.",
    allergenNote: "Libre de gluten. Sin lácteos ni huevo."
  },
  {
    id: "caldo-3",
    name: "Sopa Azteca Tradicional",
    description: "Caldo de jitomate con tiras crujientes de tortilla, aguacate, queso fresco, crema y chile pasilla.",
    superCategoryId: "alimentos",
    subCategoryId: "caldos",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600&auto=format&fit=crop",
    available: true,
    spicyLevel: 2,
    price: 85,
    priceIncludesTax: false,
    isBestSeller: false,
    isVegan: false,
    ingredients: "Jitomate asado, chile pasilla, tortillas de maíz fritas, aguacate Hass, queso fresco, crema ácida y epazote.",
    includes: "Tiras de tortilla crujientes adicionales al lado.",
    pairingNote: "Excelente con un café de olla caliente o agua de tamarindo.",
    allergenNote: "Contiene lácteos (queso y crema). Sin gluten. Picante moderado."
  },
  {
    id: "caldo-4",
    name: "Pozole Rojo de Camarón",
    description: "Caldo de chiles secos con maíz pozolero y camarones seleccionados, con lechuga, rábano y orégano.",
    superCategoryId: "alimentos",
    subCategoryId: "caldos",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=600&auto=format&fit=crop",
    available: true,
    spicyLevel: 3,
    price: 135,
    priceIncludesTax: false,
    isBestSeller: true,
    isVegan: false,
    ingredients: "Camarones frescos, maíz pozolero nixtamalizado, chile guajillo, chile ancho, ajo, cebolla y orégano seco.",
    includes: "Lechuga, rábano, cebolla picada, orégano y tostadas.",
    pairingNote: "El maridaje ideal es una cerveza fría o nuestra agua de Jamaica bien fría.",
    allergenNote: "Contiene mariscos (camarón). Libre de gluten y lácteos. Muy picante."
  },
  {
    id: "main-1",
    name: "Tacos de Barbacoa Dorados",
    description: "Tres tacos dorados rellenos de barbacoa de res, salsa verde cremosa, lechuga y queso cotija.",
    superCategoryId: "alimentos",
    subCategoryId: "mains",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop",
    available: true,
    spicyLevel: 1,
    price: 120,
    priceIncludesTax: true,
    isBestSeller: true,
    isVegan: false,
    ingredients: "Barbacoa de res cocinada 8 horas en horno de tierra, tortilla de maíz, salsa verde asada, lechuga orejona y queso cotija.",
    includes: "Consomé de la barbacoa en taza aparte y salsa roja.",
    pairingNote: "Perfectos con un agua de horchata o Jamaica bien fría.",
    allergenNote: "Contiene lácteos (queso cotija). Libre de gluten."
  },
  {
    id: "side-1",
    name: "Elote Loco Asado",
    description: "Mazorca a la parrilla con mayonesa casera, queso Cotija espolvoreado y chile en polvo.",
    superCategoryId: "alimentos",
    subCategoryId: "sides",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=600&auto=format&fit=crop",
    available: true,
    spicyLevel: 1,
    price: 45,
    priceIncludesTax: true,
    isBestSeller: false,
    isVegan: false,
    ingredients: "Mazorca de maíz dulce, mayonesa artesanal, queso Cotija, chile en polvo y limón.",
    includes: "Limones y servilletas extra.",
    pairingNote: "Ideal como entrada antes de tu caldo favorito.",
    allergenNote: "Contiene lácteos (queso) y huevo (mayonesa). Sin gluten."
  },
  {
    id: "side-2",
    name: "Quesadillas de Comal",
    description: "Dos quesadillas en comal de barro, rellenas de queso Oaxaca fundido y flor de calabaza.",
    superCategoryId: "alimentos",
    subCategoryId: "sides",
    image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=600&auto=format&fit=crop",
    available: true,
    spicyLevel: 0,
    price: 55,
    priceIncludesTax: true,
    isBestSeller: false,
    isVegan: true,
    ingredients: "Masa de maíz azul hecha a mano, queso Oaxaca artesanal, flor de calabaza y epazote.",
    includes: "Salsa verde y roja de la casa.",
    pairingNote: "Combina muy bien con un agua de Jamaica o un té de hierbas caliente.",
    allergenNote: "Contiene lácteos (queso). Libre de gluten. Vegetariano."
  },
  {
    id: "drink-1",
    name: "Agua de Jamaica Orgánica",
    description: "Infusión de flor de jamaica premium con toque de menta dulce, naturalmente refrescante.",
    superCategoryId: "bebidas",
    subCategoryId: "aguas",
    image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=600&auto=format&fit=crop",
    available: true,
    spicyLevel: 0,
    price: 35,
    priceIncludesTax: true,
    isBestSeller: true,
    isVegan: true,
    ingredients: "Flor de jamaica orgánica, agua filtrada, azúcar de caña y menta fresca.",
    includes: "Vaso grande con hielo y limón.",
    pairingNote: "El acompañante perfecto para cualquier caldo o plato fuerte.",
    allergenNote: "Sin alérgenos comunes. Vegano. Sin gluten."
  },
  {
    id: "drink-2",
    name: "Agua de Horchata Cremosa",
    description: "Bebida de arroz con vainilla natural, leche evaporada y canela espolvoreada.",
    superCategoryId: "bebidas",
    subCategoryId: "aguas",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=600&auto=format&fit=crop",
    available: true,
    spicyLevel: 0,
    price: 35,
    priceIncludesTax: true,
    isBestSeller: false,
    isVegan: false,
    ingredients: "Arroz blanco, leche evaporada, vainilla natural, canela en rama y azúcar de caña.",
    includes: "Vaso grande con hielo y pajita.",
    pairingNote: "Perfecta para equilibrar el picante de la Sopa Azteca o el Pozole.",
    allergenNote: "Contiene lácteos (leche evaporada). Sin gluten."
  },
  {
    id: "dessert-1",
    name: "Flan Napolitano de la Abuela",
    description: "Flan casero horneado a baño María con caramelo suave e infusión de naranja.",
    superCategoryId: "alimentos",
    subCategoryId: "desserts",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=600&auto=format&fit=crop",
    available: true,
    spicyLevel: 0,
    price: 60,
    priceIncludesTax: true,
    isBestSeller: false,
    isVegan: false,
    ingredients: "Huevo fresco, leche condensada, crema ácida, queso crema y ralladura de naranja natural.",
    includes: "Caramelo artesanal y crema batida.",
    pairingNote: "El broche de oro perfecto junto a un café de olla o té de canela.",
    allergenNote: "Contiene lácteos y huevo. Sin gluten."
  }
];

const STORAGE_KEYS = {
  SUPER_CATS:  "caldo_super_categories",
  SUB_CATS:    "caldo_sub_categories",
  MENU_ITEMS:  "caldo_menu_items"
};

// Helpers para localStorage
const getLocalData = <T>(key: string, fallback: T[]): T[] => {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return fallback;
  }
};

const saveLocalData = <T>(key: string, data: T[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event("caldo_menu_updated"));
  }
};

export const api = {
  // ----------------------------------------------------
  // CRUD Categorías Principales (Super Categories)
  // ----------------------------------------------------
  getSuperCategories: async (): Promise<SuperCategory[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getLocalData<SuperCategory>(STORAGE_KEYS.SUPER_CATS, MOCK_SUPER_CATEGORIES));
      }, 100);
    });
  },

  createSuperCategory: async (item: Omit<SuperCategory, "id">): Promise<SuperCategory> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getLocalData<SuperCategory>(STORAGE_KEYS.SUPER_CATS, MOCK_SUPER_CATEGORIES);
        const newItem: SuperCategory = { ...item, id: `super-${Date.now()}` };
        data.push(newItem);
        saveLocalData(STORAGE_KEYS.SUPER_CATS, data);
        resolve(newItem);
      }, 100);
    });
  },

  updateSuperCategory: async (id: string, updated: Partial<SuperCategory>): Promise<SuperCategory | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getLocalData<SuperCategory>(STORAGE_KEYS.SUPER_CATS, MOCK_SUPER_CATEGORIES);
        const index = data.findIndex((x) => x.id === id);
        if (index !== -1) {
          data[index] = { ...data[index], ...updated };
          saveLocalData(STORAGE_KEYS.SUPER_CATS, data);
          resolve(data[index]);
        } else {
          resolve(null);
        }
      }, 100);
    });
  },

  deleteSuperCategory: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getLocalData<SuperCategory>(STORAGE_KEYS.SUPER_CATS, MOCK_SUPER_CATEGORIES);
        saveLocalData(STORAGE_KEYS.SUPER_CATS, data.filter((x) => x.id !== id));

        const subCats = getLocalData<SubCategory>(STORAGE_KEYS.SUB_CATS, MOCK_SUB_CATEGORIES);
        saveLocalData(STORAGE_KEYS.SUB_CATS, subCats.filter((sub) => sub.superCategoryId !== id));

        const menu = getLocalData<MenuItem>(STORAGE_KEYS.MENU_ITEMS, MOCK_MENU);
        saveLocalData(STORAGE_KEYS.MENU_ITEMS, menu.filter((item) => item.superCategoryId !== id));

        resolve(true);
      }, 100);
    });
  },

  // ----------------------------------------------------
  // CRUD Subcategorías (Sub Categories)
  // ----------------------------------------------------
  getSubCategories: async (): Promise<SubCategory[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getLocalData<SubCategory>(STORAGE_KEYS.SUB_CATS, MOCK_SUB_CATEGORIES));
      }, 100);
    });
  },

  createSubCategory: async (item: Omit<SubCategory, "id">): Promise<SubCategory> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getLocalData<SubCategory>(STORAGE_KEYS.SUB_CATS, MOCK_SUB_CATEGORIES);
        const newItem: SubCategory = { ...item, id: `sub-${Date.now()}` };
        data.push(newItem);
        saveLocalData(STORAGE_KEYS.SUB_CATS, data);
        resolve(newItem);
      }, 100);
    });
  },

  updateSubCategory: async (id: string, updated: Partial<SubCategory>): Promise<SubCategory | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getLocalData<SubCategory>(STORAGE_KEYS.SUB_CATS, MOCK_SUB_CATEGORIES);
        const index = data.findIndex((x) => x.id === id);
        if (index !== -1) {
          data[index] = { ...data[index], ...updated };
          saveLocalData(STORAGE_KEYS.SUB_CATS, data);
          resolve(data[index]);
        } else {
          resolve(null);
        }
      }, 100);
    });
  },

  deleteSubCategory: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getLocalData<SubCategory>(STORAGE_KEYS.SUB_CATS, MOCK_SUB_CATEGORIES);
        saveLocalData(STORAGE_KEYS.SUB_CATS, data.filter((x) => x.id !== id));

        const menu = getLocalData<MenuItem>(STORAGE_KEYS.MENU_ITEMS, MOCK_MENU);
        saveLocalData(STORAGE_KEYS.MENU_ITEMS, menu.filter((item) => item.subCategoryId !== id));

        resolve(true);
      }, 100);
    });
  },

  // ----------------------------------------------------
  // CRUD Platos del Menú (MenuItems)
  // ----------------------------------------------------
  getMenu: async (): Promise<MenuItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getLocalData<MenuItem>(STORAGE_KEYS.MENU_ITEMS, MOCK_MENU));
      }, 150);
    });
  },

  createMenuItem: async (item: Omit<MenuItem, "id">): Promise<MenuItem> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const menu = getLocalData<MenuItem>(STORAGE_KEYS.MENU_ITEMS, MOCK_MENU);
        const newItem: MenuItem = { ...item, id: `menu-${Date.now()}` };
        menu.push(newItem);
        saveLocalData(STORAGE_KEYS.MENU_ITEMS, menu);
        resolve(newItem);
      }, 150);
    });
  },

  updateMenuItem: async (id: string, updated: Partial<MenuItem>): Promise<MenuItem | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const menu = getLocalData<MenuItem>(STORAGE_KEYS.MENU_ITEMS, MOCK_MENU);
        const index = menu.findIndex((x) => x.id === id);
        if (index !== -1) {
          menu[index] = { ...menu[index], ...updated };
          saveLocalData(STORAGE_KEYS.MENU_ITEMS, menu);
          resolve(menu[index]);
        } else {
          resolve(null);
        }
      }, 150);
    });
  },

  deleteMenuItem: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const menu = getLocalData<MenuItem>(STORAGE_KEYS.MENU_ITEMS, MOCK_MENU);
        saveLocalData(STORAGE_KEYS.MENU_ITEMS, menu.filter((x) => x.id !== id));
        resolve(true);
      }, 150);
    });
  },

  // ----------------------------------------------------
  // Reset de la Base de Datos Completa
  // ----------------------------------------------------
  resetAll: async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.SUPER_CATS, JSON.stringify(MOCK_SUPER_CATEGORIES));
          localStorage.setItem(STORAGE_KEYS.SUB_CATS,   JSON.stringify(MOCK_SUB_CATEGORIES));
          localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(MOCK_MENU));
          window.dispatchEvent(new Event("caldo_menu_updated"));
        }
        resolve(true);
      }, 200);
    });
  }
};
