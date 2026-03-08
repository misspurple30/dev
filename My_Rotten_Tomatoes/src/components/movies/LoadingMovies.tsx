export default function LoadingMovies() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="bg-[#181818] rounded-sm overflow-hidden">
          <div className="skeleton h-[280px] w-full" />
          <div className="p-3 space-y-2">
            <div className="skeleton h-3 w-3/4 rounded" />
            <div className="skeleton h-2 w-full rounded" />
            <div className="skeleton h-2 w-2/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
