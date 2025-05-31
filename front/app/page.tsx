'use client'
import DataTable from "@/components/utils/data-table";

export default function Home() {

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

      <p className=" dark:bg-white/[.06] px-1 py-0.5 rounded text-xl font-[family-name:var(--font-geist-mono)] font-semibold">
        Application de gestion Des Produits
      </p>
      <DataTable />
    </div>
  );
}
