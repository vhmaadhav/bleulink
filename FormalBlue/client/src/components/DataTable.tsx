import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export interface ReadingData {
  id: string;
  machineId: string;
  timestamp: string;
  rawLevel: number;
  mixedLevel: number;
  flowRate: number;
  mixRatio: number;
}

interface DataTableProps {
  title: string;
  data: ReadingData[];
  rowsPerPage?: number;
}

export default function DataTable({ title, data, rowsPerPage = 10 }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Card data-testid="card-data-table">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Machine ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Raw Level (%)</TableHead>
                <TableHead className="text-right">Mixed Level (%)</TableHead>
                <TableHead className="text-right">Flow Rate (L/h)</TableHead>
                <TableHead className="text-right">Mix Ratio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((reading, index) => (
                <TableRow key={reading.id} data-testid={`row-reading-${index}`}>
                  <TableCell className="font-mono font-medium">{reading.machineId}</TableCell>
                  <TableCell className="text-muted-foreground">{reading.timestamp}</TableCell>
                  <TableCell className="text-right font-mono">{reading.rawLevel.toFixed(1)}</TableCell>
                  <TableCell className="text-right font-mono">{reading.mixedLevel.toFixed(1)}</TableCell>
                  <TableCell className="text-right font-mono">{reading.flowRate.toFixed(1)}</TableCell>
                  <TableCell className="text-right font-mono">1:{reading.mixRatio.toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(currentPage * rowsPerPage, data.length)} of {data.length} readings
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              data-testid="button-next-page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
