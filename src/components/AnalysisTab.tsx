
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import DataVisualization from '@/components/DataVisualization';
import DateRangeFilter from '@/components/DateRangeFilter';
import { useToast } from '@/hooks/use-toast';

interface AnalysisTabProps {
  analysisData: any;
  analysisType: string;
  setAnalysisType: (type: string) => void;
  thresholds: any;
  dateRange: any;
  setDateRange: (range: any) => void;
}

const AnalysisTab = ({
  analysisData,
  analysisType,
  setAnalysisType,
  thresholds,
  dateRange,
  setDateRange
}: AnalysisTabProps) => {
  const { toast } = useToast();

  const handleDateRangeAnalysis = () => {
    if (!analysisData) {
      toast({
        title: "No Data Available",
        description: "Please run the initial analysis first before filtering by date.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Analysis Updated",
      description: `Data filtered for selected date range: ${dateRange?.from ? format(dateRange.from, 'MMM dd, yyyy') : ''} - ${dateRange?.to ? format(dateRange.to, 'MMM dd, yyyy') : ''}`,
    });
  };

  if (!analysisData) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Analysis Data</h3>
          <p className="text-gray-500">Please complete the setup and run analysis to view results.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <DateRangeFilter 
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onRunAnalysis={handleDateRangeAnalysis}
        />
      </div>
      <DataVisualization 
        data={analysisData}
        analysisType={analysisType}
        onAnalysisTypeChange={setAnalysisType}
        thresholds={thresholds}
        dateRange={dateRange}
      />
    </div>
  );
};

export default AnalysisTab;
