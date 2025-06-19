
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlertTriangle, Activity, Thermometer, TrendingUp, TrendingDown } from 'lucide-react';

const DataVisualization = ({ data, analysisType, onAnalysisTypeChange, thresholds, dateRange }) => {
  const [selectedSensor, setSelectedSensor] = useState('all');

  if (!data) return null;

  const getStrainStats = () => {
    const strainValues = data.sensors.map(s => s.strain);
    return {
      max: Math.max(...strainValues),
      min: Math.min(...strainValues),
      avg: (strainValues.reduce((a, b) => a + b, 0) / strainValues.length).toFixed(1)
    };
  };

  const getTempStats = () => {
    const tempValues = data.sensors.map(s => s.temperature);
    return {
      max: Math.max(...tempValues),
      min: Math.min(...tempValues),
      avg: (tempValues.reduce((a, b) => a + b, 0) / tempValues.length).toFixed(1)
    };
  };

  const strainStats = getStrainStats();
  const tempStats = getTempStats();

  const formatTooltipValue = (value, name) => {
    if (name.includes('strain')) {
      return [`${value.toFixed(2)} με`, name];
    } else if (name.includes('temp')) {
      return [`${value.toFixed(2)}°C`, name];
    }
    return [value, name];
  };

  const getThresholdAlerts = () => {
    const alerts = [];
    data.sensors.forEach(sensor => {
      if (sensor.strain > thresholds.strain.max || sensor.strain < thresholds.strain.min) {
        alerts.push({
          sensor: sensor.name,
          type: 'strain',
          value: sensor.strain,
          threshold: sensor.strain > thresholds.strain.max ? thresholds.strain.max : thresholds.strain.min,
          severity: Math.abs(sensor.strain) > Math.abs(thresholds.strain.max) * 1.2 ? 'high' : 'medium'
        });
      }
      if (sensor.temperature > thresholds.temperature.max || sensor.temperature < thresholds.temperature.min) {
        alerts.push({
          sensor: sensor.name,
          type: 'temperature',
          value: sensor.temperature,
          threshold: sensor.temperature > thresholds.temperature.max ? thresholds.temperature.max : thresholds.temperature.min,
          severity: Math.abs(sensor.temperature - 25) > 20 ? 'high' : 'medium'
        });
      }
    });
    return alerts;
  };

  const currentAlerts = getThresholdAlerts();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Analysis Type Selector */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
        <Select value={analysisType} onValueChange={onAnalysisTypeChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="both">Both (Strain + Temperature)</SelectItem>
            <SelectItem value="strain">Strain Analysis Only</SelectItem>
            <SelectItem value="temperature">Temperature Analysis Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alerts Section */}
      {currentAlerts.length > 0 && (
        <div className="space-y-2">
          {currentAlerts.map((alert, index) => (
            <Alert key={index} className={`${alert.severity === 'high' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'} animate-pulse`}>
              <AlertTriangle className={`h-4 w-4 ${alert.severity === 'high' ? 'text-red-500' : 'text-yellow-500'}`} />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  <strong>{alert.sensor}</strong> - {alert.type} value {alert.value.toFixed(2)} 
                  {alert.type === 'strain' ? 'με' : '°C'} exceeds threshold ({alert.threshold})
                </span>
                <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                  {alert.severity.toUpperCase()}
                </Badge>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(analysisType === 'both' || analysisType === 'strain') && (
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Activity className="h-5 w-5" />
                Strain Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {strainStats.max}
                  </p>
                  <p className="text-xs text-gray-500">Max (με)</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-red-600 flex items-center justify-center gap-1">
                    <TrendingDown className="h-4 w-4" />
                    {strainStats.min}
                  </p>
                  <p className="text-xs text-gray-500">Min (με)</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-blue-600">{strainStats.avg}</p>
                  <p className="text-xs text-gray-500">Avg (με)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {(analysisType === 'both' || analysisType === 'temperature') && (
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Thermometer className="h-5 w-5" />
                Temperature Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-red-600 flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {tempStats.max}
                  </p>
                  <p className="text-xs text-gray-500">Max (°C)</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
                    <TrendingDown className="h-4 w-4" />
                    {tempStats.min}
                  </p>
                  <p className="text-xs text-gray-500">Min (°C)</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-green-600">{tempStats.avg}</p>
                  <p className="text-xs text-gray-500">Avg (°C)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sensor Status Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Sensor Status ({data.sensors.length} Active)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.sensors.map((sensor) => (
              <div key={sensor.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{sensor.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {sensor.id}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mb-3">{sensor.location}</p>
                
                {(analysisType === 'both' || analysisType === 'strain') && (
                  <div className="mb-2">
                    <div className="flex justify-between text-sm">
                      <span>Strain:</span>
                      <span className={`font-medium ${
                        sensor.strain > thresholds.strain.max || sensor.strain < thresholds.strain.min 
                          ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {sensor.strain} με
                      </span>
                    </div>
                  </div>
                )}
                
                {(analysisType === 'both' || analysisType === 'temperature') && (
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Temperature:</span>
                      <span className={`font-medium ${
                        sensor.temperature > thresholds.temperature.max || sensor.temperature < thresholds.temperature.min 
                          ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {sensor.temperature}°C
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Series Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Time Series Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="time" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  className="text-xs"
                />
                <YAxis className="text-xs" />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={formatTooltipValue}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ccc' }}
                />
                <Legend />
                
                {(analysisType === 'both' || analysisType === 'strain') && (
                  <>
                    <Line type="monotone" dataKey="strain1" stroke="#3b82f6" strokeWidth={2} name="Strain Sensor 1" />
                    <Line type="monotone" dataKey="strain2" stroke="#06b6d4" strokeWidth={2} name="Strain Sensor 2" />
                    <Line type="monotone" dataKey="strain3" stroke="#8b5cf6" strokeWidth={2} name="Strain Sensor 3" />
                  </>
                )}
                
                {(analysisType === 'both' || analysisType === 'temperature') && (
                  <>
                    <Line type="monotone" dataKey="temp1" stroke="#f59e0b" strokeWidth={2} name="Temperature 1" />
                    <Line type="monotone" dataKey="temp2" stroke="#ef4444" strokeWidth={2} name="Temperature 2" />
                    <Line type="monotone" dataKey="temp3" stroke="#f97316" strokeWidth={2} name="Temperature 3" />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataVisualization;
