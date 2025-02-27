import React from 'react'
import { ImageOverlay } from 'react-leaflet'

const ImageOverlays = () => {
    return (
        <>
            {
                Object.keys(imageData).map((name, index) => (
                    <div key={index}>
                        {imageData[name].url && (
                            <ImageOverlay
                                url={imageData[name].url}
                                bounds={imageData[name].bounds}
                                opacity={imageData[name].opacity}
                            />
                        )}
                    </div>
                ))
            }
        </>
    )
}

export default ImageOverlays
