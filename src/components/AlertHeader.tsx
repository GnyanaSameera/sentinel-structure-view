
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Activity } from 'lucide-react';

interface AlertHeaderProps {
  alertCount: number;
}

const AlertHeader = ({ alertCount }: AlertHeaderProps) => {
  return (
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
      
      {alertCount > 0 && (
        <div className="flex items-center justify-center gap-2 animate-pulse">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <Badge variant="destructive" className="animate-bounce">
            {alertCount} Active Alert{alertCount > 1 ? 's' : ''}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default AlertHeader;
