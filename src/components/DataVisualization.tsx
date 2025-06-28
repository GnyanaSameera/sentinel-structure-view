import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlertTriangle, Activity, Thermometer, TrendingUp, TrendingDown } from 'lucide-react';
import { format, parseISO, isWithinInterval } from 'date-fns';

const DataVisualization = ({ data, analysisType, onAnalysisTypeChange, thresholds, dateRange }) => {
  const [selectedSensor, setSelectedSensor] = useState('all');

  if (!data) return null;

  // Filter data based on date range if provided
  const filteredTimeSeriesData = dateRange?.from && dateRange?.to 
    ? data.timeSeriesData.filter(item => {
        try {
          const itemDate = new Date(item.time);
          // Create a date range that includes the entire day
          const startDate = new Date(dateRange.from);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(dateRange.to);
          endDate.setHours(23, 59, 59, 999);
          
          return isWithinInterval(itemDate, { 
            start: startDate, 
            end: endDate 
          });
        } catch (error) {
          console.log('Date filtering error:', error, 'for item:', item);
          return false;
        }
      })
    : data.timeSeriesData;

  console.log('Date range:', dateRange);
  console.log('Original data points:', data.timeSeriesData.length);
  console.log('Filtered data points:', filteredTimeSeriesData.length);
  console.log('Sample data point:', data.timeSeriesData[0]);

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

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">
            {format(new Date(label), 'MMM dd, yyyy HH:mm:ss')}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatTooltipValue(entry.value, entry.name)[0]}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
          {dateRange?.from && dateRange?.to && (
            <p className="text-sm text-gray-600 mt-1">
              Filtered data: {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
            </p>
          )}
        </div>
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

      {/* Enhanced Time Series Charts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Time Series Data ({filteredTimeSeriesData.length} data points)</span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-red-500"></div>
                <span>Max Threshold</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-orange-500"></div>
                <span>Min Threshold</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTimeSeriesData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No data points found for the selected date range.</p>
              <p className="text-sm mt-2">Try selecting a different date range or run the initial analysis first.</p>
            </div>
          ) : (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredTimeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="time" 
                    tickFormatter={(value) => format(new Date(value), 'HH:mm')}
                    className="text-xs"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis className="text-xs" />
                  <Tooltip content={customTooltip} />
                  <Legend />
                  
                  {/* Threshold lines for strain */}
                  {(analysisType === 'both' || analysisType === 'strain') && (
                    <>
                      <ReferenceLine y={thresholds.strain.max} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} />
                      <ReferenceLine y={thresholds.strain.min} stroke="#f97316" strokeDasharray="5 5" strokeWidth={2} />
                    </>
                  )}
                  
                  {/* Threshold lines for temperature */}
                  {(analysisType === 'both' || analysisType === 'temperature') && (
                    <>
                      <ReferenceLine y={thresholds.temperature.max} stroke="#dc2626" strokeDasharray="3 3" strokeWidth={2} />
                      <ReferenceLine y={thresholds.temperature.min} stroke="#ea580c" strokeDasharray="3 3" strokeWidth={2} />
                    </>
                  )}
                  
                  {(analysisType === 'both' || analysisType === 'strain') && (
                    <>
                      <Line type="monotone" dataKey="strain1" stroke="#3b82f6" strokeWidth={2} name="Strain Sensor 1" dot={false} />
                      <Line type="monotone" dataKey="strain2" stroke="#06b6d4" strokeWidth={2} name="Strain Sensor 2" dot={false} />
                      <Line type="monotone" dataKey="strain3" stroke="#8b5cf6" strokeWidth={2} name="Strain Sensor 3" dot={false} />
                    </>
                  )}
                  
                  {(analysisType === 'both' || analysisType === 'temperature') && (
                    <>
                      <Line type="monotone" dataKey="temp1" stroke="#f59e0b" strokeWidth={2} name="Temperature 1" dot={false} />
                      <Line type="monotone" dataKey="temp2" stroke="#ef4444" strokeWidth={2} name="Temperature 2" dot={false} />
                      <Line type="monotone" dataKey="temp3" stroke="#f97316" strokeWidth={2} name="Temperature 3" dot={false} />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <p><strong>Legend:</strong> Red dashed lines = Maximum thresholds, Orange dashed lines = Minimum thresholds</p>
            <p>Hover over data points to see exact values and timestamps</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataVisualization;
