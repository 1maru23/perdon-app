import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Heart,
  Music2,
  CalendarDays,
  MessageCircle,
  Sparkles,
  Image as ImageIcon,
  Phone,
  CheckCircle2,
  Lock,
  Unlock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CONFIG = {
  you: "Elías",
  her: "Anahí",
  nickname: "Chula Bella",
  primaryColor: "violet", // morado
  mainMessage:
    "Perdóname. Me equivoqué y quiero hablarlo contigo, con calma, con cariño. Estoy aquí para escucharte y reparar lo que hice. Sé que puedo mejorar y que voy a cambiar en todo.",
  letter: `
  Amor, sé que te hice daño y no hay excusa. Quiero que sepas que entendí por qué te dolió,
  y que mi prioridad es reconstruir tu confianza con acciones. Gracias por tu paciencia.
  Tú eres mi persona favorita y quiero ser mejor para ti cada día.
  `,
  promises: [
    "Escucharte sin interrumpir y validar tus emociones",
    "Ser transparente y honesto siempre",
    "Respetar tus tiempos y tus límites",
    "Expresar cariño y gratitud todos los días",
    "Comunicarme mejor cuando algo me preocupe",
  ],

  images: [
    { url: "/fotos/1.jpg", caption: "Nuestra primera salida sin saber como seria todo" },
    { url: "/fotos/2.jpg", caption: "nuestro abrazo favorito" },
    { url: "/fotos/3.jpg", caption: "Dias que jamas olvidare" },
    { url: "/fotos/4.jpg", caption: "Nuestro mejor baile" },
    { url: "/fotos/5.jpg", caption: "Un dia muy divertido" },
    { url: "/fotos/6.jpg", caption: "Tu acompañandome en mis locuras" },
  ],
  nextDateISO: "2025-12-01T19:30:00",
 
  music: {
    
    spotifyUrl: "https://open.spotify.com/playlist/2fTcGqGmXtUgWWhT4qimfC?si=8e3bb3f648a74c1b",
  },
  whatsappNumber: "+593980212709",
  secret: {
    passcode: "yapi",
    message:
      "Lo digo en alto: quiero construir un futuro contigo. Prometo sumar, cuidar y elegirte cada día. Porque te amo y adoro cada un de tus detalles. ❤️",
  },
};

const cx = (...classes) => classes.filter(Boolean).join(" ");
const theme = (color) => ({
  ring: `ring-${color}-300`,
  bgSoft: `bg-${color}-50 dark:bg-${color}-950/30`,
  text: `text-${color}-700 dark:text-${color}-200`,
  accent: `from-${color}-500 to-${color}-600`,
  btn: `bg-${color}-600 hover:bg-${color}-700 text-white`,
  chip: `bg-${color}-100 text-${color}-800 dark:bg-${color}-900/40 dark:text-${color}-200`,
});

function timeUntil(dateISO) {
  const target = new Date(dateISO).getTime();
  const now = Date.now();
  let diff = Math.max(0, target - now);
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= d * 86400000;
  const h = Math.floor(diff / 3600000);
  diff -= h * 3600000;
  const m = Math.floor(diff / 60000);
  diff -= m * 60000;
  const s = Math.floor(diff / 1000);
  return { d, h, m, s };
}

function toSpotifyEmbed(urlOrUri) {
  if (!urlOrUri) return "";
  const uri = urlOrUri.match(/^spotify:(track|album|playlist):([A-Za-z0-9]+)/i);
  if (uri) return `https://open.spotify.com/embed/${uri[1]}/${uri[2]}`;
  try {
    const u = new URL(urlOrUri);
    const [kind, id] = u.pathname.split("/").filter(Boolean); // playlist/ID
    if (["track", "album", "playlist"].includes(kind) && id) {
      return `https://open.spotify.com/embed/${kind}/${id}`;
    }
  } catch {}
  return "";
}

