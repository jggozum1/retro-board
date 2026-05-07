export default function RoomLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="flex items-center justify-between px-4 py-3 bg-bg-secondary border-b border-border">
        <div className="space-y-2">
          <div className="h-5 w-40 bg-bg-elevated rounded animate-pulse" />
          <div className="h-3 w-24 bg-bg-elevated rounded animate-pulse" />
        </div>
        <div className="h-8 w-28 bg-bg-elevated rounded animate-pulse" />
      </div>
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-bg-secondary border border-border rounded-lg p-3 space-y-3">
            <div className="h-5 w-32 bg-bg-elevated rounded animate-pulse" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-16 bg-bg-elevated rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
