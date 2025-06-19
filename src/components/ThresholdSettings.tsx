
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, AlertTriangle, Activity, Thermometer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ThresholdSettings = ({ thresholds, onThresholdsChange }) => {
  const { toast } = useToast();

  const updateThreshold = (type, limit, value) => {
    const newThresholds = {
      ...thresholds,
      [type]: {
        ...thresholds[type],
        [limit]: parseFloat(value) || 0
      }
    };
    onThresholdsChange(newThresholds);
  };

  const resetToDefaults = () => {
    const defaultThresholds = {
      strain: { min: -100, max: 100 },
      temperature: { min: -10, max: 50 }
    };
    onThresholdsChange(defaultThresholds);
    toast({
      title: "Thresholds Reset",
      description: "Alert thresholds have been reset to default values.",
    });
  };

  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Threshold settings have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Threshold Settings
        </h2>
        <Button onClick={resetToDefaults} variant="outline">
          Reset to Defaults
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strain Thresholds */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Activity className="h-5 w-5" />
              Strain Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="strain-min">Minimum (με)</Label>
                <Input
                  id="strain-min"
                  type="number"
                  value={thresholds.strain.min}
                  onChange={(e) => updateThreshold('strain', 'min', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="strain-max">Maximum (με)</Label>
                <Input
                  id="strain-max"
                  type="number"
                  value={thresholds.strain.max}
                  onChange={(e) => updateThreshold('strain', 'max', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 mb-2">Current Range:</p>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-white">
                  Min: {thresholds.strain.min} με
                </Badge>
                <Badge variant="outline" className="bg-white">
                  Max: {thresholds.strain.max} με
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temperature Thresholds */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Thermometer className="h-5 w-5" />
              Temperature Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="temp-min">Minimum (°C)</Label>
                <Input
                  id="temp-min"
                  type="number"
                  value={thresholds.temperature.min}
                  onChange={(e) => updateThreshold('temperature', 'min', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="temp-max">Maximum (°C)</Label>
                <Input
                  id="temp-max"
                  type="number"
                  value={thresholds.temperature.max}
                  onChange={(e) => updateThreshold('temperature', 'max', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800 mb-2">Current Range:</p>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-white">
                  Min: {thresholds.temperature.min}°C
                </Badge>
                <Badge variant="outline" className="bg-white">
                  Max: {thresholds.temperature.max}°C
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Information */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5" />
            Alert Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-yellow-800">
            <p>
              <strong>How alerts work:</strong> When sensor readings exceed the set thresholds, 
              alerts will be triggered and displayed in the analysis section.
            </p>
            <p>
              <strong>Severity levels:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><Badge variant="secondary" className="text-xs">Medium</Badge> - Values 1-20% beyond threshold</li>
              <li><Badge variant="destructive" className="text-xs">High</Badge> - Values >20% beyond threshold</li>
            </ul>
            <p>
              <strong>Recommendations:</strong> Set thresholds based on your structure's design specifications 
              and safety factors. Consult with structural engineers for optimal values.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={saveSettings}
          className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
          size="lg"
        >
          Save Threshold Settings
        </Button>
      </div>
    </div>
  );
};

export default ThresholdSettings;