function toYouTubeEmbed(url) {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      const list = u.searchParams.get("list");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (list) return `https://www.youtube.com/embed/videoseries?list=${list}`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {}
  return "";
}
export default function ForgivenessPage() {
  const t = useMemo(() => theme(CONFIG.primaryColor), []);
  const [until, setUntil] = useState(timeUntil(CONFIG.nextDateISO));
  const [checked, setChecked] = useState(() => {
    const raw = localStorage.getItem("promises_state");
    return raw ? JSON.parse(raw) : Array(CONFIG.promises.length).fill(false);
  });
  const [hearts, setHearts] = useState([]);
  const [pass, setPass] = useState("");
  const [reveal, setReveal] = useState(false);
  const [nameFrom, setNameFrom] = useState(CONFIG.you);
  const [nameTo, setNameTo] = useState(CONFIG.her);
  const heartTimer = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setUntil(timeUntil(CONFIG.nextDateISO)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    localStorage.setItem("promises_state", JSON.stringify(checked));
  }, [checked]);

  const burstHearts = () => {
    const batch = Array.from({ length: 14 }).map((_, i) => ({
      id: Math.random(),
      x: Math.random() * 100,
      delay: i * 0.03,
    }));
    setHearts((prev) => [...prev, ...batch]);
    clearTimeout(heartTimer.current);
    heartTimer.current = setTimeout(() => setHearts([]), 2000);
  };

  const handleWA = () => {
    if (!CONFIG.whatsappNumber) return;
    const msg = encodeURIComponent(
      `Hola ${nameTo} ❤️\nQuise hacer esto para pedirte perdón. ¿Podemos hablar cuando te sientas lista? — ${nameFrom}`
    );
    const link = `https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`;
    window.open(link, "_blank");
  };

  return (
    <div
      className={cx(
        "min-h-screen w-full text-slate-800 dark:text-slate-100 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900",
        t.bgSoft
      )}
    >
      {/* Header */}
      <header className="sticky top-0 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-slate-950/40 border-b border-white/20 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className={cx("w-5 h-5", t.text)} />
            <span className={cx("font-semibold", t.text)}>Para {nameTo}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="opacity-70">Hecho con cariño por</span>
            <input
              className={cx(
                "px-2 py-1 rounded-md bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 outline-none",
                t.ring
              )}
              value={nameFrom}
              onChange={(e) => setNameFrom(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-black leading-tight"
          >
            {nameTo ? `${nameTo},` : "Amor,"} ¿me perdonas?
          </motion.h1>
          <p className="mt-4 text-lg opacity-90">{CONFIG.mainMessage}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={burstHearts}
              className={cx(
                "px-4 py-2 rounded-xl shadow-sm inline-flex items-center gap-2",
                t.btn
              )}
            >
              <Sparkles className="w-4 h-4" />
              Enviar corazones
            </button>
            {CONFIG.whatsappNumber && (
              <button
                onClick={handleWA}
                className="px-4 py-2 rounded-xl shadow-sm inline-flex items-center gap-2 bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <Phone className="w-4 h-4" /> Hablar por WhatsApp
              </button>
            )}
          </div>

          {/* Floating hearts */}
          <AnimatePresence>
            {hearts.map((h) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -160 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.6, delay: h.delay, ease: "easeOut" }}
                className="absolute"
                style={{ left: `${h.x}%` }}
              >
                <Heart className={cx("w-6 h-6", t.text)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="rounded-2xl p-5 border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className={cx("w-5 h-5", t.text)} />
            <h3 className="font-semibold">Cuenta regresiva a nuestra próxima cita</h3>
          </div>
          <Countdown {...until} />
          <p className="mt-3 text-sm opacity-70">
            Objetivo: {new Date(CONFIG.nextDateISO).toLocaleString()}
          </p>
        </div>
      </section>

      {/* Carta */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <Card title="Carta para ti" icon={<MessageCircle className="w-5 h-5" />}>
          <textarea
            className="w-full min-h-[160px] md:min-h-[120px] rounded-xl p-4 bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 outline-none"
            defaultValue={CONFIG.letter}
          />
          <div className="mt-3 text-sm opacity-70">
            Puedes editar el texto aquí mismo antes de enviarle el enlace 💬
          </div>
        </Card>
      </section>

      {/* Promesas */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <Card title="Mis compromisos contigo" icon={<CheckCircle2 className="w-5 h-5" />}>
          <ul className="grid md:grid-cols-2 gap-3">
            {CONFIG.promises.map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <input
                  id={`p-${i}`}
                  type="checkbox"
                  checked={checked[i]}
                  onChange={(e) =>
                    setChecked((prev) =>
                      prev.map((v, idx) => (idx === i ? e.target.checked : v))
                    )
                  }
                  className="mt-1 w-5 h-5 rounded border-slate-300 dark:border-slate-700"
                />
                <label htmlFor={`p-${i}`} className="cursor-pointer select-none">
                  {p}
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-xs opacity-70">
            Se guarda en tu navegador para que veas tu progreso.
          </div>
        </Card>
      </section>

      {/* Galería */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <Card title="Nuestros recuerdos" icon={<ImageIcon className="w-5 h-5" />}>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {CONFIG.images.map((img, i) => (
              <figure
                key={i}
                className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900"
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    // primer fallback: placeholder local
                    if (!e.currentTarget.dataset.fallback) {
                      e.currentTarget.dataset.fallback = "1";
                      e.currentTarget.src = "/fotos/placeholder.jpg";
                    }
                  }}
                  className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <figcaption className="p-3 text-sm opacity-80">
                  {img.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </Card>
      </section>

      {/* Música con fallbacks */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <Card title="Nuestra música" icon={<Music2 className="w-5 h-5" />}>
          <MusicCard music={CONFIG.music} />
        </Card>
      </section>

      {/* Mensaje secreto */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <Card
          title="Mensaje secreto"
          icon={reveal ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
        >
          {!reveal ? (
            <div className="flex items-center gap-3">
              <input
                placeholder="Escribe el código (pista: algo que siempre le dices)"
                className="flex-1 px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 outline-none"
                value={pass}
                onChange={(e) => setPass(e.target.value.toUpperCase())}
              />
              <button
                onClick={() =>
                  setReveal(pass.trim() === CONFIG.secret.passcode.toUpperCase())
                }
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white"
              >
                Desbloquear
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200">
              {CONFIG.secret.message}
            </div>
          )}
        </Card>
      </section>

      {/* Call to action final */}
      <section className="max-w-4xl mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50"
        >
          <h3 className="text-2xl font-bold">
            ¿Me das la oportunidad de hablar y arreglarlo?
          </h3>
          <p className="mt-2 opacity-80">
            Prometo escucharte y cumplir cada compromiso, paso a paso.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <a
              href={`mailto:?subject=${encodeURIComponent(
                "¿Hablamos? 💌"
              )}&body=${encodeURIComponent(
                "Quiero pedirte perdón y escucharte. Te mando esta página que hice para ti."
              )}`}
              className="px-5 py-3 rounded-xl inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white"
            >
              <MessageCircle className="w-5 h-5" /> Enviar por correo
            </a>
            {CONFIG.whatsappNumber && (
              <button
                onClick={handleWA}
                className="px-5 py-3 rounded-xl inline-flex items-center gap-2 bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <Phone className="w-5 h-5" /> Enviar por WhatsApp
              </button>
            )}
          </div>
        </motion.div>
        <p className="mt-6 text-xs opacity-60">
          Hecho con amor por {nameFrom}. Siempre te elegiría,{" "}
          {nameTo || CONFIG.nickname}.
        </p>
      </section>

      <footer className="py-10 text-center text-xs opacity-60">
        © {new Date().getFullYear()} — Amor y paciencia.
      </footer>
    </div>
  );
}
function Card({ title, icon, children }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-violet-600 text-white">
          {icon}
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Countdown({ d, h, m, s }) {
  const Item = ({ v, label }) => (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
      <div className="text-3xl font-black tabular-nums">
        {String(v).padStart(2, "0")}
      </div>
      <div className="text-xs opacity-70">{label}</div>
    </div>
  );
  return (
    <div className="grid grid-cols-4 gap-3">
      <Item v={d} label="días" />
      <Item v={h} label="horas" />
      <Item v={m} label="min" />
      <Item v={s} label="seg" />
    </div>
  );
}

function MusicCard({ music }) {
  const [spotifyLoaded, setSpotifyLoaded] = useState(false);
  const spotifyEmbed = toSpotifyEmbed(music.spotifyUrl);
  const ytEmbed = toYouTubeEmbed(music.youtubeUrl);

  useEffect(() => {
    if (!spotifyEmbed) return;
    const t = setTimeout(() => {
      // si no disparó onLoad, no está loaded => sigue false
      setSpotifyLoaded((prev) => prev); 
    }, 3000);
    return () => clearTimeout(t);
  }, [spotifyEmbed]);

  return (
    <div className="space-y-3">
      {spotifyEmbed && (
        <div className="aspect-video w-full">
          <iframe
            key={spotifyEmbed}
            title="Spotify"
            className="rounded-xl w-full h-full border border-slate-200 dark:border-slate-800"
            src={spotifyEmbed}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            onLoad={() => setSpotifyLoaded(true)}
          />
        </div>
      )}

      {/* Fallback a YouTube si Spotify no cargó */}
      {!spotifyLoaded && ytEmbed && (
        <div className="aspect-video w-full">
          <iframe
            key={ytEmbed}
            className="rounded-xl w-full h-full border border-slate-200 dark:border-slate-800"
            src={ytEmbed}
            title="YouTube Music"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )}

      {/* Fallback a audio local */}
      {!spotifyLoaded && !ytEmbed && music.localAudio && (
        <audio controls className="w-full">
          <source src={music.localAudio} type="audio/mpeg" />
          Tu navegador no soporta el elemento de audio.
        </audio>
      )}

      <div className="text-sm opacity-80">
        <a
          className="underline"
          href={music.spotifyUrl || "#"}
          target="_blank"
          rel="noreferrer"
        >
          Abrir directamente en Spotify
        </a>
      </div>
    </div>
  );
}
