"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";

type AdmissionResultResponse = {
  nim: string;
  nama: string;
  posisi: string;
  lolos: boolean;
};

type ModalPhase = "loading" | "not-found" | "countdown" | "result" | "error";

type ConfettiPiece = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  rotate: number;
  color: string;
};

const ANNOUNCEMENT_API_URL =
  "https://script.google.com/macros/s/AKfycbzoaAS00T29NaUw_XgE8PoY0h9CfmlBVKEcgaDolR3Brrg8JWT9X226leevQBjZR-JSiQ/exec";

const WA_TARGET = "628116210151";

const confettiColors = [
  "#ffcb2f",
  "#f58d1d",
  "#0ea5e9",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
];

function pseudoRandom(seed: number, index: number) {
  const value = Math.sin(seed * 97 + index * 73) * 10000;
  return value - Math.floor(value);
}

const ADMISSION_SLIDES = [
  {
    id: 1,
    image: "/images/executives/gallery/2025/aslab-1.jpg",
    alt: "Galeri Aslab Prodigi 2025 - foto bersama",
  },
  {
    id: 2,
    image: "/images/executives/gallery/2025/aslab-2.jpg",
    alt: "Galeri Aslab Prodigi 2025 - formasi resmi",
  },
  {
    id: 3,
    image: "/images/executives/gallery/2025/aslab-3.jpg",
    alt: "Galeri Aslab Prodigi 2025 - momen santai",
  },
] as const;

