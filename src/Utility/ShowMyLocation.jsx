import { toast } from "sonner";

export const showMyLocation = async (mapInstance, setLoading) => {
    try {
      setLoading(true); // Start loading
      // Geolocation API to get current position
      const { coords } = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
  
      const { latitude, longitude } = coords;
  
      // Fly to the current location
      mapInstance.flyTo({
        center: [longitude, latitude],
        essential: true,
        zoom: 14
      });
      // toast.success('We are on your location')
    } catch (error) {
      // console.error("Error getting location:", error);
      // Fallback to a random position in case of failure
      mapInstance.flyTo({
        center: [(Math.random() - 0.5) * 360, (Math.random() - 0.5) * 100],
        zoom: 2,
        essential: true,
      });
      toast.error("Couldn't find your Location");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  