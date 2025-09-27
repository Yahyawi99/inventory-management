import { Card, CardContent, PagePagination, TableSkeleton } from "..";
import { Data, Pagination } from "../../types";

interface DataTableProps {
  data: Data[];
  isFetchingData: boolean;
  currentPage: number | undefined;
  totalPages: number;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
  children: React.ReactNode;
}

export function TableView({
  data,
  isFetchingData,
  currentPage,
  totalPages,
  setPagination,
  children,
}: DataTableProps) {
  return (
    <Card className="w-full mx-auto rounded-lg shadow-lg border border-gray-200">
      <CardContent className="p-0">
        {!isFetchingData ? (
          data.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p>No records found for this organization.</p>
            </div>
          ) : (
            <>
              {children}

              <PagePagination
                currentPage={currentPage}
                totalPages={totalPages}
                setPagination={setPagination}
              />
            </>
          )
        ) : (
          <TableSkeleton />
        )}
      </CardContent>
    </Card>
  );
}
