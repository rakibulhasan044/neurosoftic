"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface PaginationClientProps {
  currentPage: number;
  totalPages: number;
}

export function PaginationClient({ currentPage, totalPages }: PaginationClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  };

  return (
    <div className="mt-8">
      <PaginationControls 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </div>
  );
}
