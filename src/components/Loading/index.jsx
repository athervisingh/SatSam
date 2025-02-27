import React from 'react'
import loadPng from '../../assets/load.gif';

const Loading = () => {
    return (
        <div className="w-full h-[100vh] flex justify-center items-center backdrop-blur-sm backdrop-brightness-50 fixed top-0 left-0 z-[5000]">
            <img src={loadPng} alt="Loading..." width={100} />
        </div>
    )
}

export default Loading
