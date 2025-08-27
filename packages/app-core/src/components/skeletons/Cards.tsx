import { Card, CardTitle, CardContent } from "..";

export function CardsSkeleton() {
  return [...Array(4)].map((_, index) => (
    <Card
      key={index}
      className="p-4 flex flex-col justify-between border-gray-200 animate-pulse"
    >
      <CardTitle className="bg-gray-200 h-4 w-3/4 rounded-md"></CardTitle>
      <CardContent className="p-0 flex items-end justify-between mt-2">
        <div>
          <div className="bg-gray-300 h-8 w-24 rounded-md"></div>
          <div className="bg-gray-200 h-4 w-1/2 rounded-md mt-1"></div>
        </div>
      </CardContent>
    </Card>
  ));
}
