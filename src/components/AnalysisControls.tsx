
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';

interface AnalysisControlsProps {
  uploadedFile: File | null;
  selectedStructure: string;
  selectedLocation: any;
  isAnalyzing: boolean;
  onRunAnalysis: () => void;
}

const AnalysisControls = ({ 
  uploadedFile, 
  selectedStructure, 
  selectedLocation, 
  isAnalyzing, 
  onRunAnalysis 
}: AnalysisControlsProps) => {
  return (
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
            onClick={onRunAnalysis}
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
  );
};

export default AnalysisControls;
