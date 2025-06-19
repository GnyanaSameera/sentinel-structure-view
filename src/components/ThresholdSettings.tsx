
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Settings, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ThresholdSettings = ({ thresholds, onThresholdsChange }) => {
  const { toast } = useToast();
  const [localThresholds, setLocalThresholds] = React.useState(thresholds);

  React.useEffect(() => {
    setLocalThresholds(thresholds);
  }, [thresholds]);

  const handleThresholdChange = (type, field, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setLocalThresholds(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          [field]: numValue
        }
      }));
    }
  };

  const saveThresholds = () => {
    onThresholdsChange(localThresholds);
    toast({
      title: "Thresholds Updated",
      description: "New threshold values have been saved successfully.",
    });
  };

  const resetToDefaults = () => {
    const defaultThresholds = {
      strain: { min: -100, max: 100 },
      temperature: { min: -10, max: 50 }
    };
    setLocalThresholds(defaultThresholds);
    onThresholdsChange(defaultThresholds);
    toast({
      title: "Thresholds Reset",
      description: "Threshold values have been reset to defaults.",
    });
  };

  const isThresholdExceeded = (value, threshold) => {
    return value < threshold.min || value > threshold.max;
  };

  const getThresholdStatus = (type) => {
    const threshold = localThresholds[type];
    if (threshold.min >= threshold.max) {
      return { status: 'error', message: 'Min value must be less than max value' };
    }
    return { status: 'ok', message: 'Valid range' };
  };

  return (
    <div className="space-y-6">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Threshold Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Strain Thresholds */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Strain Thresholds (με)</Label>
              <Badge variant={getThresholdStatus('strain').status === 'ok' ? 'default' : 'destructive'}>
                {getThresholdStatus('strain').message}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="strain-min">Minimum Value</Label>
                <Input
                  id="strain-min"
                  type="number"
                  value={localThresholds.strain.min}
                  onChange={(e) => handleThresholdChange('strain', 'min', e.target.value)}
                  className="text-center"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="strain-max">Maximum Value</Label>
                <Input
                  id="strain-max"
                  type="number"
                  value={localThresholds.strain.max}
                  onChange={(e) => handleThresholdChange('strain', 'max', e.target.value)}
                  className="text-center"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Current Range: {localThresholds.strain.min} με to {localThresholds.strain.max} με
              </p>
            </div>
          </div>

          {/* Temperature Thresholds */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Temperature Thresholds (°C)</Label>
              <Badge variant={getThresholdStatus('temperature').status === 'ok' ? 'default' : 'destructive'}>
                {getThresholdStatus('temperature').message}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temp-min">Minimum Value</Label>
                <Input
                  id="temp-min"
                  type="number"
                  value={localThresholds.temperature.min}
                  onChange={(e) => handleThresholdChange('temperature', 'min', e.target.value)}
                  className="text-center"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temp-max">Maximum Value</Label>
                <Input
                  id="temp-max"
                  type="number"
                  value={localThresholds.temperature.max}
                  onChange={(e) => handleThresholdChange('temperature', 'max', e.target.value)}
                  className="text-center"
                />
              </div>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                Current Range: {localThresholds.temperature.min}°C to {localThresholds.temperature.max}°C
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button 
              onClick={saveThresholds}
              className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Thresholds
            </Button>
            <Button 
              onClick={resetToDefaults}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alert Simulation */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Alert Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              Preview how alerts will appear when sensor values exceed thresholds:
            </p>
            
            {/* Example Strain Alert */}
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg animate-pulse">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">Strain Alert - Sensor S004</p>
                <p className="text-xs text-red-600">
                  Value: 110 με (Exceeds max threshold: {localThresholds.strain.max} με)
                </p>
              </div>
            </div>

            {/* Example Temperature Alert */}
            <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg animate-pulse">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-800">Temperature Alert - Sensor S003</p>
                <p className="text-xs text-orange-600">
                  Value: 55°C (Exceeds max threshold: {localThresholds.temperature.max}°C)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThresholdSettings;
