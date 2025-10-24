import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Download } from "lucide-react";
import { useState } from "react";

interface FilterBarProps {
  onFilterChange?: (filters: {
    search: string;
    status: string;
    shift: string;
  }) => void;
  onExport?: () => void;
}

export default function FilterBar({ onFilterChange, onExport }: FilterBarProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [shift, setShift] = useState("all");

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = {
      search: key === "search" ? value : search,
      status: key === "status" ? value : status,
      shift: key === "shift" ? value : shift,
    };

    if (key === "search") setSearch(value);
    if (key === "status") setStatus(value);
    if (key === "shift") setShift(value);

    onFilterChange?.(newFilters);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card border rounded-md">
      <div className="flex-1 min-w-64">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by machine ID..."
            className="pl-9"
            value={search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            data-testid="input-filter-search"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={status} onValueChange={(value) => handleFilterChange("status", value)}>
          <SelectTrigger className="w-40" data-testid="select-filter-status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>

        <Select value={shift} onValueChange={(value) => handleFilterChange("shift", value)}>
          <SelectTrigger className="w-40" data-testid="select-filter-shift">
            <SelectValue placeholder="Shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shifts</SelectItem>
            <SelectItem value="morning">Morning</SelectItem>
            <SelectItem value="afternoon">Afternoon</SelectItem>
            <SelectItem value="night">Night</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={onExport}
          data-testid="button-export"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
