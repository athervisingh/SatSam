import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const ReviseData = () => {
  const [stateOn, setStateOn] = useState(false);
  const { mapInstance } = useSelector((state) => state.dataSlice)
  const geojsonData = useSelector((state) => state.geojsonData);

  const btnClicked = () => {
    if (geojsonData.length > 0 && geojsonData[0].id) {
      if (!stateOn) {
        mapInstance.setLayoutProperty(geojsonData[0].id, 'visibility', 'visible');
      } else {
        mapInstance.setLayoutProperty(geojsonData[0].id, 'visibility', 'none');
      }
      setStateOn(!stateOn);
    }
  }

  return (

    <div className={`} w-full`} onClick={btnClicked}>
      <button className={`btn p-2 rounded-md w-1/2 ${stateOn ? 'text-black' : 'font-white'} ${stateOn ? 'bg-white' : 'bg-blue'}`}>Enabled</button>
    </div >
  )
}

export default ReviseData;
