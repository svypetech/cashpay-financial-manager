import Image from "next/image";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const generatePagination = () => {
    const pages: (number | "...")[] = [];
  
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const showLeft = currentPage > 4;
      const showRight = currentPage < totalPages - 3;
  
      // Always show first 3 pages
      pages.push(1, 2, 3);
  
      if (showLeft && currentPage !== 4) {
        pages.push("...");
      }
  
      // Show current page if not in first or last group
      if (currentPage > 3 && currentPage < totalPages - 2) {
        pages.push(currentPage);
      }
  
      if (showRight && currentPage !== totalPages - 3) {
        pages.push("...");
      }
  
      // Always show last 3 pages
      pages.push(totalPages - 2, totalPages - 1, totalPages);
    }
  
    // Remove duplicates and sort
    return [...new Set(pages.filter(p => typeof p === "number" ? p >= 1 && p <= totalPages : true))]
      .sort((a, b) => (typeof a === "number" && typeof b === "number" ? a - b : 0));
  };

  return (
    <section className="sm:px-8" >
      <div className="grid grid-cols-2 gap-x-4 sm:gap-x-10 md:gap-x-20 lg:gap-x-0 lg:flex items-center justify-between md:px-6 py-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 border-2 border-primary font-bold rounded-lg text-primary bg-white hover:bg-gray-50 disabled:opacity-50 cursor-pointer text-xs sm:text-sm md:text-base"
        >
          <Image 
            src="/icons/arrow-left.svg" 
            alt="Arrow left" 
            width={16} 
            height={16} 
            className="sm:w-5 sm:h-5 md:w-6 md:h-6"
          />
          <span className="hidden xs:inline sm:inline">Previous</span>
          <span className="xs:hidden sm:hidden">Prev</span>
        </button>

        <div className="flex mt-4 sm:mt-5 lg:mt-0 justify-center items-center gap-1 col-span-2 order-1 lg:order-none">
          {generatePagination().map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="px-1 font-bold text-xs sm:text-sm md:text-base">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(Number(page))}
                className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full font-semibold font-[satoshi] text-xs sm:text-sm md:text-base ${
                  currentPage === page
                    ? "bg-secondary/10 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 border-2 border-primary font-bold rounded-lg text-primary bg-white hover:bg-gray-50 disabled:opacity-50 cursor-pointer text-xs sm:text-sm md:text-base"
        >
          <span className="hidden xs:inline sm:inline">Next</span>
          <span className="xs:hidden sm:hidden">Next</span>
          <Image 
            src="/icons/arrow-right.svg" 
            alt="Arrow right" 
            width={16} 
            height={16} 
            className="sm:w-5 sm:h-5 md:w-6 md:h-6"
          />
        </button>
      </div>
    </section>
  );
}