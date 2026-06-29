"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LuEye,
  LuEyeOff,
  LuLock,
  LuUser,
  LuLayoutDashboard,
  LuTriangleAlert,
  LuMail,
  LuArrowLeft,
  LuDatabase,
  LuKey,
  LuSettings2,
  LuRefreshCw,
  LuChevronDown,
} from "react-icons/lu";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { api } from "@/lib/api";

export default function AuthPage() {
  const router = useRouter();

  // Navigation and Menu state
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showDemoMenu, setShowDemoMenu] = useState<boolean>(false);

  // Forms state
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [forgotSuccess, setForgotSuccess] = useState<boolean>(false);

  // Global actions state
  const [notification, setNotification] = useState<string | null>(null);
  const [isResettingDb, setIsResettingDb] = useState<boolean>(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("caldo_admin_auth") === "true";
      if (auth) {
        router.replace("/admin");
      }
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim() === "admin" && passwordInput === "constitucion2026") {
      sessionStorage.setItem("caldo_admin_auth", "true");
      setLoginError("");
      setNotification("¡Sesión iniciada con éxito!");
      setTimeout(() => {
        router.push("/admin");
      }, 800);
    } else {
      setLoginError("Usuario o contraseña incorrectos");
      setPasswordInput("");
    }
  };

  const handleAutofill = () => {
    setUsernameInput("admin");
    setPasswordInput("constitucion2026");
    setLoginError("");
    setShowDemoMenu(false);
    setNotification("Credenciales listas. Haz clic en Acceder.");
    setTimeout(() => setNotification(null), 2500);
  };

  const handleResetDb = async () => {
    setIsResettingDb(true);
    try {
      await api.resetAll();
      setNotification("Base de datos restablecida con éxito");
      setTimeout(() => {
        setNotification(null);
        setShowDemoMenu(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      setNotification("Error al restablecer la base de datos");
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsResettingDb(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSuccess(true);
    setNotification("Instrucciones de recuperación enviadas.");
    setTimeout(() => {
      setForgotSuccess(false);
      setActiveTab("login");
      setForgotEmail("");
      setNotification(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen flex bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300 font-sans relative">
      
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-xs tracking-wider border bg-[#1c1917] dark:bg-[#2e2a27] text-white border-brand-500/20 animate-fade-up">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-ping" />
          {notification}
        </div>
      )}

      {/* Overlay para cerrar el menú demo al hacer clic fuera */}
      {showDemoMenu && (
        <div className="fixed inset-0 z-30" onClick={() => setShowDemoMenu(false)} />
      )}

      {/* Menú de Desarrollo (Demo Mode) Flotante */}
      <div className="fixed top-6 right-6 z-40">
        <button
          onClick={() => setShowDemoMenu(!showDemoMenu)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black tracking-wide border transition-all cursor-pointer ${
            showDemoMenu
              ? "bg-[#1c1917] text-white dark:bg-stone-200 dark:text-stone-900 border-transparent scale-95"
              : "bg-white dark:bg-[#171513] text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-brand-300 hover:text-brand-600"
          }`}
        >
          <LuSettings2 className="w-3.5 h-3.5" />
          Modo Demo
          <LuChevronDown className={`w-3 h-3 transition-transform ${showDemoMenu ? "rotate-180" : ""}`} />
        </button>

        {showDemoMenu && (
          <div className="absolute right-0 top-12 w-[320px] bg-white/95 dark:bg-[#171513]/95 backdrop-blur-md border border-stone-200/80 dark:border-stone-800/80 rounded-2xl p-4 animate-fade-up flex flex-col gap-4">
            
            <div className="space-y-1">
              <h3 className="text-[10px] uppercase font-black tracking-widest text-brand-600 dark:text-brand-500 flex items-center gap-1.5">
                <LuKey className="w-3 h-3" /> Credenciales de Acceso
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Usa el usuario <strong className="text-stone-800 dark:text-stone-200 font-mono font-bold">admin</strong> y la clave <strong className="text-stone-800 dark:text-stone-200 font-mono font-bold">constitucion2026</strong>.
              </p>
              <button
                onClick={handleAutofill}
                className="w-full mt-2 py-2 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/30 dark:hover:bg-brand-950/50 text-brand-700 dark:text-brand-400 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Autocompletar en el formulario
              </button>
            </div>

            <hr className="border-stone-100 dark:border-stone-850" />

            <div className="space-y-1">
              <h3 className="text-[10px] uppercase font-black tracking-widest text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <LuDatabase className="w-3 h-3" /> Almacenamiento Local
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-2">
                Los cambios se guardan en el navegador. Restaura los platos originales de fábrica si lo necesitas.
              </p>
              <button
                onClick={handleResetDb}
                disabled={isResettingDb}
                className="w-full py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-700 dark:text-red-400 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <LuRefreshCw className={`w-3.5 h-3.5 ${isResettingDb ? "animate-spin" : ""}`} />
                {isResettingDb ? "Restaurando..." : "Restablecer Base de Datos"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Left Side: Brand Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-brand-900 overflow-hidden select-none flex-col justify-between p-14">
        <div className="absolute inset-0 bg-dots opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        
        <div className="relative z-10 flex items-center gap-2 opacity-80">
          <span className="text-2xl">🍲</span>
          <span className="font-black text-xs uppercase tracking-widest text-brand-300">CMS System</span>
        </div>

        <div className="relative z-10 my-auto text-left">
          <div className="relative w-72 h-64 mb-8">
            <Image
              src="/logo.png"
              alt="Caldos Constitución Logo"
              fill
              sizes="288px"
              className="object-contain"
              unoptimized
            />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white leading-tight mb-4">
            Gestión <br/><span className="text-brand-400">Inteligente.</span>
          </h1>
          <p className="text-stone-300 max-w-sm text-sm font-medium leading-relaxed">
            Administra el menú digital, precios y categorías de Caldos Constitución con herramientas modernas y actualizaciones en tiempo real.
          </p>
        </div>

        <div className="relative z-10 text-[10px] uppercase font-bold tracking-widest text-brand-500/70">
          © 2026 Caldos Constitución
        </div>
      </div>

      {/* Right Side: Form Panel */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 relative bg-white dark:bg-[#0c0a09]">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 -right-20 w-[400px] h-[400px] bg-brand-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-stone-500/5 rounded-full blur-[80px] -z-10 pointer-events-none" />
        
        <div className="w-full max-w-[380px]">
          
          <div className="mb-10 text-center lg:text-left">
            <div className="relative w-36 h-28 mx-auto lg:hidden mb-6">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                sizes="144px"
                className="object-contain"
                unoptimized
              />
            </div>
            
            <h2 className="text-3xl font-black tracking-tight text-stone-900 dark:text-white mb-2">
              {activeTab === "login" ? "Bienvenido" : "Recuperación"}
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 font-medium">
              {activeTab === "login" 
                ? "Inicia sesión en tu cuenta para continuar." 
                : "Ingresa tu correo asociado a la cuenta."
              }
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            
            {/* TAB CONTENT: LOGIN */}
            <TabsContent value="login">
              {loginError && (
                <div className="mb-6 p-4 bg-red-50/50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-xs font-bold rounded-r-xl flex items-center gap-3 animate-fade-up">
                  <LuTriangleAlert className="w-5 h-5 text-red-500 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300">
                    Usuario
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-500 transition-colors">
                      <LuUser className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Ej. admin"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="w-full px-4 py-4 pl-12 bg-white dark:bg-[#171513] border border-stone-200 dark:border-stone-800 rounded-2xl outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-sm font-semibold transition-all text-stone-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300">
                      Contraseña
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab("forgot")}
                      className="text-[11px] font-bold text-brand-600 hover:text-brand-500 dark:text-brand-400 transition-colors cursor-pointer"
                    >
                      ¿Problemas?
                    </button>
                  </div>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-500 transition-colors">
                      <LuLock className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full px-4 py-4 pl-12 pr-12 bg-white dark:bg-[#171513] border border-stone-200 dark:border-stone-800 rounded-2xl outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-sm font-semibold transition-all text-stone-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer p-1"
                    >
                      {showPassword ? <LuEyeOff className="w-4 h-4" /> : <LuEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 mt-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-100 rounded-2xl font-black text-sm tracking-wide cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  <LuLayoutDashboard className="w-4.5 h-4.5" />
                  Acceder
                </button>
              </form>
            </TabsContent>

            {/* TAB CONTENT: FORGOT PASSWORD */}
            <TabsContent value="forgot">
              {forgotSuccess ? (
                <div className="p-5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold rounded-2xl flex flex-col gap-3 animate-fade-up text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                  </div>
                  <p>Instrucciones enviadas (simulación local).</p>
                  <p className="text-xs font-medium opacity-80">Revisa la dirección {forgotEmail}</p>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300">
                      Correo Electrónico
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-500 transition-colors">
                        <LuMail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="tu@correo.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full px-4 py-4 pl-12 bg-white dark:bg-[#171513] border border-stone-200 dark:border-stone-800 rounded-2xl outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-sm font-semibold transition-all text-stone-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-100 rounded-2xl font-black text-sm tracking-wide cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                  >
                    <LuMail className="w-4.5 h-4.5" />
                    Enviar Enlace de Acceso
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="w-full py-3.5 bg-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LuArrowLeft className="w-3.5 h-3.5" />
                    Volver a iniciar sesión
                  </button>
                </form>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center lg:text-left">
            <Link
              href="/"
              className="inline-flex items-center justify-center lg:justify-start gap-2 text-xs font-bold text-stone-400 hover:text-brand-500 transition-colors w-full"
            >
              <LuArrowLeft className="w-3.5 h-3.5" /> Volver a la Carta Digital
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