export default function AslabAnnouncementClient() {
  const sliderItems = useMemo(() => ADMISSION_SLIDES, []);

  const [activeSlide, setActiveSlide] = useState(0);
  const [nim, setNim] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPhase, setModalPhase] = useState<ModalPhase>("loading");
  const [modalMessage, setModalMessage] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [resultData, setResultData] = useState<AdmissionResultResponse | null>(
    null,
  );
  const [confettiSeed, setConfettiSeed] = useState(0);

  useEffect(() => {
    if (sliderItems.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliderItems.length);
    }, 3500);

    return () => {
      window.clearInterval(timer);
    };
  }, [sliderItems.length]);

  useEffect(() => {
    if (modalPhase !== "countdown") return;

    const timer = window.setTimeout(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setModalPhase("result");
          if (resultData?.lolos) {
            setConfettiSeed((seed) => seed + 1);
          }
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [countdown, modalPhase, resultData]);

  const confettiPieces = useMemo<ConfettiPiece[]>(() => {
    return Array.from({ length: 70 }, (_, index) => ({
      id: index,
      left: pseudoRandom(confettiSeed + 1, index + 1) * 100,
      delay: pseudoRandom(confettiSeed + 2, index + 3) * 0.45,
      duration: 1.8 + pseudoRandom(confettiSeed + 3, index + 5) * 1.7,
      rotate: Math.floor(pseudoRandom(confettiSeed + 4, index + 7) * 360),
      color: confettiColors[index % confettiColors.length],
    }));
  }, [confettiSeed]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const resetForRequest = () => {
    setModalMessage("");
    setResultData(null);
    setCountdown(5);
  };

  const buildWhatsAppLink = (action: "accept" | "decline") => {
    if (!resultData) return "#";

    const text =
      action === "accept"
        ? `Halo Kak, saya ${resultData.nama} (${resultData.nim}) dengan posisi ${resultData.posisi} menyatakan bersedia menerima amanah sebagai Asisten Laboratorium PRODIGI 2026. Terima kasih.`
        : `Halo Kak, saya ${resultData.nama} (${resultData.nim}) dengan posisi ${resultData.posisi} memutuskan mengundurkan diri dari Asisten Laboratorium PRODIGI 2026. Mohon maaf dan terima kasih.`;

    return `https://wa.me/${WA_TARGET}?text=${encodeURIComponent(text)}`;
  };

  const submitNim = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNim = nim.trim();

    if (!trimmedNim) {
      setIsModalOpen(true);
      setModalPhase("not-found");
      setModalMessage("Silakan isi NIM terlebih dahulu.");
      return;
    }

    setIsModalOpen(true);
    setModalPhase("loading");
    resetForRequest();

    try {
      const response = await fetch(
        `${ANNOUNCEMENT_API_URL}?nim=${encodeURIComponent(trimmedNim)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const payload = (await response.json()) as
        | AdmissionResultResponse
        | {
            status?: number;
            message?: string;
          };

      if (
        "nim" in payload &&
        "nama" in payload &&
        "posisi" in payload &&
        "lolos" in payload
      ) {
        setResultData(payload);
        setModalPhase("countdown");
        setCountdown(5);
        return;
      }

      const notFoundMessage =
        payload.message ??
        (payload.status === 404
          ? "NIM tidak ditemukan"
          : "Data NIM tidak tersedia.");

      setModalPhase("not-found");
      setModalMessage(notFoundMessage);
    } catch {
      setModalPhase("error");
      setModalMessage("Terjadi gangguan koneksi. Silakan coba lagi.");
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-14 md:px-8">
      <section className="overflow-hidden rounded-sm border border-black/10 bg-white">
        <div className="relative aspect-16/7 w-full bg-[#e8e8e8]">
          {sliderItems.map((item, index) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                activeSlide === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />
            </div>
          ))}

          <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ffcf37]">
              Asisten Laboratorium Prodigi
            </p>
            <h1 className="mt-2 max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl">
              Aslab Announcement 2026
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/85 md:text-base">
              Masukkan NIM kamu untuk melihat hasil seleksi Asisten Laboratorium
              PRODIGI 2026.
            </p>
          </div>

          <div className="absolute bottom-4 right-4 flex gap-2">
            {sliderItems.map((item, index) => (
              <button
                key={`dot-${item.id}`}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Slide ${index + 1}`}
                className={`h-2 w-2 rounded-full transition ${
                  activeSlide === index ? "w-8 bg-[#ffc91f]" : "bg-white/65"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 w-full rounded-sm border border-black/10 bg-white p-5 md:p-7">
        <h2 className="text-xl font-bold text-[#1a1a1a] md:text-2xl">
          Cek Kelolosan
        </h2>
        <p className="mt-2 text-sm text-black/65">
          Masukkan NIM yang terdaftar pada proses seleksi.
        </p>

        <form
          onSubmit={submitNim}
          className="mt-5 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            name="nim"
            value={nim}
            onChange={(event) => setNim(event.target.value)}
            placeholder="Contoh: 1302223007"
            className="w-full rounded-sm border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#ffb901]"
          />
          <button
            type="submit"
            className="rounded-sm bg-[#ffc91f] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#ffb901]"
          >
            Cek Sekarang
          </button>
        </form>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-90 flex items-center justify-center bg-black/55 px-4">
          {modalPhase === "result" && resultData?.lolos ? (
            <div className="pointer-events-none fixed inset-0 z-95 overflow-hidden">
              {confettiPieces.map((piece) => (
                <span
                  key={`${confettiSeed}-${piece.id}`}
                  className="admission-confetti"
                  style={{
                    left: `${piece.left}%`,
                    backgroundColor: piece.color,
                    animationDelay: `${piece.delay}s`,
                    animationDuration: `${piece.duration}s`,
                    transform: `rotate(${piece.rotate}deg)`,
                  }}
                />
              ))}
            </div>
          ) : null}

          <div className="relative w-full max-w-lg overflow-hidden rounded-sm bg-white shadow-[0_25px_70px_rgba(0,0,0,0.28)]">
            {modalPhase === "result" && resultData?.lolos ? (
              <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-linear-to-br from-[#fff9df] via-white to-[#eefcf3]">
                {confettiPieces.map((piece) => (
                  <span
                    key={`modal-${confettiSeed}-${piece.id}`}
                    className="admission-confetti-modal"
                    style={{
                      left: `${piece.left}%`,
                      backgroundColor: piece.color,
                      animationDelay: `${piece.delay}s`,
                      animationDuration: `${piece.duration + 0.8}s`,
                      transform: `rotate(${piece.rotate}deg)`,
                    }}
                  />
                ))}
              </div>
            ) : null}

            <div className="relative z-10 p-6 md:p-7">
              {modalPhase !== "loading" ? (
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute right-3 top-3 rounded-sm border border-black/10 px-2 py-1 text-xs text-black/60 transition hover:text-black"
                >
                  Tutup
                </button>
              ) : null}

              {modalPhase === "loading" ? (
                <div className="py-10 text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#ffc91f] border-t-transparent" />
                  <p className="mt-4 text-base font-semibold text-[#1a1a1a]">
                    Memeriksa data kelolosan...
                  </p>
                </div>
              ) : null}

              {modalPhase === "not-found" ? (
                <div className="py-4">
                  <p className="text-sm font-semibold uppercase tracking-widest text-[#f97316]">
                    Informasi
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-[#171717]">
                    Data Tidak Ditemukan
                  </h3>
                  <p className="mt-3 text-sm text-black/70">{modalMessage}</p>
                </div>
              ) : null}

              {modalPhase === "error" ? (
                <div className="py-4">
                  <p className="text-sm font-semibold uppercase tracking-widest text-red-600">
                    Error
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-[#171717]">
                    Request Gagal
                  </h3>
                  <p className="mt-3 text-sm text-black/70">{modalMessage}</p>
                </div>
              ) : null}

              {modalPhase === "countdown" && resultData ? (
                <div className="py-6 text-center">
                  <p className="text-sm font-semibold uppercase tracking-widest text-[#f58d1d]">
                    Bersiap
                  </p>
                  <h3 className="mt-2 text-3xl font-bold text-[#111]">
                    Menampilkan hasil dalam {countdown} detik
                  </h3>
                  <p className="mt-3 text-sm text-black/70">
                    Pengumuman akan ditampilkan sebentar lagi.
                  </p>
                </div>
              ) : null}

              {modalPhase === "result" && resultData?.lolos ? (
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-[#1d9c52]">
                    Selamat, Kamu Lolos
                  </p>
                  <h3 className="mt-2 text-3xl font-bold text-[#111]">
                    Asisten Laboratorium PRODIGI 2026
                  </h3>

                  <div className="mt-5 space-y-3 rounded-sm border border-black/10 bg-[#fafafa] p-4 text-sm">
                    <p>
                      <span className="font-semibold">NIM:</span>{" "}
                      {resultData.nim}
                    </p>
                    <p>
                      <span className="font-semibold">Nama:</span>{" "}
                      {resultData.nama}
                    </p>
                    <p>
                      <span className="font-semibold">Posisi:</span>{" "}
                      {resultData.posisi}
                    </p>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <Link
                      href={buildWhatsAppLink("accept")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-sm bg-[#1d9c52] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#15803d]"
                    >
                      Saya Menerima
                    </Link>
                    <Link
                      href={buildWhatsAppLink("decline")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-sm bg-[#dc2626] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#b91c1c]"
                    >
                      Saya Mengundurkan Diri
                    </Link>
                  </div>
                </div>
              ) : null}

              {modalPhase === "result" && resultData && !resultData.lolos ? (
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-[#d97706]">
                    Mohon Maaf
                  </p>
                  <h3 className="mt-2 text-3xl font-bold text-[#111]">
                    Kamu Belum Lolos Asisten Laboratorium PRODIGI 2026
                  </h3>

                  <div className="mt-5 space-y-3 rounded-sm border border-black/10 bg-[#fafafa] p-4 text-sm">
                    <p>
                      <span className="font-semibold">NIM:</span>{" "}
                      {resultData.nim}
                    </p>
                    <p>
                      <span className="font-semibold">Nama:</span>{" "}
                      {resultData.nama}
                    </p>
                    <p>
                      <span className="font-semibold">Posisi:</span>{" "}
                      {resultData.posisi}
                    </p>
                  </div>

                  <p className="mt-5 text-sm text-black/70">
                    Terima kasih atas partisipasimu. Tetap semangat dan terus
                    berkembang bersama PRODIGI.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .admission-confetti {
          position: absolute;
          top: -10%;
          width: 10px;
          height: 16px;
          opacity: 0;
          animation-name: confetti-fall;
          animation-timing-function: ease-in;
          animation-iteration-count: 1;
        }

        .admission-confetti-modal {
          position: absolute;
          top: -12%;
          width: 9px;
          height: 14px;
          opacity: 0;
          filter: saturate(1.1);
          animation-name: confetti-fall-modal;
          animation-timing-function: ease-in;
          animation-iteration-count: 1;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) rotate(700deg);
            opacity: 0;
          }
        }

        @keyframes confetti-fall-modal {
          0% {
            transform: translateY(-16px) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.55;
          }
          100% {
            transform: translateY(120%) rotate(620deg);
            opacity: 0;
          }
        }
      `}</style>
    </main>
  );
}
