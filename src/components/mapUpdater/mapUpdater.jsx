import { useEffect } from 'react'
import { useMap } from 'react-leaflet';
import { useSearchParams } from 'react-router-dom';
import L from 'leaflet';


const MapUpdater = () => {
    const map = useMap();
    const [searchParams, setSearchParams] = useSearchParams();
  
    useEffect(() => {
      const updateUrl = () => {
        let center ={lat: parseFloat(searchParams.get('lat')),
                      lon:parseFloat(searchParams.get('lon'))
        }
        let zoom = parseFloat(searchParams.get('zoom'));
        try{
           center = map.getCenter();
           zoom = map.getZoom();
        }catch(e){
          console.log(e)
        }
        // Update URL with new center and zoom
        setSearchParams({
          lat: `${parseFloat((center.lat).toFixed(5))}`,
          lon: `${parseFloat((center.lng).toFixed(5))}`,
          zoom: zoom.toString(),
        });
      };
      const scale = L.control.scale({
        position: 'bottomright',
        maxWidth: 150,
        imperial: false,
        metric: true,
        updateWhenIdle: true
    }).addTo(map);
  
      // Add listeners for map move/zoom
      map.on('moveend', updateUrl);
      map.on('zoomend', updateUrl);
  
      return () => {
        map.off('moveend', updateUrl);
        map.off('zoomend', updateUrl);
        map.removeControl(scale);

      };
    }, [map, setSearchParams]);
  
    return null;
  };

export default MapUpdater
