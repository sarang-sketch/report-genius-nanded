import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Home, Truck, Clock } from 'lucide-react';

// You'll need to set this token in your environment
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZS1tYXBzIiwiYSI6ImNscnEwMzFncDAxb2Myam1rbHpqcGx4MWkifQ.6VVMwH7UbMMdKHNKV2NolQ';

interface DeliveryMapProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  selectedLocation?: { lat: number; lng: number; address: string };
  deliveryMode?: boolean;
  deliveryLocation?: { lat: number; lng: number };
  estimatedTime?: string;
  deliveryStatus?: string;
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({ 
  onLocationSelect, 
  selectedLocation, 
  deliveryMode = false,
  deliveryLocation,
  estimatedTime,
  deliveryStatus = 'out_for_delivery'
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
      style: 'mapbox://styles/mapbox/navigation-day-v1',
      center: selectedLocation ? [selectedLocation.lng, selectedLocation.lat] : [77.2090, 28.6139], // Delhi as default
      zoom: selectedLocation ? 15 : 10,
      bearing: deliveryMode ? -17.6 : 0,
      pitch: deliveryMode ? 45 : 0,
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

        // Add new marker with custom styling
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDlDNSAxNC4yNSAxMiAyMiAxMiAyMkMxMiAyMiAxOSAxNC4yNSAxOSA5QzE5IDUuMTMgMTUuODcgMiAxMiAyWk0xMiAxMS41QzEwLjYyIDExLjUgOS41IDEwLjM4IDkuNSA5QzkuNSA3LjYyIDEwLjYyIDYuNSAxMiA2LjVDMTMuMzggNi41IDE0LjUgNy42MiAxNC41IDlDMTQuNSAxMC4zOCAxMy4zOCAxMS41IDEyIDExLjVaIiBmaWxsPSIjZWY0NDQ0Ii8+Cjwvc3ZnPgo=)';
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.backgroundSize = 'contain';
        el.style.cursor = 'pointer';
        
        marker.current = new mapboxgl.Marker(el)
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
      const el = document.createElement('div');
      el.className = 'marker destination-marker';
      el.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDlDNSAxNC4yNSAxMiAyMiAxMiAyMkMxMiAyMiAxOSAxNC4yNSAxOSA5QzE5IDUuMTMgMTUuODcgMiAxMiAyWk0xMiAxMS41QzEwLjYyIDExLjUgOS41IDEwLjM4IDkuNSA5QzkuNSA3LjYyIDEwLjYyIDYuNSAxMiA2LjVDMTMuMzggNi41IDE0LjUgNy42MiAxNC41IDlDMTQuNSAxMC4zOCAxMy4zOCAxMS41IDEyIDExLjVaIiBmaWxsPSIjZWY0NDQ0Ii8+Cjwvc3ZnPgo=)';
      el.style.width = '36px';
      el.style.height = '36px';
      el.style.backgroundSize = 'contain';
      el.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))';
      
      marker.current = new mapboxgl.Marker(el)
        .setLngLat([selectedLocation.lng, selectedLocation.lat])
        .addTo(map.current);
    }

    // Add delivery marker if in delivery mode (truck icon)
    if (deliveryMode && deliveryLocation) {
      const el = document.createElement('div');
      el.className = 'marker delivery-marker';
      el.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgMTVIMlYxM0gyTDQgN0gxNEwxNiAxM1YxNUgxNVYxN0gxM1YxNUg5VjE3SDdWMTVIMzpNNSA5VjEzSDEzVjlINVpNMTggMTZWMTRIMjJWMTZIMThaTTE5IDE5QzE5LjU1IDE5IDIwIDIyMi40NSAyMCAyMUMyMCAyMC40NSAxOS41NSAyMCAxOSAyMEMxOC40NSAyMCAxOCAyMC40NSAxOCAyMUMxOCAyMS41NSAxOC40NSAyMiAxOSAyMlpNNyAxOUM3LjU1IDE5IDggMTguNTUgOCAxOEM4IDE3LjQ1IDcuNTUgMTcgNyAxN0M2LjQ1IDE3IDYgMTcuNDUgNiAxOEM2IDE4LjU1IDYuNDUgMTkgNyAxOVoiIGZpbGw9IiMxMGI5ODEiLz4KPC9zdmc+Cg==)';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.backgroundSize = 'contain';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#10b981';
      el.style.padding = '8px';
      el.style.filter = 'drop-shadow(0 4px 8px rgba(16,185,129,0.4))';
      el.style.animation = 'pulse 2s infinite';
      
      deliveryMarker.current = new mapboxgl.Marker(el)
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
    <Card className="w-full border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {deliveryMode ? (
              <>
                <Truck className="h-5 w-5 text-primary animate-pulse" />
                Live Delivery Tracking
              </>
            ) : (
              <>
                <MapPin className="h-5 w-5 text-primary" />
                Select Delivery Location
              </>
            )}
          </CardTitle>
          {deliveryMode && estimatedTime && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              ETA: {estimatedTime}
            </Badge>
          )}
        </div>
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
                  className="bg-background/50"
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
        
        <div className="relative">
          <div 
            ref={mapContainer} 
            className="w-full h-96 rounded-lg border border-border/50 overflow-hidden shadow-inner"
            style={{ minHeight: '400px' }}
          />
          {deliveryMode && (
            <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span className="font-medium">Delivery Vehicle</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-destructive rounded-full"></div>
                  <span className="font-medium">Your Location</span>
                </div>
                {deliveryStatus === 'out_for_delivery' && (
                  <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-600 border-orange-500/20">
                    Vehicle En Route
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
        
        {deliveryMode && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Distance</p>
              <p className="font-semibold">~2.5 km</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Speed</p>
              <p className="font-semibold">25 km/h</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryMap;