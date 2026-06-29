"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LuEye,
  LuLogOut,
  LuRefreshCw,
  LuChefHat,
  LuFolderOpen,
  LuTag,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuCircleCheck,
  LuCircle,
  LuX,
  LuLoaderCircle,
  LuPencilLine,
  LuImage,
  LuAlignLeft,
  LuLink2,
  LuDatabase,
  LuReceiptText,
  LuStar,
  LuLeaf,
  LuWine,
  LuListChecks,
  LuTriangleAlert,
} from "react-icons/lu";
import { api, MenuItem, SuperCategory, SubCategory } from "@/lib/api";

type ActiveTab = "items" | "supercats" | "subcats";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("items");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [superCategories, setSuperCategories] = useState<SuperCategory[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [notification, setNotification] = useState<string | null>(null);
  const [notificationSuccess, setNotificationSuccess] = useState<boolean>(true);
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [isSuperModalOpen, setIsSuperModalOpen] = useState<boolean>(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState<boolean>(false);

  // MenuItem Form
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemName, setItemName] = useState<string>("");
  const [itemDescription, setItemDescription] = useState<string>("");
  const [itemSuperCatId, setItemSuperCatId] = useState<string>("");
  const [itemSubCatId, setItemSubCatId] = useState<string>("");
  const [itemImage, setItemImage] = useState<string>("");
  const [itemSpicy, setItemSpicy] = useState<0 | 1 | 2 | 3>(0);
  const [itemAvailable, setItemAvailable] = useState<boolean>(true);
  // Campos carta digital
  const [itemPrice, setItemPrice] = useState<string>("");
  const [itemPriceIncludesTax, setItemPriceIncludesTax] = useState<boolean>(true);
  const [itemIsBestSeller, setItemIsBestSeller] = useState<boolean>(false);
  const [itemIsVegan, setItemIsVegan] = useState<boolean>(false);
  const [itemIngredients, setItemIngredients] = useState<string>("");
  const [itemIncludes, setItemIncludes] = useState<string>("");
  const [itemPairingNote, setItemPairingNote] = useState<string>("");
  const [itemAllergenNote, setItemAllergenNote] = useState<string>("");

  // SuperCategory Form
  const [editingSuper, setEditingSuper] = useState<SuperCategory | null>(null);
  const [superName, setSuperName] = useState<string>("");
  const [superIcon, setSuperIcon] = useState<string>("");

  // SubCategory Form
  const [editingSub, setEditingSub] = useState<SubCategory | null>(null);
  const [subName, setSubName] = useState<string>("");
  const [subIcon, setSubIcon] = useState<string>("");
  const [subSuperCatId, setSubSuperCatId] = useState<string>("");

  // Estados de autenticación
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("caldo_admin_auth") === "true";
    }
    return false;
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    sessionStorage.removeItem("caldo_admin_auth");
    setIsAuthenticated(false);
    showNotification("Sesión cerrada.");
    router.replace("/auth");
  };

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
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadData(), 0);
    const handleMenuUpdate = () => loadData();
    window.addEventListener("caldo_menu_updated", handleMenuUpdate);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("caldo_menu_updated", handleMenuUpdate);
    };
  }, [loadData]);

  const showNotification = (msg: string, success = true) => {
    setNotification(msg);
    setNotificationSuccess(success);
    setTimeout(() => setNotification(null), 3000);
  };

  // -------------------------------------------------------
  // CRUD: Reset
  // -------------------------------------------------------
  const handleResetDatabase = async () => {
    if (confirm("¿Restablecer toda la base de datos a los valores originales?")) {
      try {
        await api.resetAll();
        showNotification("Base de datos restaurada con éxito.");
        loadData();
      } catch (err) {
        console.error(err);
        showNotification("Error al restablecer.", false);
      }
    }
  };

  // -------------------------------------------------------
  // CRUD: Platos (MenuItems)
  // -------------------------------------------------------
  const handleOpenAddItemModal = () => {
    setEditingItem(null);
    setItemName("");
    setItemDescription("");
    setItemImage("");
    setItemSpicy(0);
    setItemAvailable(true);
    setItemPrice("");
    setItemPriceIncludesTax(true);
    setItemIsBestSeller(false);
    setItemIsVegan(false);
    setItemIngredients("");
    setItemIncludes("");
    setItemPairingNote("");
    setItemAllergenNote("");
    if (superCategories.length > 0) {
      const firstSuper = superCategories[0].id;
      setItemSuperCatId(firstSuper);
      const subOptions = subCategories.filter((s) => s.superCategoryId === firstSuper);
      setItemSubCatId(subOptions.length > 0 ? subOptions[0].id : "");
    } else {
      setItemSuperCatId("");
      setItemSubCatId("");
    }
    setIsItemModalOpen(true);
  };

  const handleOpenEditItemModal = (item: MenuItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemDescription(item.description);
    setItemImage(item.image);
    setItemSpicy((item.spicyLevel as 0 | 1 | 2 | 3) || 0);
    setItemAvailable(item.available);
    setItemSuperCatId(item.superCategoryId);
    setItemSubCatId(item.subCategoryId);
    setItemPrice(item.price !== undefined ? String(item.price) : "");
    setItemPriceIncludesTax(item.priceIncludesTax ?? true);
    setItemIsBestSeller(item.isBestSeller ?? false);
    setItemIsVegan(item.isVegan ?? false);
    setItemIngredients(item.ingredients ?? "");
    setItemIncludes(item.includes ?? "");
    setItemPairingNote(item.pairingNote ?? "");
    setItemAllergenNote(item.allergenNote ?? "");
    setIsItemModalOpen(true);
  };

  const handleSuperCatChangeInForm = (superId: string) => {
    setItemSuperCatId(superId);
    const subOptions = subCategories.filter((s) => s.superCategoryId === superId);
    setItemSubCatId(subOptions.length > 0 ? subOptions[0].id : "");
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return alert("Nombre requerido.");
    if (!itemSuperCatId) return alert("Debes seleccionar una Categoría Principal.");
    if (!itemSubCatId) return alert("Debes seleccionar una Subcategoría.");
    const priceVal = itemPrice.trim() !== "" ? parseFloat(itemPrice) : undefined;
    const data = {
      name: itemName.trim(),
      description: itemDescription.trim(),
      superCategoryId: itemSuperCatId,
      subCategoryId: itemSubCatId,
      image: itemImage.trim(),
      spicyLevel: itemSpicy,
      available: itemAvailable,
      price: !isNaN(priceVal as number) ? priceVal : undefined,
      priceIncludesTax: priceVal !== undefined ? itemPriceIncludesTax : undefined,
      isBestSeller: itemIsBestSeller,
      isVegan: itemIsVegan,
      ingredients: itemIngredients.trim() || undefined,
      includes: itemIncludes.trim() || undefined,
      pairingNote: itemPairingNote.trim() || undefined,
      allergenNote: itemAllergenNote.trim() || undefined,
    };
    try {
      if (editingItem) {
        await api.updateMenuItem(editingItem.id, data);
        showNotification("Plato actualizado con éxito.");
      } else {
        await api.createMenuItem(data);
        showNotification("Plato agregado con éxito.");
      }
      setIsItemModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm("¿Eliminar este plato?")) {
      try {
        await api.deleteMenuItem(id);
        showNotification("Plato eliminado.");
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleItemAvailable = async (item: MenuItem) => {
    try {
      await api.updateMenuItem(item.id, { available: !item.available });
      showNotification(item.available ? "Plato marcado como no disponible." : "Plato marcado como disponible.");
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------------------------------
  // CRUD: SuperCategories
  // -------------------------------------------------------
  const handleOpenAddSuperModal = () => {
    setEditingSuper(null);
    setSuperName("");
    setSuperIcon("🍲");
    setIsSuperModalOpen(true);
  };

  const handleOpenEditSuperModal = (sc: SuperCategory) => {
    setEditingSuper(sc);
    setSuperName(sc.name);
    setSuperIcon(sc.icon);
    setIsSuperModalOpen(true);
  };

  const handleSaveSuper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!superName.trim()) return alert("Nombre requerido.");
    if (!superIcon.trim()) return alert("Icono requerido.");
    const data = { name: superName.trim(), icon: superIcon.trim() };
    try {
      if (editingSuper) {
        await api.updateSuperCategory(editingSuper.id, data);
        showNotification("Categoría modificada.");
      } else {
        await api.createSuperCategory(data);
        showNotification("Categoría creada.");
      }
      setIsSuperModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSuper = async (id: string) => {
    if (confirm("⚠️ Eliminar esta categoría también eliminará sus subcategorías y platos. ¿Continuar?")) {
      try {
        await api.deleteSuperCategory(id);
        showNotification("Categoría y datos vinculados eliminados.");
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // -------------------------------------------------------
  // CRUD: SubCategories
  // -------------------------------------------------------
  const handleOpenAddSubModal = () => {
    setEditingSub(null);
    setSubName("");
    setSubIcon("🍜");
    setSubSuperCatId(superCategories.length > 0 ? superCategories[0].id : "");
    setIsSubModalOpen(true);
  };

  const handleOpenEditSubModal = (sub: SubCategory) => {
    setEditingSub(sub);
    setSubName(sub.name);
    setSubIcon(sub.icon);
    setSubSuperCatId(sub.superCategoryId);
    setIsSubModalOpen(true);
  };

  const handleSaveSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return alert("Nombre requerido.");
    if (!subIcon.trim()) return alert("Icono requerido.");
    if (!subSuperCatId) return alert("Debes seleccionar una Categoría Principal.");
    const data = { name: subName.trim(), icon: subIcon.trim(), superCategoryId: subSuperCatId };
    try {
      if (editingSub) {
        await api.updateSubCategory(editingSub.id, data);
        showNotification("Subcategoría modificada.");
      } else {
        await api.createSubCategory(data);
        showNotification("Subcategoría creada.");
      }
      setIsSubModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSub = async (id: string) => {
    if (confirm("⚠️ Eliminar esta subcategoría también eliminará sus platos. ¿Continuar?")) {
      try {
        await api.deleteSubCategory(id);
        showNotification("Subcategoría y platos eliminados.");
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getSuperCatName = (id: string) => {
    const found = superCategories.find((s) => s.id === id);
    return found ? `${found.icon} ${found.name}` : "Desconocido";
  };

  const getSubCatName = (id: string) => {
    const found = subCategories.find((s) => s.id === id);
    return found ? `${found.icon} ${found.name}` : "Desconocido";
  };

  // Shared input style
  const inputCls = "w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c0a09] border border-[#e7e5e4] dark:border-[#2e2a27] rounded-xl outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 text-sm font-medium transition-all";
  const labelCls = "block text-[10px] uppercase font-black tracking-wider text-[#888] dark:text-[#666] mb-1.5";

  const TABS: { key: ActiveTab; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "items",     label: "Platos",               icon: <LuChefHat className="w-4 h-4" />,     count: menuItems.length },
    { key: "supercats", label: "Categorías",            icon: <LuFolderOpen className="w-4 h-4" />,  count: superCategories.length },
    { key: "subcats",   label: "Subcategorías",         icon: <LuTag className="w-4 h-4" />,         count: subCategories.length },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#faf8f5] dark:bg-[#0c0a09]">
        <LuLoaderCircle className="w-10 h-10 text-brand-500 animate-spin" />
        <p className="text-xs text-[#aaa] font-medium mt-3">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] dark:bg-[#0c0a09] text-[#1c1917] dark:text-[#f5f5f4]">

      {/* Header */}
      <header className="bg-white/90 dark:bg-[#0c0a09]/80 border-b border-[#e7e5e4] dark:border-[#2e2a27] py-4 px-6 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-10 shrink-0">
              <Image
                src="/logo.png"
                alt="Caldos Constitución Logo"
                fill
                sizes="48px"
                className="object-contain"
                unoptimized
              />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-[#5c381c] dark:text-[#f5f5f4]">ADMINISTRADOR CMS</h1>
              <p className="text-[10px] text-[#888] dark:text-[#555]">Caldos Constitución · Gestor de contenidos</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3.5 py-2 bg-[#faf8f5] dark:bg-[#1c1917] hover:bg-stone-100 dark:hover:bg-stone-900 border border-[#e7e5e4] dark:border-[#2e2a27] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <LuEye className="w-3.5 h-3.5" />
              Menú Público
            </Link>
            <button
              id="reset-db-btn"
              onClick={handleResetDatabase}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-850 border border-stone-200 dark:border-stone-800 text-xs font-bold rounded-xl transition-all cursor-pointer text-stone-600 dark:text-stone-400 flex items-center gap-1.5"
            >
              <LuRefreshCw className="w-3.5 h-3.5" />
              Carta Original
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/30 text-xs font-bold rounded-xl transition-all cursor-pointer text-red-700 dark:text-red-400 flex items-center gap-1.5"
            >
              <LuLogOut className="w-3.5 h-3.5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-xs tracking-wider border animate-fade-up ${
          notificationSuccess
            ? "bg-[#1c1917] dark:bg-[#2e2a27] text-white border-brand-500/20"
            : "bg-red-900 text-white border-red-700/30"
        }`}>
          <LuCircleCheck className="w-4 h-4 text-green-400 shrink-0" />
          {notification}
        </div>
      )}

      {/* Nav Tabs */}
      <div className="max-w-7xl w-full mx-auto px-6 mt-6">
        <div className="flex border-b border-[#e7e5e4] dark:border-[#2e2a27] gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              id={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-4 px-3 font-black text-sm relative transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === tab.key
                  ? "text-brand-600 dark:text-brand-400"
                  : "text-stone-400 dark:text-stone-600 hover:text-stone-600 dark:hover:text-stone-400"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                activeTab === tab.key
                  ? "bg-brand-100 dark:bg-brand-950/50 text-brand-700 dark:text-brand-400"
                  : "bg-stone-100 dark:bg-stone-900 text-stone-500 dark:text-stone-500"
              }`}>
                {tab.count}
              </span>
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24 gap-3">
            <LuLoaderCircle className="w-10 h-10 text-brand-500 animate-spin" />
            <p className="text-sm text-[#aaa] font-medium">Cargando datos...</p>
          </div>
        ) : (
          <div>

            {/* ============================================
                TAB 1: PLATOS
            ============================================ */}
            {activeTab === "items" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="font-extrabold text-lg">Catálogo de Platos</h2>
                    <p className="text-xs text-[#888] mt-0.5">{menuItems.length} platos registrados</p>
                  </div>
                  <button
                    id="add-item-btn"
                    onClick={handleOpenAddItemModal}
                    className="px-4 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl text-xs font-bold cursor-pointer hover:brightness-105 flex items-center gap-1.5 transition-all"
                  >
                    <LuPlus className="w-4 h-4" />
                    Agregar Plato
                  </button>
                </div>

                {menuItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {menuItems.map((item) => (
                      <div
                        key={item.id}
                        className={`bg-white dark:bg-[#171513] border border-[#e7e5e4] dark:border-[#2e2a27] rounded-3xl overflow-hidden p-4 flex gap-3.5 transition-all relative ${!item.available ? "opacity-60" : ""}`}
                      >
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-900 shrink-0">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-stone-400">
                              <LuImage className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h3 className="font-black text-sm truncate" title={item.name}>{item.name}</h3>
                            <div className="flex flex-wrap gap-1 mt-1 mb-1.5">
                              <span className="text-[9px] font-black uppercase bg-stone-100 dark:bg-stone-850 px-1.5 py-0.5 rounded text-stone-600 dark:text-stone-400">
                                {getSuperCatName(item.superCategoryId)}
                              </span>
                              <span className="text-[9px] font-black uppercase bg-brand-50 dark:bg-brand-950/20 px-1.5 py-0.5 rounded text-brand-700 dark:text-brand-400">
                                {getSubCatName(item.subCategoryId)}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 dark:text-stone-450 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-850 pt-2.5 mt-2">
                            <button
                              onClick={() => handleToggleItemAvailable(item)}
                              className={`flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-lg cursor-pointer transition-all border ${
                                item.available
                                  ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30"
                                  : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30"
                              }`}
                            >
                              {item.available
                                ? <LuCircleCheck className="w-3 h-3" />
                                : <LuCircle className="w-3 h-3" />
                              }
                              {item.available ? "Disponible" : "Agotado"}
                            </button>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEditItemModal(item)}
                                title="Editar"
                                className="p-1.5 bg-[#faf8f5] dark:bg-stone-900 border border-[#e7e5e4] dark:border-[#2e2a27] hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/20 rounded-lg cursor-pointer transition-all"
                              >
                                <LuPencil className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                title="Eliminar"
                                className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/30 rounded-lg cursor-pointer transition-all"
                              >
                                <LuTrash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white dark:bg-[#171513] border border-[#e7e5e4] dark:border-[#2e2a27] rounded-3xl max-w-lg mx-auto">
                    <LuChefHat className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
                    <h3 className="font-extrabold text-base mb-2">Sin platos registrados</h3>
                    <p className="text-stone-500 dark:text-stone-500 text-xs">Agrega platillos desde el botón de arriba.</p>
                  </div>
                )}
              </div>
            )}

            {/* ============================================
                TAB 2: CATEGORÍAS PRINCIPALES
            ============================================ */}
            {activeTab === "supercats" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="font-extrabold text-lg">Categorías Principales</h2>
                    <p className="text-xs text-[#888] mt-0.5">{superCategories.length} categorías registradas</p>
                  </div>
                  <button
                    id="add-supercat-btn"
                    onClick={handleOpenAddSuperModal}
                    className="px-4 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl text-xs font-bold cursor-pointer hover:brightness-105 flex items-center gap-1.5 transition-all"
                  >
                    <LuPlus className="w-4 h-4" />
                    Nueva Categoría
                  </button>
                </div>

                <div className="bg-white dark:bg-[#171513] border border-[#e7e5e4] dark:border-[#2e2a27] rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-stone-50 dark:bg-stone-900/40 text-stone-500 dark:text-stone-400 text-[10px] font-black uppercase tracking-wider border-b border-[#e7e5e4] dark:border-[#2e2a27]">
                          <th className="p-4 sm:p-5">Icono</th>
                          <th className="p-4 sm:p-5">Nombre</th>
                          <th className="p-4 sm:p-5">
                            <span className="flex items-center gap-1.5"><LuDatabase className="w-3 h-3" />ID Técnico</span>
                          </th>
                          <th className="p-4 sm:p-5 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e7e5e4] dark:divide-[#2e2a27] text-sm">
                        {superCategories.map((sc) => (
                          <tr key={sc.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-900/20 transition-colors group">
                            <td className="p-4 sm:p-5 text-2xl">{sc.icon}</td>
                            <td className="p-4 sm:p-5 font-black text-stone-800 dark:text-stone-100">{sc.name}</td>
                            <td className="p-4 sm:p-5 text-xs font-mono text-stone-400 dark:text-stone-600">{sc.id}</td>
                            <td className="p-4 sm:p-5 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => handleOpenEditSuperModal(sc)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#faf8f5] dark:bg-stone-900 border border-[#e7e5e4] dark:border-[#2e2a27] hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/20 rounded-lg text-xs font-bold cursor-pointer transition-all"
                                >
                                  <LuPencil className="w-3 h-3" /> Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteSuper(sc.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-bold cursor-pointer transition-all"
                                >
                                  <LuTrash2 className="w-3 h-3" /> Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================
                TAB 3: SUBCATEGORÍAS
            ============================================ */}
            {activeTab === "subcats" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="font-extrabold text-lg">Subcategorías del Menú</h2>
                    <p className="text-xs text-[#888] mt-0.5">{subCategories.length} subcategorías registradas</p>
                  </div>
                  <button
                    id="add-subcat-btn"
                    onClick={handleOpenAddSubModal}
                    className="px-4 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl text-xs font-bold cursor-pointer hover:brightness-105 flex items-center gap-1.5 transition-all"
                  >
                    <LuPlus className="w-4 h-4" />
                    Nueva Subcategoría
                  </button>
                </div>

                <div className="bg-white dark:bg-[#171513] border border-[#e7e5e4] dark:border-[#2e2a27] rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-stone-50 dark:bg-stone-900/40 text-stone-500 dark:text-stone-400 text-[10px] font-black uppercase tracking-wider border-b border-[#e7e5e4] dark:border-[#2e2a27]">
                          <th className="p-4 sm:p-5">Icono</th>
                          <th className="p-4 sm:p-5">Nombre</th>
                          <th className="p-4 sm:p-5">Categoría Padre</th>
                          <th className="p-4 sm:p-5">
                            <span className="flex items-center gap-1.5"><LuDatabase className="w-3 h-3" />ID</span>
                          </th>
                          <th className="p-4 sm:p-5 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e7e5e4] dark:divide-[#2e2a27] text-sm">
                        {subCategories.map((sub) => (
                          <tr key={sub.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-900/20 transition-colors group">
                            <td className="p-4 sm:p-5 text-xl">{sub.icon}</td>
                            <td className="p-4 sm:p-5 font-black text-stone-800 dark:text-stone-100">{sub.name}</td>
                            <td className="p-4 sm:p-5">
                              <span className="text-xs font-bold bg-stone-100 dark:bg-stone-850 px-2.5 py-1 rounded-lg text-stone-600 dark:text-stone-300">
                                {getSuperCatName(sub.superCategoryId)}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 text-xs font-mono text-stone-400 dark:text-stone-600">{sub.id}</td>
                            <td className="p-4 sm:p-5 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => handleOpenEditSubModal(sub)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#faf8f5] dark:bg-stone-900 border border-[#e7e5e4] dark:border-[#2e2a27] hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/20 rounded-lg text-xs font-bold cursor-pointer transition-all"
                                >
                                  <LuPencil className="w-3 h-3" /> Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteSub(sub.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-bold cursor-pointer transition-all"
                                >
                                  <LuTrash2 className="w-3 h-3" /> Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ======================================================
          MODAL: CREAR / EDITAR PLATILLO
      ====================================================== */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#171513] border border-[#e7e5e4] dark:border-[#2e2a27] rounded-3xl w-full max-w-lg overflow-hidden animate-fade-up flex flex-col max-h-[92vh]">
            {/* Header modal */}
            <div className="p-5 border-b border-stone-100 dark:border-stone-850 flex justify-between items-center bg-stone-50 dark:bg-stone-900/55 shrink-0">
              <div className="flex items-center gap-2.5">
                <LuChefHat className="w-5 h-5 text-brand-500" />
                <h3 className="font-black text-lg">
                  {editingItem ? "Editar Plato del Menú" : "Agregar Nuevo Plato"}
                </h3>
              </div>
              <button onClick={() => setIsItemModalOpen(false)} className="w-8 h-8 rounded-full bg-stone-200/60 dark:bg-stone-850 text-stone-600 dark:text-stone-400 hover:bg-stone-200 flex items-center justify-center cursor-pointer transition-colors">
                <LuX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Nombre */}
              <div>
                <label className={labelCls}>Nombre del Plato *</label>
                <div className="relative">
                  <LuPencilLine className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input type="text" required placeholder="Ej: Caldo especial de camarón..." value={itemName} onChange={(e) => setItemName(e.target.value)} className={`${inputCls} pl-10`} />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className={labelCls}>Descripción</label>
                <div className="relative">
                  <LuAlignLeft className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <textarea placeholder="Ingredientes, acompañamientos, condimentos..." value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} className={`${inputCls} pl-10 h-20 resize-none`} />
                </div>
              </div>

              {/* URL Imagen */}
              <div>
                <label className={labelCls}>URL de Imagen</label>
                <div className="relative">
                  <LuLink2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input type="url" placeholder="https://images.unsplash.com/..." value={itemImage} onChange={(e) => setItemImage(e.target.value)} className={`${inputCls} pl-10`} />
                </div>
              </div>

              {/* Categorías */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Categoría Principal</label>
                  <select value={itemSuperCatId} onChange={(e) => handleSuperCatChangeInForm(e.target.value)} className={`${inputCls} cursor-pointer`}>
                    {superCategories.map((sc) => (
                      <option key={sc.id} value={sc.id}>{sc.icon} {sc.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Subcategoría</label>
                  <select value={itemSubCatId} onChange={(e) => setItemSubCatId(e.target.value)} className={`${inputCls} cursor-pointer`}>
                    {subCategories.filter((sub) => sub.superCategoryId === itemSuperCatId).map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.icon} {sub.name}</option>
                    ))}
                    {subCategories.filter((sub) => sub.superCategoryId === itemSuperCatId).length === 0 && (
                      <option value="">Sin subcategorías</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Picante */}
              <div>
                <label className={labelCls}>Nivel de Picante</label>
                <select value={itemSpicy} onChange={(e) => setItemSpicy(Number(e.target.value) as 0 | 1 | 2 | 3)} className={`${inputCls} cursor-pointer`}>
                  <option value={0}>No picante 🍽️</option>
                  <option value={1}>Suave 🌶️</option>
                  <option value={2}>Medio 🌶️🌶️</option>
                  <option value={3}>Muy Picante 🌶️🌶️🌶️</option>
                </select>
              </div>

              {/* ─── SECCIÓN: CARTA DIGITAL ─────────────────────────── */}
              <div className="pt-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#aaa] dark:text-[#555] mb-3 flex items-center gap-1.5">
                  <LuReceiptText className="w-3.5 h-3.5" /> Carta Digital y Precio
                </p>

                {/* Precio */}
                <div className="mb-3">
                  <label className={labelCls}>Precio (opcional)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-black text-sm">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                      className={`${inputCls} pl-8`}
                    />
                  </div>
                </div>

                {/* Impuestos */}
                {itemPrice.trim() !== "" && (
                  <div className="mb-3 p-3 bg-stone-50 dark:bg-stone-900/40 rounded-xl border border-stone-100 dark:border-stone-850">
                    <p className={`${labelCls} mb-2`}>¿El precio ya incluye impuestos?</p>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="taxIncluded"
                          checked={itemPriceIncludesTax === true}
                          onChange={() => setItemPriceIncludesTax(true)}
                          className="accent-green-600"
                        />
                        <span className="text-xs font-bold text-green-700 dark:text-green-400">✓ Imp. incluidos</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="taxIncluded"
                          checked={itemPriceIncludesTax === false}
                          onChange={() => setItemPriceIncludesTax(false)}
                          className="accent-amber-500"
                        />
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400">+ Impuestos aparte</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Badges */}
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-stone-100 dark:border-stone-850 bg-stone-50 dark:bg-stone-900/40 flex-1">
                    <input type="checkbox" checked={itemIsBestSeller} onChange={(e) => setItemIsBestSeller(e.target.checked)} className="w-4 h-4 rounded accent-brand-500" />
                    <LuStar className="w-3.5 h-3.5 text-brand-500" />
                    <span className="text-xs font-bold text-stone-600 dark:text-stone-300">Favorito</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-stone-100 dark:border-stone-850 bg-stone-50 dark:bg-stone-900/40 flex-1">
                    <input type="checkbox" checked={itemIsVegan} onChange={(e) => setItemIsVegan(e.target.checked)} className="w-4 h-4 rounded accent-green-500" />
                    <LuLeaf className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-xs font-bold text-stone-600 dark:text-stone-300">Vegano</span>
                  </label>
                </div>
              </div>

              {/* ─── SECCIÓN: DETALLE MODAL ──────────────────────────── */}
              <div className="pt-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#aaa] dark:text-[#555] mb-3 flex items-center gap-1.5">
                  <LuListChecks className="w-3.5 h-3.5" /> Detalle expandido (modal)
                </p>
                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>Ingredientes</label>
                    <textarea
                      placeholder="Ej: Carne de res, cilantro, cebolla, tortilla de maíz..."
                      value={itemIngredients}
                      onChange={(e) => setItemIngredients(e.target.value)}
                      className={`${inputCls} h-16 resize-none`}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Incluye</label>
                    <input
                      type="text"
                      placeholder="Ej: Consomé, limones y tortillas."
                      value={itemIncludes}
                      onChange={(e) => setItemIncludes(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      <span className="flex items-center gap-1"><LuWine className="w-3 h-3" /> Maridaje sugerido</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Combina muy bien con nuestra limonada..."
                      value={itemPairingNote}
                      onChange={(e) => setItemPairingNote(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      <span className="flex items-center gap-1"><LuTriangleAlert className="w-3 h-3 text-amber-500" /> Alérgenos</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Libre de gluten. Contiene lácteos."
                      value={itemAllergenNote}
                      onChange={(e) => setItemAllergenNote(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              {/* Disponible */}
              <div className="flex items-center gap-2.5 p-3 bg-stone-50 dark:bg-stone-900/40 rounded-xl border border-stone-100 dark:border-stone-850">
                <input type="checkbox" id="item-available" checked={itemAvailable} onChange={(e) => setItemAvailable(e.target.checked)} className="w-4 h-4 rounded cursor-pointer accent-brand-500" />
                <label htmlFor="item-available" className="text-xs font-bold text-stone-600 dark:text-stone-300 cursor-pointer flex items-center gap-1.5">
                  <LuCircleCheck className="w-3.5 h-3.5 text-green-500" />
                  Habilitar en el menú inmediatamente
                </label>
              </div>

              {/* Botones */}
              <div className="pt-2 flex gap-3 shrink-0">
                <button type="button" onClick={() => setIsItemModalOpen(false)} className="flex-1 py-3 bg-[#faf8f5] dark:bg-stone-900 border border-[#e7e5e4] dark:border-[#2e2a27] hover:bg-stone-100 rounded-xl font-bold text-xs transition-all cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:brightness-105 text-white rounded-xl font-bold text-xs cursor-pointer transition-all">
                  {editingItem ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================
          MODAL: CREAR / EDITAR CATEGORÍA PRINCIPAL
      ====================================================== */}
      {isSuperModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#171513] border border-[#e7e5e4] dark:border-[#2e2a27] rounded-3xl w-full max-w-sm overflow-hidden animate-fade-up">
            <div className="p-5 border-b border-stone-100 dark:border-stone-850 flex justify-between items-center bg-stone-50 dark:bg-stone-900/55">
              <div className="flex items-center gap-2.5">
                <LuFolderOpen className="w-5 h-5 text-brand-500" />
                <h3 className="font-black text-lg">{editingSuper ? "Editar Categoría" : "Nueva Categoría"}</h3>
              </div>
              <button onClick={() => setIsSuperModalOpen(false)} className="w-8 h-8 rounded-full bg-stone-200/60 dark:bg-stone-850 text-stone-600 dark:text-stone-400 hover:bg-stone-200 flex items-center justify-center cursor-pointer transition-colors">
                <LuX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSuper} className="p-5 space-y-4">
              <div>
                <label className={labelCls}>Nombre *</label>
                <div className="relative">
                  <LuPencilLine className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input type="text" required placeholder="Ej: Alimentos, Bebidas..." value={superName} onChange={(e) => setSuperName(e.target.value)} className={`${inputCls} pl-10`} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Icono (Emoji) *</label>
                <input type="text" required placeholder="Ej: 🍲 o 🥤" value={superIcon} onChange={(e) => setSuperIcon(e.target.value)} className={inputCls} />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsSuperModalOpen(false)} className="flex-1 py-3 bg-[#faf8f5] dark:bg-stone-900 border border-[#e7e5e4] dark:border-[#2e2a27] hover:bg-stone-100 rounded-xl font-bold text-xs cursor-pointer transition-all">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:brightness-105 text-white rounded-xl font-bold text-xs cursor-pointer transition-all">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================
          MODAL: CREAR / EDITAR SUBCATEGORÍA
      ====================================================== */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#171513] border border-[#e7e5e4] dark:border-[#2e2a27] rounded-3xl w-full max-w-sm overflow-hidden animate-fade-up">
            <div className="p-5 border-b border-stone-100 dark:border-stone-850 flex justify-between items-center bg-stone-50 dark:bg-stone-900/55">
              <div className="flex items-center gap-2.5">
                <LuTag className="w-5 h-5 text-brand-500" />
                <h3 className="font-black text-lg">{editingSub ? "Editar Subcategoría" : "Nueva Subcategoría"}</h3>
              </div>
              <button onClick={() => setIsSubModalOpen(false)} className="w-8 h-8 rounded-full bg-stone-200/60 dark:bg-stone-850 text-stone-600 dark:text-stone-400 hover:bg-stone-200 flex items-center justify-center cursor-pointer transition-colors">
                <LuX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSub} className="p-5 space-y-4">
              <div>
                <label className={labelCls}>Nombre *</label>
                <div className="relative">
                  <LuPencilLine className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input type="text" required placeholder="Ej: Caldos, Aguas Frescas..." value={subName} onChange={(e) => setSubName(e.target.value)} className={`${inputCls} pl-10`} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Icono (Emoji) *</label>
                <input type="text" required placeholder="Ej: 🍜 o ☕" value={subIcon} onChange={(e) => setSubIcon(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Categoría Principal Vinculada *</label>
                <select value={subSuperCatId} onChange={(e) => setSubSuperCatId(e.target.value)} className={`${inputCls} cursor-pointer`}>
                  {superCategories.map((sc) => (
                    <option key={sc.id} value={sc.id}>{sc.icon} {sc.name}</option>
                  ))}
                </select>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsSubModalOpen(false)} className="flex-1 py-3 bg-[#faf8f5] dark:bg-stone-900 border border-[#e7e5e4] dark:border-[#2e2a27] hover:bg-stone-100 rounded-xl font-bold text-xs cursor-pointer transition-all">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:brightness-105 text-white rounded-xl font-bold text-xs cursor-pointer transition-all">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-[#110f0e] border-t border-[#e7e5e4] dark:border-[#2e2a27] py-6 text-center text-xs text-[#a8a29e] mt-auto">
        <p className="font-bold">© 2026 Caldos Constitución — Administrador CMS</p>
      </footer>
    </div>
  );
}
