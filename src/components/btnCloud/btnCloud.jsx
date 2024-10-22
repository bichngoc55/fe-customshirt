import React from 'react'

const btnCloud = ({top, left, width, height, zIndex, imageUrl}) => {
  return (
    <div 
      className="cloud" 
      style={{
        top: `${top}px`, 
        left: `${left}px`, 
        width: `${width}px`, 
        height: `${height}px`, 
        zIndex: zIndex,
        position: 'absolute',
      }}>
      <img src={imageUrl} alt="Cloud" style={{ width: '100%', height: 'auto' }} />
    </div>
      );
    };
export default btnCloud