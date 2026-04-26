export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 w-32 bg-ash/20 rounded" />
      <div className="h-8 w-48 bg-ash/20 rounded" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-ash/10 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}