import { ToolDetail } from "@/components/tool-detail";

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ToolDetail slug={slug} />;
}
