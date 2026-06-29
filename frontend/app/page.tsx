"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LuSearch,
  LuLayoutDashboard,
  LuUtensils,
  LuFlame,
  LuX,
  LuLoaderCircle,
  LuStar,
  LuLeaf,
  LuInstagram,
  LuFacebook,
  LuChevronDown,
  LuReceiptText,
  LuListChecks,
  LuChefHat,
  LuWine,
  LuTriangleAlert,
} from "react-icons/lu";
import { api, MenuItem, SuperCategory, SubCategory } from "@/lib/api";


// ── Helpers visuales ──────────────────────────────────────────────────────────

const SPICY_CONFIG: Record<number, { label: string; textColor: string; bgColor: string; borderColor: string }> = {
  1: { label: "Suave", textColor: "text-yellow-700 dark:text-yellow-400", bgColor: "bg-yellow-50 dark:bg-yellow-950/20", borderColor: "border-yellow-200 dark:border-yellow-800/40" },
  2: { label: "Picante", textColor: "text-orange-700 dark:text-orange-400", bgColor: "bg-orange-50 dark:bg-orange-950/20", borderColor: "border-orange-200 dark:border-orange-800/40" },
  3: { label: "Muy Picante", textColor: "text-red-700 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950/20", borderColor: "border-red-200 dark:border-red-800/40" },
};

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

// ── Componente Badge de impuesto ───────────────────────────────────────────────
function TaxBadge({ included }: { included: boolean }) {
  return included ? (
    <span className="inline-flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/30">
      <span className="text-[8px]">✓</span> Imp. incluidos
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30">
      <span className="text-[8px]">+</span> Impuestos ap.
    </span>
  );
}

