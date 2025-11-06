export function TableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-5 gap-4 p-4 text-left font-medium text-foreground border-b border-border">
        <div className="h-4 bg-muted rounded-md w-3/4"></div>
        <div className="h-4 bg-muted rounded-md w-1/2"></div>
        <div className="h-4 bg-muted rounded-md w-1/2"></div>
        <div className="h-4 bg-muted rounded-md w-1/3"></div>
        <div className="h-4 bg-muted rounded-md w-1/3"></div>
      </div>

      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-4 gap-4 p-4 border-b border-border"
        >
          <div className="h-4 bg-muted rounded-md w-3/4"></div>
          <div className="h-4 bg-muted rounded-md w-1/2"></div>
          <div className="h-4 bg-muted rounded-md w-1/2"></div>
          <div className="h-4 bg-muted rounded-md w-1/3"></div>
        </div>
      ))}
    </div>
  );
}
