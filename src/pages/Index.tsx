
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Activity, MapPin, Upload, BarChart3, Settings } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import StructureSelector from '@/components/StructureSelector';
import LocationSelector from '@/components/LocationSelector';
import DataVisualization from '@/components/DataVisualization';
import ThresholdSettings from '@/components/ThresholdSettings';
import DateRangeFilter from '@/components/DateRangeFilter';
import { useToast } from '@/hooks/use-toast';

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
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Structural Monitoring Interface
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time sensor data analysis platform for infrastructure monitoring
          </p>
          
          {getAlertCount() > 0 && (
            <div className="flex items-center justify-center gap-2 animate-pulse">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <Badge variant="destructive" className="animate-bounce">
                {getAlertCount()} Active Alert{getAlertCount() > 1 ? 's' : ''}
              </Badge>
            </div>
          )}
        </div>

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

          <TabsContent value="setup" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* File Upload */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-600" />
                    File Upload
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload onFileUpload={setUploadedFile} />
                </CardContent>
              </Card>

              {/* Structure & Location */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Structure & Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <StructureSelector 
                    value={selectedStructure}
                    onChange={setSelectedStructure}
                  />
                  <LocationSelector 
                    onLocationSelect={setSelectedLocation}
                    selectedLocation={selectedLocation}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Analysis Controls */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant={uploadedFile ? "default" : "secondary"}>
                      File: {uploadedFile ? "✓" : "✗"}
                    </Badge>
                    <Badge variant={selectedStructure ? "default" : "secondary"}>
                      Structure: {selectedStructure ? "✓" : "✗"}
                    </Badge>
                    <Badge variant={selectedLocation ? "default" : "secondary"}>
                      Location: {selectedLocation ? "✓" : "✗"}
                    </Badge>
                  </div>
                  
                  <Button 
                    onClick={runAnalysis}
                    disabled={!uploadedFile || !selectedStructure || !selectedLocation || isAnalyzing}
                    className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Analyzing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Run Analysis
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {analysisData ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                  <DateRangeFilter 
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                  />
                </div>
                <DataVisualization 
                  data={analysisData}
                  analysisType={analysisType}
                  onAnalysisTypeChange={setAnalysisType}
                  thresholds={thresholds}
                  dateRange={dateRange}
                />
              </>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Analysis Data</h3>
                  <p className="text-gray-500">Please complete the setup and run analysis to view results.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <ThresholdSettings 
              thresholds={thresholds}
              onThresholdsChange={setThresholds}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
