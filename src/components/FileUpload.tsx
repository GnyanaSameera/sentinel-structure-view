
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FileUpload = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const allowedTypes = ['.csv', '.json', '.xls', '.xlsx', '.zip'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload CSV, JSON, XLS, or ZIP files only.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast({
        title: "File Too Large",
        description: "File size must be less than 50MB.",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);
    onFileUpload(file);
    
    toast({
      title: "File Uploaded",
      description: `${file.name} has been uploaded successfully.`,
    });
  };

  const removeFile = () => {
    setUploadedFile(null);
    onFileUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {!uploadedFile ? (
        <Card 
          className={`border-2 border-dashed transition-all duration-300 hover:shadow-md ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className={`transition-all duration-300 ${dragActive ? 'scale-110' : ''}`}>
              <Upload className={`h-12 w-12 mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            </div>
            
            <h3 className="text-lg font-semibold mb-2">Upload Sensor Data</h3>
            <p className="text-gray-500 mb-4">
              Drag and drop your files here, or click to browse
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Supported formats: CSV, JSON, XLS, ZIP (Max: 50MB)
            </p>
            
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
            >
              Choose File
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,.xls,.xlsx,.zip"
              onChange={handleChange}
              className="hidden"
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200 bg-green-50 animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-800">{uploadedFile.name}</h4>
                  <p className="text-sm text-green-600">
                    {formatFileSize(uploadedFile.size)} • Uploaded successfully
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-green-600 hover:text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;
