import { getSiteSettings } from "@/lib/content";
import { fullName, tidy } from "@/lib/site";
import { Nav } from "./Nav";

/** Nav client component'ine sitenin sahibinin adını sunucudan geçirir. */
export async function SiteHeader() {
  const settings = await getSiteSettings();
  return <Nav name={fullName(settings)} roleTitle={tidy(settings.roleTitle)} />;
}
