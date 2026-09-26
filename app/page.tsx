import { LibraryApp } from "@/components/library-app";
import { seedTools } from "@/lib/tools";

export default function Home() {
  return <LibraryApp initialTools={seedTools} />;
}
