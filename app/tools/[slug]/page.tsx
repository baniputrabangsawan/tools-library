import { ToolDetail } from "@/components/tool-detail";
import { seedTools } from "@/lib/tools";

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ToolDetail slug={slug} initialTool={seedTools.find((tool) => tool.slug === slug)} />;
}
