/**
 * `template`'teki anahtarları `data`'dan (string ise) alır; eksik ya da
 * string olmayan alanlar template'teki varsayılan değerde kalır.
 *
 * Admin sayfaları SiteSettings'in yalnızca kendi alanlarını tutup PUT ile
 * gönderir. Böylece bir sayfanın kaydı, başka bir sayfada (ya da başka bir
 * sekmede) yapılmış değişiklikleri sayfa açıldığındaki eski değerlerle ezmez.
 */
export function pickFields<T extends { [K in keyof T]: string }>(data: unknown, template: T): T {
  const source = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  const result = { ...template };
  for (const key of Object.keys(template) as (keyof T & string)[]) {
    const value = source[key];
    if (typeof value === "string") result[key] = value as T[typeof key];
  }
  return result;
}
