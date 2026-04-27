import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/09a5441f-de31-45db-b399-e91316d95c39/files/aa79cc22-531a-427e-a7dd-b8ae81ccb0ba.jpg";
const TERRACE_IMG = "https://cdn.poehali.dev/projects/09a5441f-de31-45db-b399-e91316d95c39/files/5d462ae4-938e-490b-abac-430189e83048.jpg";
const SPREAD_IMG = "https://cdn.poehali.dev/projects/09a5441f-de31-45db-b399-e91316d95c39/files/97090c66-fcf9-4fbb-8426-1676b4fac0e3.jpg";

const MENU_ITEMS = [
  { id: 1, name: "Шашлык из баранины", weight: "300г", price: 500, tag: "Хит", emoji: "🐑", desc: "Молодой ягнёнок, кавказские специи, маринад 24ч" },
  { id: 2, name: "Шашлык из свинины", weight: "300г", price: 390, tag: "", emoji: "🐷", desc: "Шейная часть, лук, чёрный перец" },
  { id: 3, name: "Шашлык из говядины", weight: "300г", price: 500, tag: "", emoji: "🥩", desc: "Отборная говядина, натуральные специи" },
  { id: 4, name: "Курица на мангале", weight: "300г", price: 330, tag: "", emoji: "🍗", desc: "Бёдрышки или грудка, аджика, чеснок" },
  { id: 5, name: "Шашлык из индейки", weight: "300г", price: 400, tag: "", emoji: "🦃", desc: "Нежное мясо индейки, прованские травы" },
  { id: 6, name: "Люля говяжий", weight: "300г", price: 330, tag: "", emoji: "🥩", desc: "Говяжий фарш, лук, зелень на шпаге" },
  { id: 7, name: "Люля баранина", weight: "300г", price: 330, tag: "", emoji: "🐑", desc: "Бараний фарш, кинза, кавказские специи" },
  { id: 8, name: "Люля свинина", weight: "300г", price: 330, tag: "", emoji: "🐷", desc: "Свиной фарш, лук, чёрный перец" },
];

