
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, MapPin } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import StructureSelector from '@/components/StructureSelector';
import LocationSelector from '@/components/LocationSelector';
import AnalysisControls from '@/components/AnalysisControls';

interface SetupTabProps {
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  selectedStructure: string;
  setSelectedStructure: (structure: string) => void;
  selectedLocation: any;
  setSelectedLocation: (location: any) => void;
  isAnalyzing: boolean;
  onRunAnalysis: () => void;
}

const SetupTab = ({
  uploadedFile,
  setUploadedFile,
  selectedStructure,
  setSelectedStructure,
  selectedLocation,
  setSelectedLocation,
  isAnalyzing,
  onRunAnalysis
}: SetupTabProps) => {
  return (
    <div className="space-y-6">
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
      <AnalysisControls
        uploadedFile={uploadedFile}
        selectedStructure={selectedStructure}
        selectedLocation={selectedLocation}
        isAnalyzing={isAnalyzing}
        onRunAnalysis={onRunAnalysis}
      />
    </div>
  );
};

export default SetupTab;
