import { getRundschreibenTree, findLatestPdf } from "@/lib/pdfScanner";
import RundschreibenViewer from "@/components/RundschreibenViewer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// Opt into dynamic server rendering so new files pushed to public/ are immediately picked up
export const dynamic = "force-dynamic";

export default async function RundschreibenPage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;

  // Protect this page from users who are not logged in or do not have the correct role.
  const allowedRoles = ["ADMIN", "VORSTAND", "MEMBER"];
  if (!session || !userRole || !allowedRoles.includes(userRole)) {
    redirect("/");
  }

  // Read folder structure from filesystem
  const tree = getRundschreibenTree();

  // Get the latest file (first file found in sorted tree)
  const defaultSelectedPdf = findLatestPdf(tree);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-slate-900 text-white px-6 py-4 shadow-md flex-shrink-0">
        <h1 className="text-xl font-bold">Monatliche Rundschreiben</h1>
      </header>

      <RundschreibenViewer tree={tree} defaultSelectedPdf={defaultSelectedPdf} />
    </div>
  );
}