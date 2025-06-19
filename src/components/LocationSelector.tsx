
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Search, Navigation, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LocationSelector = ({ onLocationSelect, selectedLocation }) => {
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef(null);
  const { toast } = useToast();

  // Simulate Google Maps integration (in real implementation, you'd use Google Maps API)
  const searchLocation = async () => {
    if (!address.trim()) {
      toast({
        title: "Enter Address",
        description: "Please enter an address to search.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock coordinates for demonstration
      const mockCoordinates = {
        lat: (40.7128 + (Math.random() - 0.5) * 0.1).toFixed(6),
        lng: (-74.0060 + (Math.random() - 0.5) * 0.1).toFixed(6),
        address: address
      };
      
      setCoordinates(mockCoordinates);
      onLocationSelect(mockCoordinates);
      setIsSearching(false);
      
      toast({
        title: "Location Found",
        description: `Coordinates: ${mockCoordinates.lat}, ${mockCoordinates.lng}`,
      });
    }, 1500);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude.toFixed(6),
            lng: position.coords.longitude.toFixed(6),
            address: 'Current Location'
          };
          setCoordinates(coords);
          setAddress('Current Location');
          onLocationSelect(coords);
          
          toast({
            title: "Location Detected",
            description: `Using current location: ${coords.lat}, ${coords.lng}`,
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get current location. Please enter manually.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Please enter coordinates manually.",
        variant: "destructive"
      });
    }
  };

  const setManualCoordinates = () => {
    if (coordinates.lat && coordinates.lng) {
      const location = {
        lat: parseFloat(coordinates.lat).toFixed(6),
        lng: parseFloat(coordinates.lng).toFixed(6),
        address: address || `${coordinates.lat}, ${coordinates.lng}`
      };
      onLocationSelect(location);
      
      toast({
        title: "Coordinates Set",
        description: `Location: ${location.lat}, ${location.lng}`,
      });
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Site Location</Label>
      
      {/* Address Search */}
      <div className="flex gap-2">
        <Input
          placeholder="Enter address or location name"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
        />
        <Button 
          onClick={searchLocation}
          disabled={isSearching}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSearching ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Current Location Button */}
      <Button 
        onClick={getCurrentLocation}
        variant="outline"
        className="w-full hover:bg-blue-50 border-blue-200"
      >
        <Navigation className="h-4 w-4 mr-2" />
        Use Current Location
      </Button>

      {/* Manual Coordinates */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="latitude" className="text-xs text-gray-500">Latitude</Label>
          <Input
            id="latitude"
            placeholder="40.7128"
            value={coordinates.lat}
            onChange={(e) => setCoordinates(prev => ({ ...prev, lat: e.target.value }))}
            type="number"
            step="any"
          />
        </div>
        <div>
          <Label htmlFor="longitude" className="text-xs text-gray-500">Longitude</Label>
          <Input
            id="longitude"
            placeholder="-74.0060"
            value={coordinates.lng}
            onChange={(e) => setCoordinates(prev => ({ ...prev, lng: e.target.value }))}
            type="number"
            step="any"
          />
        </div>
      </div>

      <Button 
        onClick={setManualCoordinates}
        variant="outline"
        className="w-full"
        disabled={!coordinates.lat || !coordinates.lng}
      >
        Set Manual Coordinates
      </Button>

      {/* Selected Location Display */}
      {selectedLocation && (
        <Card className="border-green-200 bg-green-50 animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800">Location Selected</h4>
                <p className="text-sm text-green-600">{selectedLocation.address}</p>
                <p className="text-xs text-green-500">
                  Coordinates: {selectedLocation.lat}, {selectedLocation.lng}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mock Map Display */}
      <div className="h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MapPin className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Interactive Map</p>
          <p className="text-xs">(Google Maps integration required)</p>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
