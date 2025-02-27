import React from 'react'
import { ImageOverlay } from 'react-leaflet';
import { useSelector } from 'react-redux'

const RegionOverlays = () => {
    const { regionOverlays } = useSelector((state) => state.dataSlice);

    // console.log("RegionOverlays Data:", regionOverlays);

    return (
        <>
            {regionOverlays?.map((overlay, index) => (
                overlay.imageUrl && (
                    <ImageOverlay
                        key={index}
                        url={overlay.imageUrl}
                        bounds={overlay.imageBounds}
                    />
                )
            ))}
        </>
    );
};


export default RegionOverlays