type CartItem = { id: number; name: string; price: number; qty: number };
type DeliveryType = "delivery" | "pickup";
type Section = "home" | "menu" | "gallery" | "about" | "contacts" | "delivery";

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", address: "" });

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const addToCart = (item: typeof MENU_ITEMS[0]) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c).filter(c => c.qty > 0));
  };

  const submitOrder = () => {
    setOrderSuccess(true);
    setCart([]);
    setTimeout(() => { setOrderSuccess(false); setCartOpen(false); }, 3000);
  };

  const navItems: { key: Section; label: string }[] = [
    { key: "home", label: "Главная" },
    { key: "menu", label: "Меню" },
    { key: "delivery", label: "Доставка" },
    { key: "gallery", label: "Галерея" },
    { key: "about", label: "О нас" },
    { key: "contacts", label: "Контакты" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => setActiveSection("home")} className="font-oswald text-2xl font-bold text-[hsl(var(--fire))] glow-text tracking-wider">
            🔥 ШАШЛЫК ХАУС
          </button>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map(n => (
              <button
                key={n.key}
                onClick={() => setActiveSection(n.key)}
                className={`font-oswald text-sm tracking-widest uppercase transition-colors ${activeSection === n.key ? "text-[hsl(var(--fire))]" : "text-foreground/70 hover:text-foreground"}`}
              >
                {n.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 bg-[hsl(var(--fire))] text-background font-oswald font-semibold px-4 py-2 rounded-full hover:brightness-110 transition-all pulse-glow"
            >
              <Icon name="ShoppingCart" size={16} />
              <span className="hidden sm:inline">Корзина</span>
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[hsl(var(--ember))] text-background text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce-in">
                  {totalCount}
                </span>
              )}
            </button>
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              <Icon name={menuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-background border-t border-border py-4 px-4 flex flex-col gap-3">
            {navItems.map(n => (
              <button key={n.key} onClick={() => { setActiveSection(n.key); setMenuOpen(false); }}
                className={`font-oswald text-sm tracking-widest uppercase text-left py-2 transition-colors ${activeSection === n.key ? "text-[hsl(var(--fire))]" : "text-foreground/70"}`}>
                {n.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      {activeSection === "home" && (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={HERO_IMG} alt="Шашлык" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
            <div className="absolute inset-0 fire-bg opacity-60" />
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="ember absolute w-1.5 h-1.5 rounded-full bg-[hsl(var(--fire))]"
                style={{
                  left: `${10 + i * 7}%`,
                  bottom: `${20 + (i % 4) * 15}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${2 + (i % 3) * 0.8}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center max-w-4xl px-4 pt-20">
            <div className="animate-fade-in-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
              <span className="inline-block font-golos text-[hsl(var(--ember))] text-sm tracking-[0.3em] uppercase mb-6 border border-[hsl(var(--fire))]/40 px-4 py-2 rounded-full bg-[hsl(var(--fire))]/10">
                🔥 Мясо на живом огне с 2008 года
              </span>
            </div>

            <h1 className="font-oswald text-6xl md:text-8xl font-bold leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
              <span className="text-foreground">НАСТОЯЩИЙ</span>
              <br />
              <span className="text-[hsl(var(--fire))] glow-text">ШАШЛЫК</span>
              <br />
              <span className="text-foreground text-4xl md:text-5xl font-medium">С ДОСТАВКОЙ</span>
            </h1>

            <p className="font-golos text-foreground/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
              Готовим на мангале из фруктовых дров. Доставляем горячим за 45 минут или ждём на самовывозе.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
              <button
                onClick={() => setActiveSection("menu")}
                className="font-oswald text-lg tracking-widest uppercase bg-[hsl(var(--fire))] text-background px-10 py-4 rounded-full hover:brightness-110 transition-all pulse-glow font-semibold"
              >
                Заказать сейчас
              </button>
              <button
                onClick={() => setActiveSection("about")}
                className="font-oswald text-lg tracking-widest uppercase border border-[hsl(var(--fire))]/50 text-foreground px-10 py-4 rounded-full hover:border-[hsl(var(--fire))] hover:text-[hsl(var(--fire))] transition-all"
              >
                О нас
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-16 animate-fade-in-up" style={{ animationDelay: "0.5s", opacity: 0 }}>
              {[
                { n: "15+", label: "Лет работы" },
                { n: "50к+", label: "Довольных гостей" },
                { n: "45 мин", label: "Доставка" },
              ].map(s => (
                <div key={s.n} className="text-center">
                  <div className="font-oswald text-3xl md:text-4xl font-bold text-[hsl(var(--fire))]">{s.n}</div>
                  <div className="font-golos text-foreground/60 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <Icon name="ChevronDown" size={28} className="text-[hsl(var(--fire))]/60" />
          </div>
        </section>
      )}

      {/* MENU */}
      {activeSection === "menu" && (
        <section className="min-h-screen pt-24 pb-20 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-golos text-[hsl(var(--ember))] text-sm tracking-[0.3em] uppercase">Всё на живом огне</span>
            <h2 className="font-oswald text-5xl md:text-6xl font-bold mt-2">НАШЕ <span className="text-[hsl(var(--fire))]">МЕНЮ</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MENU_ITEMS.map((item) => {
              const inCart = cart.find(c => c.id === item.id);
              return (
                <div
                  key={item.id}
                  className="relative bg-card border border-border rounded-2xl p-6 hover:border-[hsl(var(--fire))]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_hsl(22,100%,55%,0.15)]"
                >
                  {item.tag && (
                    <span className={`absolute top-4 right-4 font-oswald text-xs tracking-wider uppercase px-3 py-1 rounded-full font-semibold ${item.tag === "Хит" ? "bg-[hsl(var(--fire))] text-background" : item.tag === "Премиум" ? "bg-[hsl(var(--ember))] text-background" : "bg-secondary text-foreground/80"}`}>
                      {item.tag}
                    </span>
                  )}
                  <div className="text-5xl mb-4">{item.emoji}</div>
                  <h3 className="font-oswald text-xl font-semibold mb-1">{item.name}</h3>
                  <p className="font-golos text-foreground/50 text-sm mb-4">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-oswald text-2xl font-bold text-[hsl(var(--fire))]">{item.price} ₽</span>
                      <span className="font-golos text-foreground/40 text-sm ml-2">{item.weight}</span>
                    </div>
                    {inCart ? (
                      <div className="flex items-center gap-2 bg-secondary rounded-full px-2 py-1">
                        <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-full bg-[hsl(var(--fire))] text-background flex items-center justify-center">
                          <Icon name="Minus" size={14} />
                        </button>
                        <span className="font-oswald font-bold text-[hsl(var(--fire))] w-5 text-center">{inCart.qty}</span>
                        <button onClick={() => addToCart(item)} className="w-7 h-7 rounded-full bg-[hsl(var(--fire))] text-background flex items-center justify-center">
                          <Icon name="Plus" size={14} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(item)} className="font-oswald text-sm tracking-wider uppercase bg-[hsl(var(--fire))] text-background px-5 py-2 rounded-full hover:brightness-110 transition-all font-semibold">
                        В корзину
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {cart.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
              <button onClick={() => setCartOpen(true)} className="font-oswald text-base tracking-wider uppercase bg-[hsl(var(--fire))] text-background px-8 py-4 rounded-full pulse-glow flex items-center gap-3 font-semibold shadow-2xl">
                <Icon name="ShoppingCart" size={20} />
                Оформить заказ · {total} ₽
              </button>
            </div>
          )}
        </section>
      )}

      {/* DELIVERY */}
      {activeSection === "delivery" && (
        <section className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-golos text-[hsl(var(--ember))] text-sm tracking-[0.3em] uppercase">Быстро и горячо</span>
            <h2 className="font-oswald text-5xl md:text-6xl font-bold mt-2">ДОСТАВКА <span className="text-[hsl(var(--fire))]">И САМОВЫВОЗ</span></h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[
              { type: "delivery" as DeliveryType, icon: "Truck", title: "Доставка", price: "от 199 ₽", time: "45–60 минут", desc: "Доставляем горячим в термосумке. Минимальный заказ 800 ₽", features: ["🌡️ Термосумка", "📍 Весь город", "🕐 Пн–Вс 11:00–23:00"] },
              { type: "pickup" as DeliveryType, icon: "MapPin", title: "Самовывоз", price: "Бесплатно", time: "20 минут", desc: "Забери готовый заказ в ресторане. Скидка 5% при самовывозе", features: ["💸 Скидка 5%", "🏠 Ул. Мясная, 1", "🕐 Пн–Вс 11:00–00:00"] },
            ].map(opt => (
              <div key={opt.type} onClick={() => setDeliveryType(opt.type)} className={`cursor-pointer border-2 rounded-2xl p-8 transition-all duration-300 ${deliveryType === opt.type ? "border-[hsl(var(--fire))] bg-[hsl(var(--fire))]/10 shadow-[0_0_30px_hsl(22,100%,55%,0.2)]" : "border-border bg-card hover:border-[hsl(var(--fire))]/40"}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${deliveryType === opt.type ? "bg-[hsl(var(--fire))]" : "bg-secondary"}`}>
                    <Icon name={opt.icon as "Truck" | "MapPin"} size={26} className={deliveryType === opt.type ? "text-background" : "text-foreground"} />
                  </div>
                  <div>
                    <h3 className="font-oswald text-2xl font-bold">{opt.title}</h3>
                    <span className="font-golos text-[hsl(var(--fire))] text-sm font-semibold">{opt.price} · {opt.time}</span>
                  </div>
                </div>
                <p className="font-golos text-foreground/60 text-sm mb-4">{opt.desc}</p>
                <div className="flex flex-col gap-2">{opt.features.map(f => <span key={f} className="font-golos text-sm text-foreground/70">{f}</span>)}</div>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 mb-8">
            <h3 className="font-oswald text-2xl font-bold mb-6">Зоны доставки</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { zone: "Центр", time: "30–40 мин", price: "199 ₽" },
                { zone: "Север", time: "40–55 мин", price: "249 ₽" },
                { zone: "Юг", time: "40–55 мин", price: "249 ₽" },
                { zone: "Восток", time: "50–65 мин", price: "299 ₽" },
                { zone: "Запад", time: "50–65 мин", price: "299 ₽" },
                { zone: "Пригород", time: "60–80 мин", price: "399 ₽" },
              ].map(z => (
                <div key={z.zone} className="bg-secondary rounded-xl p-4">
                  <div className="font-oswald text-lg font-bold text-[hsl(var(--fire))]">{z.zone}</div>
                  <div className="font-golos text-foreground/60 text-sm">{z.time}</div>
                  <div className="font-golos text-foreground/80 text-sm font-semibold">{z.price}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button onClick={() => setActiveSection("menu")} className="font-oswald text-lg tracking-widest uppercase bg-[hsl(var(--fire))] text-background px-12 py-4 rounded-full pulse-glow font-semibold hover:brightness-110 transition-all">
              Перейти к меню
            </button>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {activeSection === "gallery" && (
        <section className="min-h-screen pt-24 pb-16 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-golos text-[hsl(var(--ember))] text-sm tracking-[0.3em] uppercase">Атмосфера живого огня</span>
            <h2 className="font-oswald text-5xl md:text-6xl font-bold mt-2">ГАЛЕРЕЯ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="relative group overflow-hidden rounded-3xl aspect-video">
              <img src={HERO_IMG} alt="Шашлык" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="font-oswald text-xl font-bold">Живой огонь</span>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-3xl aspect-video">
              <img src={TERRACE_IMG} alt="Терраса" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="font-oswald text-xl font-bold">Летняя терраса</span>
              </div>
            </div>
          </div>
          <div className="relative group overflow-hidden rounded-3xl">
            <img src={SPREAD_IMG} alt="Подача" className="w-full h-64 md:h-96 object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
              <span className="font-oswald text-2xl font-bold">Кавказское застолье</span>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-3 md:grid-cols-6 gap-4">
            {["🔥", "🥩", "🌿", "🍋", "🧅", "🫙"].map((e, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl flex items-center justify-center h-24 text-4xl hover:border-[hsl(var(--fire))]/50 hover:scale-105 transition-all">
                {e}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ABOUT */}
      {activeSection === "about" && (
        <section className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-golos text-[hsl(var(--ember))] text-sm tracking-[0.3em] uppercase">Наша история</span>
            <h2 className="font-oswald text-5xl md:text-6xl font-bold mt-2">О <span className="text-[hsl(var(--fire))]">НАС</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <p className="font-golos text-foreground/70 text-lg leading-relaxed mb-6">
                Мангал Хаус открылся в 2008 году с одной идеей: готовить шашлык так, как это делали наши деды — на фруктовых дровах, с любовью и терпением.
              </p>
              <p className="font-golos text-foreground/70 text-lg leading-relaxed mb-6">
                Мы маринуем мясо минимум 12 часов, используем только свежие продукты от местных фермеров и не добавляем никаких усилителей вкуса.
              </p>
              <p className="font-golos text-foreground/70 text-lg leading-relaxed">
                Сегодня наши гости — это 50 000+ довольных семей, которые возвращаются к нам снова и снова.
              </p>
            </div>
            <div className="relative">
              <img src={TERRACE_IMG} alt="Ресторан" className="rounded-3xl w-full aspect-square object-cover" />
              <div className="absolute -bottom-4 -left-4 bg-[hsl(var(--fire))] text-background font-oswald text-2xl font-bold px-6 py-4 rounded-2xl">
                15+ лет<br /><span className="text-sm font-golos font-normal opacity-80">традиций</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "Flame", label: "Фруктовые дрова", desc: "Вишня, яблоня, груша" },
              { icon: "Clock", label: "12+ часов маринада", desc: "Натуральные специи" },
              { icon: "Leaf", label: "Свежее мясо", desc: "Местные фермеры" },
              { icon: "Star", label: "4.9 на Яндекс", desc: "1200+ отзывов" },
            ].map(f => (
              <div key={f.label} className="bg-card border border-border rounded-2xl p-6 text-center hover:border-[hsl(var(--fire))]/40 transition-all">
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--fire))]/20 flex items-center justify-center mx-auto mb-4">
                  <Icon name={f.icon as "Flame" | "Clock" | "Leaf" | "Star"} size={22} className="text-[hsl(var(--fire))]" />
                </div>
                <div className="font-oswald text-sm font-semibold mb-1">{f.label}</div>
                <div className="font-golos text-foreground/50 text-xs">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACTS */}
      {activeSection === "contacts" && (
        <section className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-golos text-[hsl(var(--ember))] text-sm tracking-[0.3em] uppercase">Мы всегда рядом</span>
            <h2 className="font-oswald text-5xl md:text-6xl font-bold mt-2">КОНТАКТЫ</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              {[
                { icon: "Phone", label: "Телефон", value: "+7 (999) 123-45-67", sub: "Звонки и WhatsApp" },
                { icon: "MapPin", label: "Адрес", value: "ул. Мясная, 1", sub: "Центр города, парковка рядом" },
                { icon: "Clock", label: "Часы работы", value: "11:00 – 00:00", sub: "Без выходных" },
                { icon: "Send", label: "Соцсети", value: "@mangalhouse", sub: "ВКонтакте, Telegram" },
              ].map(c => (
                <div key={c.label} className="bg-card border border-border rounded-2xl p-6 flex items-center gap-5 hover:border-[hsl(var(--fire))]/40 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[hsl(var(--fire))]/20 flex items-center justify-center shrink-0">
                    <Icon name={c.icon as "Phone" | "MapPin" | "Clock" | "Send"} size={22} className="text-[hsl(var(--fire))]" />
                  </div>
                  <div>
                    <div className="font-golos text-foreground/50 text-xs mb-0.5">{c.label}</div>
                    <div className="font-oswald text-lg font-semibold">{c.value}</div>
                    <div className="font-golos text-foreground/50 text-sm">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="font-oswald text-2xl font-bold mb-6">Написать нам</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Ваше имя" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 font-golos text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[hsl(var(--fire))] transition-colors" />
                <input type="tel" placeholder="Телефон" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 font-golos text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[hsl(var(--fire))] transition-colors" />
                <textarea rows={4} placeholder="Ваш вопрос или пожелание" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 font-golos text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[hsl(var(--fire))] transition-colors resize-none" />
                <button className="w-full font-oswald text-base tracking-widest uppercase bg-[hsl(var(--fire))] text-background py-4 rounded-xl hover:brightness-110 transition-all font-semibold pulse-glow">
                  Отправить
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative bg-card border-l border-border w-full max-w-md flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="font-oswald text-2xl font-bold">КОРЗИНА</h3>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:text-[hsl(var(--fire))] transition-colors">
                <Icon name="X" size={22} />
              </button>
            </div>

            {orderSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h4 className="font-oswald text-2xl font-bold text-[hsl(var(--fire))] mb-2">Заказ принят!</h4>
                <p className="font-golos text-foreground/60">Мы свяжемся с вами в течение 5 минут</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-5xl mb-4">🛒</div>
                      <p className="font-golos text-foreground/40">Корзина пуста</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between bg-secondary rounded-xl p-4">
                        <div>
                          <div className="font-oswald font-semibold text-sm">{item.name}</div>
                          <div className="font-golos text-[hsl(var(--fire))] text-sm">{item.price * item.qty} ₽</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-full bg-[hsl(var(--fire))] text-background flex items-center justify-center">
                            <Icon name="Minus" size={12} />
                          </button>
                          <span className="font-oswald font-bold w-5 text-center">{item.qty}</span>
                          <button onClick={() => { const m = MENU_ITEMS.find(mi => mi.id === item.id)!; addToCart(m); }} className="w-7 h-7 rounded-full bg-[hsl(var(--fire))] text-background flex items-center justify-center">
                            <Icon name="Plus" size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="border-t border-border p-6 space-y-4">
                    <div className="flex gap-3">
                      {(["delivery", "pickup"] as DeliveryType[]).map(t => (
                        <button key={t} onClick={() => setDeliveryType(t)} className={`flex-1 font-oswald text-sm uppercase tracking-wider py-2.5 rounded-xl transition-all ${deliveryType === t ? "bg-[hsl(var(--fire))] text-background" : "bg-secondary text-foreground/60"}`}>
                          {t === "delivery" ? "Доставка" : "Самовывоз"}
                        </button>
                      ))}
                    </div>
                    <input value={orderForm.name} onChange={e => setOrderForm(f => ({ ...f, name: e.target.value }))} placeholder="Ваше имя" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 font-golos text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[hsl(var(--fire))] transition-colors" />
                    <input value={orderForm.phone} onChange={e => setOrderForm(f => ({ ...f, phone: e.target.value }))} placeholder="Телефон" type="tel" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 font-golos text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[hsl(var(--fire))] transition-colors" />
                    {deliveryType === "delivery" && (
                      <input value={orderForm.address} onChange={e => setOrderForm(f => ({ ...f, address: e.target.value }))} placeholder="Адрес доставки" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 font-golos text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[hsl(var(--fire))] transition-colors" />
                    )}
                    <div className="flex items-center justify-between py-2">
                      <span className="font-golos text-foreground/60">Итого:</span>
                      <span className="font-oswald text-2xl font-bold text-[hsl(var(--fire))]">{total} ₽</span>
                    </div>
                    <button onClick={submitOrder} disabled={!orderForm.name || !orderForm.phone} className="w-full font-oswald text-base tracking-widest uppercase bg-[hsl(var(--fire))] text-background py-4 rounded-xl hover:brightness-110 transition-all font-semibold pulse-glow disabled:opacity-40 disabled:cursor-not-allowed">
                      Оформить заказ
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-border py-8 px-4 text-center">
        <div className="font-oswald text-[hsl(var(--fire))] text-xl glow-text mb-2">🔥 ШАШЛЫК ХАУС</div>
        <p className="font-golos text-foreground/40 text-sm">© 2008–2026 · Настоящий шашлык с любовью</p>
      </footer>
    </div>
  );
}