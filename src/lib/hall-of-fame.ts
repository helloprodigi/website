export type HallOfFameEntry = {
  id: number;
  title: string;
  competition: string;
  image: string;
};

export const HALL_OF_FAME_YEARS = ["2024"] as const;

export type HallOfFameYear = (typeof HALL_OF_FAME_YEARS)[number];

export const HALL_OF_FAME_BY_YEAR: Record<HallOfFameYear, HallOfFameEntry[]> = {
  "2024": [
    {
      id: 1,
      title: "Juara 1",
      competition: "Big Data Challenge Satria Data 2024",
      image: "/images/hof/8.png",
    },
    {
      id: 2,
      title: "Juara 1",
      competition:
        "Inovasi Teknologi Digital Pendidikan Lomba Inovasi Digital Mahasiswa 2024",
      image: "/images/hof/9.png",
    },
    {
      id: 3,
      title: "Juara 2",
      competition: "Pengembangan Perangkat Lunak Gemastik 2024",
      image: "/images/hof/10.png",
    },
    {
      id: 4,
      title: "Juara 3",
      competition: "Penambangan Data Gemastik 2024",
      image: "/images/hof/11.png",
    },
    {
      id: 5,
      title: "Juara 3",
      competition:
        "Inovasi Teknologi Digital Pendidikan Lomba Inovasi Digital Mahasiswa 2024",
      image: "/images/hof/12.png",
    },
    {
      id: 6,
      title: "Juara Harapan",
      competition: "Bidang Budidaya P2MW",
      image: "/images/hof/13.png",
    },
    {
      id: 7,
      title: "Juara Harapan",
      competition: "Bidang SmartCity Gemastik 2024",
      image: "/images/hof/14.png",
    },
  ],
};
