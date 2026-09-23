/**
 * Sayfa boyunca akan ince, kavisli dekoratif çizgi — referans tasarımdaki
 * gibi başlıkların arkasından geçip aşağı doğru bölümler arasında devam eder.
 * Tek bir uzun SVG olduğu için scroll sırasında "takip eden" bir çizgi hissi
 * verir; kart/metin içeriğinin arkasında kalması için negatif z-index kullanır.
 */
export function DecorativeLine() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-1 top-0 -z-10 h-full w-24 md:left-4"
      viewBox="0 0 100 2000"
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d="M75 0 C 20 140, 95 280, 35 440 S 15 640, 80 820 S 90 1040, 25 1220 S 10 1460, 78 1640 S 88 1860, 30 2000"
        stroke="var(--color-border-hover)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
