import FilterBar from "../FilterBar";

export default function FilterBarExample() {
  return (
    <div className="p-6">
      <FilterBar
        onFilterChange={(filters) => console.log("Filters changed:", filters)}
        onExport={() => console.log("Export clicked")}
      />
    </div>
  );
}
