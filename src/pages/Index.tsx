
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, BarChart3, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AlertHeader from '@/components/AlertHeader';
import SetupTab from '@/components/SetupTab';
import AnalysisTab from '@/components/AnalysisTab';
import SettingsTab from '@/components/SettingsTab';

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedStructure, setSelectedStructure] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisType, setAnalysisType] = useState('both');
  const [dateRange, setDateRange] = useState(null);
  const [thresholds, setThresholds] = useState({
    strain: { min: -100, max: 100 },
    temperature: { min: -10, max: 50 }
  });
  const { toast } = useToast();

  const runAnalysis = async () => {
    if (!uploadedFile || !selectedStructure || !selectedLocation) {
      toast({
        title: "Missing Requirements",
        description: "Please upload a file, select structure type, and choose location.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      // Mock sensor data for demonstration
      const mockData = {
        sensors: [
          { id: 'S001', name: 'Strain Sensor 1', strain: 85, temperature: 22.5, location: 'North Tower' },
          { id: 'S002', name: 'Strain Sensor 2', strain: -45, temperature: 21.8, location: 'South Tower' },
          { id: 'S003', name: 'Temperature Sensor 1', strain: 12, temperature: 45.2, location: 'Bridge Deck' },
          { id: 'S004', name: 'Strain Sensor 3', strain: 110, temperature: 23.1, location: 'Central Span' },
          { id: 'S005', name: 'Combined Sensor 1', strain: -78, temperature: 19.5, location: 'Support Pier' }
        ],
        timeSeriesData: generateTimeSeriesData(),
        alerts: [
          { type: 'strain', sensor: 'S004', value: 110, threshold: 100, severity: 'high' },
          { type: 'temperature', sensor: 'S003', value: 45.2, threshold: 40, severity: 'medium' }
        ]
      };
      
      setAnalysisData(mockData);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: "Sensor data has been processed successfully.",
      });
    }, 3000);
  };

  const generateTimeSeriesData = () => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 100; i++) {
      const time = new Date(now.getTime() - (100 - i) * 60000);
      data.push({
        time: time.toISOString(),
        strain1: 50 + Math.sin(i * 0.1) * 30 + (Math.random() - 0.5) * 10,
        strain2: -20 + Math.cos(i * 0.15) * 25 + (Math.random() - 0.5) * 8,
        strain3: 80 + Math.sin(i * 0.08) * 40 + (Math.random() - 0.5) * 12,
        temp1: 20 + Math.sin(i * 0.05) * 5 + (Math.random() - 0.5) * 2,
        temp2: 25 + Math.cos(i * 0.07) * 8 + (Math.random() - 0.5) * 3,
        temp3: 22 + Math.sin(i * 0.12) * 6 + (Math.random() - 0.5) * 2.5
      });
    }
    return data;
  };

  const getAlertCount = () => {
    if (!analysisData) return 0;
    return analysisData.alerts.length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <AlertHeader alertCount={getAlertCount()} />

        {/* Main Content */}
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Setup
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup">
            <SetupTab
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              selectedStructure={selectedStructure}
              setSelectedStructure={setSelectedStructure}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              isAnalyzing={isAnalyzing}
              onRunAnalysis={runAnalysis}
            />
          </TabsContent>

          <TabsContent value="analysis">
            <AnalysisTab
              analysisData={analysisData}
              analysisType={analysisType}
              setAnalysisType={setAnalysisType}
              thresholds={thresholds}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab
              thresholds={thresholds}
              setThresholds={setThresholds}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
