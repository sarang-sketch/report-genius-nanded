import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, Home } from 'lucide-react';

// You'll need to set this token in your environment
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZS1tYXBzIiwiYSI6ImNscnEwMzFncDAxb2Myam1rbHpqcGx4MWkifQ.6VVMwH7UbMMdKHNKV2NolQ';

interface DeliveryMapProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  selectedLocation?: { lat: number; lng: number; address: string };
  deliveryMode?: boolean;
  deliveryLocation?: { lat: number; lng: number };
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({ 
  onLocationSelect, 
  selectedLocation, 
  deliveryMode = false,
  deliveryLocation 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const deliveryMarker = useRef<mapboxgl.Marker | null>(null);
  const [address, setAddress] = useState(selectedLocation?.address || '');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: selectedLocation ? [selectedLocation.lng, selectedLocation.lat] : [77.2090, 28.6139], // Delhi as default
      zoom: selectedLocation ? 15 : 10,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    if (!deliveryMode) {
      // Add click listener for location selection
      map.current.on('click', async (e) => {
        const { lng, lat } = e.lngLat;
        
        // Remove existing marker
        if (marker.current) {
          marker.current.remove();
        }

        // Add new marker
        marker.current = new mapboxgl.Marker({ color: '#ef4444' })
          .setLngLat([lng, lat])
          .addTo(map.current!);

        // Reverse geocoding to get address
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
          );
          const data = await response.json();
          const address = data.features[0]?.place_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          
          setAddress(address);
          onLocationSelect?.({ lat, lng, address });
        } catch (error) {
          console.error('Error getting address:', error);
          const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          setAddress(fallbackAddress);
          onLocationSelect?.({ lat, lng, address: fallbackAddress });
        }
      });
    }

    // Add existing marker if location is selected
    if (selectedLocation) {
      marker.current = new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat([selectedLocation.lng, selectedLocation.lat])
        .addTo(map.current);
    }

    // Add delivery marker if in delivery mode
    if (deliveryMode && deliveryLocation) {
      deliveryMarker.current = new mapboxgl.Marker({ color: '#10b981' })
        .setLngLat([deliveryLocation.lng, deliveryLocation.lat])
        .addTo(map.current);
    }

    return () => {
      map.current?.remove();
    };
  }, [selectedLocation, deliveryMode, deliveryLocation, onLocationSelect]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 15
            });

            if (!deliveryMode) {
              // Remove existing marker
              if (marker.current) {
                marker.current.remove();
              }

              // Add new marker
              marker.current = new mapboxgl.Marker({ color: '#ef4444' })
                .setLngLat([longitude, latitude])
                .addTo(map.current);

              // Get address for current location
              try {
                const response = await fetch(
                  `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`
                );
                const data = await response.json();
                const address = data.features[0]?.place_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                
                setAddress(address);
                onLocationSelect?.({ lat: latitude, lng: longitude, address });
              } catch (error) {
                console.error('Error getting address:', error);
              }
            }
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const searchAddress = async () => {
    if (!address.trim()) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&country=IN`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const fullAddress = data.features[0].place_name;
        
        if (map.current) {
          map.current.flyTo({
            center: [lng, lat],
            zoom: 15
          });

          if (!deliveryMode) {
            // Remove existing marker
            if (marker.current) {
              marker.current.remove();
            }

            // Add new marker
            marker.current = new mapboxgl.Marker({ color: '#ef4444' })
              .setLngLat([lng, lat])
              .addTo(map.current);

            setAddress(fullAddress);
            onLocationSelect?.({ lat, lng, address: fullAddress });
          }
        }
      }
    } catch (error) {
      console.error('Error searching address:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          {deliveryMode ? 'Delivery Tracking' : 'Select Delivery Location'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!deliveryMode && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Delivery Address</Label>
              <div className="flex gap-2">
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
                />
                <Button onClick={searchAddress} variant="outline">
                  Search
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={getCurrentLocation}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Navigation className="h-4 w-4" />
                Use Current Location
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Click on the map to select your exact delivery location
            </p>
          </div>
        )}
        
        <div 
          ref={mapContainer} 
          className="w-full h-96 rounded-lg border"
          style={{ minHeight: '400px' }}
        />
        
        {deliveryMode && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Delivery Location</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Current Position</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryMap;