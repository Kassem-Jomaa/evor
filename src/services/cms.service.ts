import api from "@/services/api";
import { withFallback } from "@/services/with-fallback";
import {
  heroToBannerPayload,
  mapBannerToHero,
  type ApiBanner,
} from "@/services/mappers";
import { fallbackCms } from "@/config/fallback-data";
import type { CmsContent, HeroContent } from "@/types";

/** Pick the banner the storefront hero should show: first active, by order. */
function pickHeroBanner(banners: ApiBanner[]): ApiBanner | undefined {
  return [...banners]
    .filter((banner) => banner.isActive)
    .sort((a, b) => a.order - b.order)[0];
}

/**
 * CMS content service. The backend models homepage content as *banners*
 * (`GET /cms` → `{ banners, settings }`); the storefront hero is the first
 * active banner. Editing the hero (Task 11.1) updates that banner — or creates
 * it the first time.
 */
export const cmsService = {
  getHomepage(): Promise<CmsContent> {
    return withFallback(
      "cms.getHomepage",
      async () => {
        const { data } = await api.get<{ banners: ApiBanner[] }>("/cms");
        const banner = pickHeroBanner(data.banners ?? []);
        // No banner configured yet → show the default hero copy.
        return { hero: banner ? mapBannerToHero(banner) : fallbackCms.hero };
      },
      fallbackCms,
    );
  },

  /**
   * Update the homepage hero (Task 11.1). Patches the active banner via
   * `PATCH /cms/banners/:id`, or creates one via `POST /cms/banners` when the
   * store has none yet. Errors surface to the admin form.
   */
  async updateHero(hero: HeroContent): Promise<CmsContent> {
    const { data } = await api.get<{ banners: ApiBanner[] }>("/cms");
    const existing = pickHeroBanner(data.banners ?? []);
    const payload = heroToBannerPayload(hero);

    const { data: saved } = existing
      ? await api.patch<ApiBanner>(`/cms/banners/${existing.id}`, payload)
      : await api.post<ApiBanner>("/cms/banners", payload);

    return { hero: mapBannerToHero(saved) };
  },
};
