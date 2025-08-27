import {
  Button,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "..";
import { Pagination as TPagination } from "../../types";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setPagination: React.Dispatch<React.SetStateAction<TPagination>>;
}

export function PagePagination({
  currentPage,
  totalPages,
  setPagination,
}: PaginationProps) {
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      startPage = Math.max(1, safeCurrentPage - Math.floor(maxPagesToShow / 2));
      endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const onPageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  return (
    <Pagination className="mx-0 justify-end mt-2">
      {" "}
      {/* Align to end */}
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            onClick={() => onPageChange(safeCurrentPage - 1)}
            disabled={safeCurrentPage <= 1}
            className="px-2"
          >
            <PaginationPrevious href="#" />
          </Button>
        </PaginationItem>

        {/* Start ellipsis */}
        {pageNumbers[0] > 1 && (
          <>
            <PaginationItem>
              <PaginationLink href="#" onClick={() => onPageChange(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            {pageNumbers[0] > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {/* Page numbers */}
        {pageNumbers.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={page === safeCurrentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* End ellipsis */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href="#" onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <Button
            variant="ghost"
            onClick={() => onPageChange(safeCurrentPage + 1)}
            disabled={safeCurrentPage >= totalPages}
            className="px-2"
          >
            <PaginationNext href="#" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
