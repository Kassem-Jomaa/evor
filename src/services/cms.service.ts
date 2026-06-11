import api from "@/services/api";
import { withFallback } from "@/services/with-fallback";
import { fallbackCms } from "@/config/fallback-data";
import type { CmsContent, HeroContent } from "@/types";

/**
 * CMS content service. The homepage hero is admin-editable (Tasks 3.1, 11.1),
 * so it is fetched from `GET /cms` and updated via `PATCH /cms`.
 */
export const cmsService = {
  getHomepage(): Promise<CmsContent> {
    return withFallback(
      "cms.getHomepage",
      async () => {
        const { data } = await api.get<CmsContent>("/cms");
        return data;
      },
      fallbackCms,
    );
  },

  /** Update the homepage hero content (Task 11.1, `PATCH /cms`). */
  updateHero(hero: HeroContent): Promise<CmsContent> {
    return withFallback(
      "cms.updateHero",
      async () => {
        const { data } = await api.patch<CmsContent>("/cms", { hero });
        return data;
      },
      () => ({ hero }),
    );
  },
};
