import { useTranslations } from "next-intl";
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
  const t = useTranslations("users_roles_page");

  return (
    <Card className="w-full mx-auto rounded-lg shadow-md shadow-accent border border-border">
      <CardContent className="p-0">
        {!isFetchingData ? (
          data.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <p>{t("messages.no_record")}</p>
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
