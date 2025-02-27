import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Slider,
  IconButton,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch, useSelector } from 'react-redux';
import { Bold, Trash } from 'lucide-react';
import { deleteClass } from '../../../../store/Slices/ThresholdModelSlice/thresholdModelSlice';
import { deleteClassPolygon } from '../../../../store/Slices/ClassjsonSlice/classjsonSlice';

const OpacitySlider = ({ updateCanvasOpacity }) => {
  const { classname } = useSelector((state) => state.thresholdModelSlice);
  const {maskAreaData} = useSelector((state)=> state.addDetailsSlice);
  console.log(classname)
  const [opacity, setOpacity] = useState(new Array(classname.length).fill(0.5));
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  if (!classname) return null;

  const handleAccordionToggle = () => setExpanded(!expanded);

  const handleChange = (name, delta, index) => {
    const newOpacity = [...opacity];
    newOpacity[index] = Math.min(1, Math.max(0, newOpacity[index] + delta));
    setOpacity(newOpacity);
    updateCanvasOpacity(name, newOpacity[index]);
  };

  const handleTrash=(classItem)=>{
    updateCanvasOpacity(classItem,0);
    dispatch(deleteClass(classItem));
    dispatch(deleteClassPolygon(classItem))
  }

  return (
    <Accordion
      expanded={expanded}
      onChange={handleAccordionToggle}
      sx={{
        marginTop:'7px',
        right:'-340px',
        width:'17rem',
        background: '#212529',
        boxShadow: 'none',
        padding: 'none',
        borderRadius:'10px',
        zIndex:6007,
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{color:'white'}} />}>
        <Typography variant="subtitle2" fontWeight="100" fontSize={12} color="white">
          Opacity Controls
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ color: 'white' }}>
        {classname.map((classItem, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <div className='flex justify-between max-w-[14rem]'>
            <Typography variant="body2" fontWeight="500">
              Class: {classItem}
            </Typography>
            <Trash size={16} color='red' 
            onClick={()=>handleTrash(classItem)} />
            </div>
              
            <Box display="flex" alignItems="center">
              <Slider
                value={opacity[index]}
                onChange={(e, value) => handleChange(classItem, value - opacity[index], index)}
                step={0.1}
                min={0}
                max={1}
                sx={{ flex: 1 }}
              />
              <IconButton
                size="small"
                onClick={() => handleChange(classItem, -0.1, index)}
                disabled={opacity[index] <= 0}
              >
                <RemoveIcon fontSize="small" sx={{ color: 'white' }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleChange(classItem, 0.1, index)}
                disabled={opacity[index] >= 1}
              >
                <AddIcon fontSize="small" sx={{ color: 'white' }} />
              </IconButton>
            </Box>
            <Typography variant="caption">
              Area: {maskAreaData[index]} km<sup>2</sup>
            </Typography>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default OpacitySlider;
