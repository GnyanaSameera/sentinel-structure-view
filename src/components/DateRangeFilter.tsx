
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X, Play } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const DateRangeFilter = ({ dateRange, onDateRangeChange, onRunAnalysis }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const clearDateRange = () => {
    onDateRangeChange(null);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal w-full",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      
      {dateRange && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDateRange}
            className="h-9 w-9 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={onRunAnalysis}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            Run Analysis
          </Button>
        </>
      )}
    </div>
  );
};

export default DateRangeFilter;