// ── Sección de detalle del modal ──────────────────────────────────────────────
function DetailSection({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-900 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#999] dark:text-[#555] mb-0.5">{title}</p>
        <p className="text-sm text-[#444] dark:text-[#bbb] leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
//  PÁGINA PRINCIPAL
// ═════════════════════════════════════════════════════════════════════════════
export default function Home() {
  const [superCategories, setSuperCategories] = useState<SuperCategory[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedSuperCat, setSelectedSuperCat] = useState<string>("");
  const [selectedSubCat, setSelectedSubCat] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // ── Carga de datos ──────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      const [superData, subData, itemsData] = await Promise.all([
        api.getSuperCategories(),
        api.getSubCategories(),
        api.getMenu(),
      ]);
      setSuperCategories(superData);
      setSubCategories(subData);
      setMenuItems(itemsData);
      if (superData.length > 0 && !selectedSuperCat) {
        setSelectedSuperCat(superData[0].id);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [selectedSuperCat]);

  useEffect(() => {
    const timer = setTimeout(() => loadData(), 0);
    const handleMenuUpdate = () => loadData();
    window.addEventListener("caldo_menu_updated", handleMenuUpdate);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("caldo_menu_updated", handleMenuUpdate);
    };
  }, [loadData]);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedItem(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // ── Filtros ─────────────────────────────────────────────────────────────────
  const handleSuperCatChange = (id: string) => {
    setSelectedSuperCat(id);
    setSelectedSubCat("todos");
  };

  const activeSubCategories = subCategories.filter(
    (sub) => sub.superCategoryId === selectedSuperCat
  );

  const filteredItems = menuItems.filter((item) => {
    const matchesSuper = item.superCategoryId === selectedSuperCat;
    const matchesSub = selectedSubCat === "todos" || item.subCategoryId === selectedSubCat;
    const q = searchQuery.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    return matchesSuper && matchesSub && matchesSearch && item.available;
  });

  // Conteo por subcategoría para los badges
  const subCatCount = (subId: string) =>
    menuItems.filter((i) => i.subCategoryId === subId && i.available).length;
  const todosCount = menuItems.filter(
    (i) => i.superCategoryId === selectedSuperCat && i.available
  ).length;

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] dark:bg-[#0c0a09] text-[#1c1917] dark:text-[#f5f5f4] transition-colors duration-300">

      {/* CMS link flotante */}
      <div className="absolute top-5 right-5 z-30">
        <Link
          href="/admin"
          className="px-3.5 py-2 bg-white/80 dark:bg-stone-900/70 backdrop-blur-md border border-stone-200 dark:border-stone-800 hover:border-brand-400 rounded-xl text-[11px] font-bold transition-all shadow-sm flex items-center gap-1.5 text-[#777] dark:text-[#666] hover:text-brand-600"
        >
          <LuLayoutDashboard className="w-3.5 h-3.5" />
          Admin
        </Link>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-14 pb-10 sm:pt-20 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-100/50 via-[#faf8f5]/80 to-[#faf8f5] dark:from-brand-950/15 dark:via-[#0c0a09]/80 dark:to-[#0c0a09] -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-brand-300/10 dark:bg-brand-700/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-3xl mx-auto text-center">
          {/* Logo del restaurante con animación de flotación */}
          <div className="relative w-64 h-56 sm:w-72 sm:h-64 mx-auto mb-2 animate-float">
            <Image
              src="/logo.png"
              alt="Caldos Constitución Logo"
              fill
              sizes="(max-width: 640px) 256px, 288px"
              className="object-contain"
              priority
              unoptimized
            />
          </div>



          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-700 dark:text-brand-300 mb-6">
            Carta Digital · Una experiencia única
          </p>



          {/* Barra de búsqueda */}
          <div className="max-w-md mx-auto relative">
            <LuSearch className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#bbb]" />
            <input
              id="search-menu"
              type="text"
              placeholder="Buscar en la carta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 bg-white dark:bg-[#171513] border border-[#e7e5e4] dark:border-[#2e2a27] rounded-2xl shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 transition-all font-medium text-sm"
            />
          </div>
        </div>
      </section>

      {/* ── NAVEGACIÓN DE CATEGORÍAS ─────────────────────────────────────────── */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">

        {/* Nivel 1: Supercategorías */}
        {superCategories.length > 0 && (
          <div className="flex justify-center gap-3 mb-5 flex-wrap">
            {superCategories.map((sc) => (
              <button
                key={sc.id}
                id={`supercat-${sc.id}`}
                onClick={() => handleSuperCatChange(sc.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm tracking-wide transition-all duration-200 cursor-pointer ${selectedSuperCat === sc.id
                  ? "bg-[#1c1917] dark:bg-white text-white dark:text-[#0c0a09] shadow-md scale-105"
                  : "bg-white dark:bg-[#171513] border border-[#e7e5e4] dark:border-[#2e2a27] text-[#777] dark:text-[#888] hover:border-brand-300 dark:hover:border-brand-800"
                  }`}
              >
                <span className="text-lg">{sc.icon}</span>
                {sc.name}
              </button>
            ))}
          </div>
        )}

        {/* Nivel 2: Subcategorías + "Todos" */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none snap-x border-b border-stone-200/60 dark:border-stone-800 pt-1 justify-start lg:justify-center">
          <button
            id="subcat-todos"
            onClick={() => setSelectedSubCat("todos")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs tracking-wide transition-all snap-start shrink-0 cursor-pointer ${selectedSubCat === "todos"
              ? "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md"
              : "bg-white dark:bg-[#171513] border border-[#e7e5e4] dark:border-[#2e2a27] text-[#777] dark:text-[#888] hover:border-brand-300 dark:hover:border-brand-800"
              }`}
          >
            <LuUtensils className="w-3.5 h-3.5 shrink-0" />
            Todos
            {todosCount > 0 && (
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none ${selectedSubCat === "todos"
                ? "bg-white/25 text-white"
                : "bg-stone-100 dark:bg-stone-900 text-stone-500"
                }`}>{todosCount}</span>
            )}
          </button>

          {activeSubCategories.map((sub) => {
            const count = subCatCount(sub.id);
            return (
              <button
                key={sub.id}
                id={`subcat-${sub.id}`}
                onClick={() => setSelectedSubCat(sub.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs tracking-wide transition-all snap-start shrink-0 cursor-pointer ${selectedSubCat === sub.id
                  ? "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md"
                  : "bg-white dark:bg-[#171513] border border-[#e7e5e4] dark:border-[#2e2a27] text-[#777] dark:text-[#888] hover:border-brand-300 dark:hover:border-brand-800"
                  }`}
              >
                <span className="text-sm leading-none">{sub.icon}</span>
                {sub.name}
                {count > 0 && (
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none ${selectedSubCat === sub.id
                    ? "bg-white/25 text-white"
                    : "bg-stone-100 dark:bg-stone-900 text-stone-500"
                    }`}>{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── GRILLA DE PLATOS ─────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-28">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-3">
            <LuLoaderCircle className="w-9 h-9 text-brand-500 animate-spin" />
            <p className="text-sm text-[#bbb] font-medium">Cargando la carta...</p>
          </div>

        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredItems.map((item, idx) => (
              <article
                key={item.id}
                onClick={() => setSelectedItem(item)}
                style={{ animationDelay: `${idx * 55}ms` }}
                className="group bg-white dark:bg-[#171513] border border-[#e7e5e4] dark:border-[#2e2a27] rounded-3xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-brand-500/6 dark:hover:shadow-black/50 hover:-translate-y-1.5 transition-all duration-300 animate-fade-up"
                aria-label={`Ver detalles de ${item.name}`}
              >
                {/* Foto */}
                <div className="relative h-52 sm:h-56 w-full bg-stone-100 dark:bg-stone-900 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-stone-400 gap-2">
                      <LuUtensils className="w-5 h-5" />
                    </div>
                  )}

                  {/* Overlay gradiente en la base */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badges sobre la foto */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {item.isBestSeller && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-brand-500/90 backdrop-blur-sm text-white text-[9px] font-black rounded-full">
                        <LuStar className="w-2.5 h-2.5 fill-white" /> Favorito
                      </span>
                    )}
                    {item.isVegan && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-600/85 backdrop-blur-sm text-white text-[9px] font-black rounded-full">
                        <LuLeaf className="w-2.5 h-2.5" /> Vegano
                      </span>
                    )}
                  </div>

                  {/* Badge de picante */}
                  {item.spicyLevel !== undefined && item.spicyLevel > 0 && (
                    <span className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 backdrop-blur-sm text-[9px] font-black rounded-full border ${SPICY_CONFIG[item.spicyLevel]?.bgColor} ${SPICY_CONFIG[item.spicyLevel]?.textColor} ${SPICY_CONFIG[item.spicyLevel]?.borderColor}`}>
                      <LuFlame className="w-2.5 h-2.5" />
                      {SPICY_CONFIG[item.spicyLevel]?.label}
                    </span>
                  )}

                  {/* Indicador de tap */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-[10px] font-black text-[#555] dark:text-[#aaa] rounded-full">
                      <LuChevronDown className="w-3 h-3" /> Ver detalle
                    </span>
                  </div>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-5">
                  {/* Nombre + Precio */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="font-extrabold text-[16px] leading-snug text-[#1c1917] dark:text-white group-hover:text-brand-600 transition-colors flex-1">
                      {item.name}
                    </h2>
                    {item.price !== undefined && (
                      <span className="font-black text-lg text-brand-600 dark:text-brand-400 shrink-0 leading-tight">
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </div>

                  {/* Badge de impuesto */}
                  {item.price !== undefined && item.priceIncludesTax !== undefined && (
                    <div className="mb-2.5">
                      <TaxBadge included={item.priceIncludesTax} />
                    </div>
                  )}

                  {/* Descripción corta */}
                  <p className="text-xs text-[#888] dark:text-[#777] leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

        ) : (
          <div className="text-center py-24 max-w-sm mx-auto">
            <LuSearch className="w-10 h-10 text-stone-300 dark:text-stone-800 mx-auto mb-4" />
            <h2 className="font-extrabold text-base mb-2">Sin resultados</h2>
            <p className="text-sm text-[#aaa] dark:text-[#555]">
              Prueba otra palabra clave o selecciona una categoría diferente.
            </p>
          </div>
        )}
      </main>

      {/* ── MODAL DE DETALLE (Información Progresiva) ────────────────────────── */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
          onClick={(e) => e.target === e.currentTarget && setSelectedItem(null)}
        >
          <div className="bg-white dark:bg-[#171513] w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl animate-fade-up max-h-[92vh] flex flex-col border border-[#e7e5e4] dark:border-[#2e2a27]">

            {/* Foto del modal */}
            <div className="relative h-64 sm:h-72 bg-stone-100 dark:bg-stone-900 shrink-0">
              {selectedItem.image ? (
                <Image src={selectedItem.image} alt={selectedItem.name} fill className="object-cover" />
              ) : (
                <div className="h-full flex items-center justify-center text-stone-400">
                  <LuUtensils className="w-8 h-8" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Botón cerrar */}
              <button
                id="modal-close"
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/75 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Cerrar"
              >
                <LuX className="w-4 h-4" />
              </button>

              {/* Tirón visual en mobile */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/40 rounded-full sm:hidden" />
            </div>

            {/* Cuerpo scrollable del modal */}
            <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5">

              {/* Encabezado: nombre + precio */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="font-black text-xl sm:text-2xl leading-tight">{selectedItem.name}</h2>
                  {selectedItem.price !== undefined && (
                    <div className="text-right shrink-0">
                      <span className="font-black text-2xl text-brand-600 dark:text-brand-400 block leading-none">
                        {formatPrice(selectedItem.price)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Badge impuesto */}
                {selectedItem.price !== undefined && selectedItem.priceIncludesTax !== undefined && (
                  <TaxBadge included={selectedItem.priceIncludesTax} />
                )}
              </div>

              {/* Chips de atributos */}
              <div className="flex flex-wrap gap-2">
                {selectedItem.isBestSeller && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800/40 rounded-full text-xs font-black">
                    <LuStar className="w-3 h-3 fill-brand-500 text-brand-500" /> Favorito
                  </span>
                )}
                {selectedItem.isVegan && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/40 rounded-full text-xs font-black">
                    <LuLeaf className="w-3 h-3" /> Vegano
                  </span>
                )}
                {selectedItem.spicyLevel !== undefined && selectedItem.spicyLevel > 0 && (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-black ${SPICY_CONFIG[selectedItem.spicyLevel]?.bgColor} ${SPICY_CONFIG[selectedItem.spicyLevel]?.textColor} ${SPICY_CONFIG[selectedItem.spicyLevel]?.borderColor}`}>
                    <LuFlame className="w-3 h-3" />
                    {SPICY_CONFIG[selectedItem.spicyLevel]?.label}
                  </span>
                )}
              </div>

              {/* Descripción */}
              <p className="text-sm text-[#555] dark:text-[#aaa] leading-relaxed">
                {selectedItem.description}
              </p>

              {/* Secciones de información progresiva */}
              {(selectedItem.ingredients || selectedItem.includes || selectedItem.pairingNote || selectedItem.allergenNote) && (
                <div className="border-t border-[#f0ece7] dark:border-[#2e2a27] pt-5 space-y-4">
                  {selectedItem.ingredients && (
                    <DetailSection
                      icon={<LuListChecks className="w-3.5 h-3.5 text-brand-500" />}
                      title="Ingredientes"
                      text={selectedItem.ingredients}
                    />
                  )}
                  {selectedItem.includes && (
                    <DetailSection
                      icon={<LuChefHat className="w-3.5 h-3.5 text-brand-500" />}
                      title="Incluye"
                      text={selectedItem.includes}
                    />
                  )}
                  {selectedItem.pairingNote && (
                    <DetailSection
                      icon={<LuWine className="w-3.5 h-3.5 text-brand-500" />}
                      title="Maridaje sugerido"
                      text={selectedItem.pairingNote}
                    />
                  )}
                  {selectedItem.allergenNote && (
                    <DetailSection
                      icon={<LuTriangleAlert className="w-3.5 h-3.5 text-amber-500" />}
                      title="Alérgenos"
                      text={selectedItem.allergenNote}
                    />
                  )}
                </div>
              )}

              {/* Botón cerrar */}
              <div className="pt-2 pb-1">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-full py-3.5 bg-[#1c1917] dark:bg-[#2e2a27] text-white rounded-2xl font-bold text-sm tracking-wide hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LuX className="w-4 h-4" />
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="bg-white dark:bg-[#110f0e] border-t border-[#e7e5e4] dark:border-[#2e2a27] py-10 px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="relative w-28 h-24 mx-auto mb-4">
            <Image
              src="/logo.png"
              alt="Caldos Constitución"
              fill
              sizes="112px"
              className="object-contain opacity-70 hover:opacity-100 transition-opacity"
              unoptimized
            />
          </div>
          <div className="flex justify-center gap-3 mb-5">
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center hover:bg-brand-100 dark:hover:bg-brand-950/40 hover:text-brand-600 transition-colors text-[#aaa] dark:text-[#555]">
              <LuInstagram className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center hover:bg-brand-100 dark:hover:bg-brand-950/40 hover:text-brand-600 transition-colors text-[#aaa] dark:text-[#555]">
              <LuFacebook className="w-4 h-4" />
            </a>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[#ccc] dark:text-[#444] text-xs mb-1">
            <LuReceiptText className="w-3.5 h-3.5" />
            <span className="font-semibold">Los precios pueden cambiar sin previo aviso.</span>
          </div>
          <p className="text-[#bbb] dark:text-[#444] text-xs font-bold">© 2026 Caldos Constitución · Carta Digital</p>
        </div>
      </footer>
    </div>
  );
}
