import { PageHeader } from "@/components/admin/page-header";
import { CmsHeroForm } from "@/components/admin/cms-hero-form";
import { cmsService } from "@/services/cms.service";

export const dynamic = "force-dynamic";

export default async function AdminCmsPage() {
  const cms = await cmsService.getHomepage();

  return (
    <div>
      <PageHeader
        title="Homepage"
        description="Edit the homepage hero shown to customers."
      />
      <CmsHeroForm hero={cms.hero} />
    </div>
  );
}
