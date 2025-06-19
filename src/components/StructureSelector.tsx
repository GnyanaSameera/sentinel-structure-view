
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Building, Bridge, Ship, Zap } from 'lucide-react';

const StructureSelector = ({ value, onChange }) => {
  const structures = [
    { id: 'bridge', name: 'Bridge', icon: Bridge, description: 'Highway, railway, or pedestrian bridges' },
    { id: 'floating', name: 'Floating Structure', icon: Ship, description: 'Offshore platforms, floating docks' },
    { id: 'building', name: 'Building', icon: Building, description: 'High-rise buildings, commercial structures' },
    { id: 'towers', name: 'Towers', icon: Zap, description: 'Communication towers, power transmission towers' }
  ];

  const selectedStructure = structures.find(s => s.id === value);

  return (
    <div className="space-y-3">
      <Label htmlFor="structure-select" className="text-sm font-medium">
        Structure Type
      </Label>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full hover:bg-gray-50 transition-colors">
          <SelectValue placeholder="Select structure type" />
        </SelectTrigger>
        <SelectContent>
          {structures.map((structure) => {
            const IconComponent = structure.icon;
            return (
              <SelectItem key={structure.id} value={structure.id} className="cursor-pointer">
                <div className="flex items-center gap-3 py-2">
                  <IconComponent className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium">{structure.name}</div>
                    <div className="text-xs text-gray-500">{structure.description}</div>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {selectedStructure && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border animate-fade-in">
          <selectedStructure.icon className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-800">{selectedStructure.name} Selected</p>
            <p className="text-xs text-blue-600">{selectedStructure.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StructureSelector;
