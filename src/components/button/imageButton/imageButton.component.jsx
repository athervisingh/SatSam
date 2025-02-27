
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Button from "../button.component"; 
import { changeButton } from "../../../store/Slices/ButtonSlice/buttonSlice"; 
import { setImageData } from "../../../store/Slices/DataSlice/dataSlice";
import { sendSignalforButtonResponse } from "../../../store/Slices/AdditionalDetailsSlice/addDetailsSlice";
import { useEffect, useState } from "react";
import Loading from "../../Loading";
const ImageButton = () => {
  const dispatch = useDispatch();
  const geojsonData = useSelector((state) => state.geojsonData);
  var geo = JSON.parse(JSON.stringify(geojsonData));
  const [loading, setLoading] = useState(false);
  
  const {bandValues, date} = useSelector((state)=> state.addDetailsSlice)

  const sendGeoJsonData = async () => {
    
    try {
      const combinedData = geo.length === 0 
      ? { 
          bands: bandValues, 
          date: date 
        } 
      : { 
          geojson: geo.geojsonData, 
          bands: bandValues, 
          date: date 
        };  

      console.log("Sending data to backend:", combinedData);

   const response =   await axios.post("https://8z2h0gbj-5001.inc1.devtunnels.ms/images", combinedData, {
        // timeout: 10000,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });


      console.log("response",response.data)
      const { image_url, access_token } = response.data;
      
      dispatch(setImageData({ image_url, access_token }));
      dispatch(sendSignalforButtonResponse(true))
      
      dispatch(changeButton({ type: "enableClasses", payload: true }));
      dispatch(changeButton({ type: "showImageButton", payload: false }));
    } catch (error) {
      console.error("Error:", error);
      alert("An unknown error occurred.");
    } finally{
      setLoading(false);
    }
  };

  const handleClick = () => {
    console.log('ddfssss')
    console.log("ImageButton clicked!");
    setLoading(true)
    sendGeoJsonData();
  };

  return (
    <>
    
    {loading && (<Loading/>)}
    <div className="absolute bottom-0 left-[2%] z-[1000]" onClick={handleClick}>
      
      <Button label={"Image"} />
    </div>
    </>
  );
};

export default ImageButton;
