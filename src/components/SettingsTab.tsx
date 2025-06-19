
import React from 'react';
import ThresholdSettings from '@/components/ThresholdSettings';

interface SettingsTabProps {
  thresholds: any;
  setThresholds: (thresholds: any) => void;
}

const SettingsTab = ({ thresholds, setThresholds }: SettingsTabProps) => {
  return (
    <ThresholdSettings 
      thresholds={thresholds}
      onThresholdsChange={setThresholds}
    />
  );
};

export default SettingsTab;
