import { InteractiveTool } from '@/components/InteractiveTool';
import SeoContent from '@/components/SeoContent';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  return (
    <>
      <InteractiveTool />
      <div className="w-full bg-surface">
        <div className="max-w-[1920px] mx-auto px-space-md md:px-space-lg lg:px-8 xl:px-12">
          <SeoContent lang={lang} />
        </div>
      </div>
    </>
  );
}
