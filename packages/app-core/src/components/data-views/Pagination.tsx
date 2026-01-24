import { useLocale, useTranslations } from "next-intl";
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
  currentPage: number | undefined;
  totalPages: number;
  setPagination: React.Dispatch<React.SetStateAction<TPagination>>;
}

export function PagePagination({
  currentPage,
  totalPages,
  setPagination,
}: PaginationProps) {
  const safeCurrentPage = Math.max(
    1,
    Math.min(currentPage as number, totalPages || 1),
  );

  const locale = useLocale();

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
    <Pagination
      className={`mx-0 mt-2 ${locale === "ar" ? "justify-start" : "justify-end"} `}
    >
      {" "}
      {/* Align to end */}
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            onClick={() =>
              onPageChange(
                locale === "ar" ? safeCurrentPage + 1 : safeCurrentPage - 1,
              )
            }
            disabled={
              locale === "ar"
                ? safeCurrentPage >= totalPages
                : safeCurrentPage <= 1
            }
            className="mx-1 px-0"
          >
            <PaginationPrevious />
          </Button>
        </PaginationItem>

        <div className={`flex ${locale === "ar" && "flex-row-reverse"}`}>
          {" "}
          {/* Start ellipsis */}
          {pageNumbers[0] > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(1)}>
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
                isActive={page === safeCurrentPage}
                onClick={() => onPageChange(page)}
                className={`${
                  page === safeCurrentPage
                    ? "pointer-events-none"
                    : "cursor-pointer"
                }`}
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
                <PaginationLink onClick={() => onPageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
        </div>

        <PaginationItem>
          <Button
            variant="ghost"
            onClick={() =>
              onPageChange(
                locale === "ar" ? safeCurrentPage - 1 : safeCurrentPage + 1,
              )
            }
            disabled={
              locale === "ar"
                ? safeCurrentPage <= 1
                : safeCurrentPage >= totalPages
            }
            className="mx-1 px-0"
          >
            <PaginationNext />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
