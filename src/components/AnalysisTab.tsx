
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
  console.log('=== AnalysisTab Component Start ===');
  console.log('Props received:', { analysisData, analysisType, thresholds, dateRange });

  const { toast } = useToast();

  const handleDateRangeAnalysis = () => {
    console.log('Date range analysis requested with dateRange:', dateRange);
    
    if (!analysisData) {
      console.log('No analysis data available for date range filtering');
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

  console.log('About to check if analysisData exists...');
  
  if (!analysisData) {
    console.log('No analysis data, rendering empty state card');
    
    try {
      return (
        <div className="w-full h-full">
          <Card className="text-center py-12">
            <CardContent>
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Analysis Data</h3>
              <p className="text-gray-500">Please complete the setup and run analysis to view results.</p>
            </CardContent>
          </Card>
        </div>
      );
    } catch (error) {
      console.error('Error rendering empty state:', error);
      return <div className="p-4 text-red-500">Error rendering empty state: {String(error)}</div>;
    }
  }

  console.log('Analysis data exists, rendering full component with DataVisualization');

  try {
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
  } catch (error) {
    console.error('Error rendering AnalysisTab with data:', error);
    return (
      <div className="p-4 text-red-500">
        <h3>Error rendering analysis:</h3>
        <p>{String(error)}</p>
        <pre>{JSON.stringify(analysisData, null, 2)}</pre>
      </div>
    );
  }
};

export default AnalysisTab;
