import React, { useState, useEffect } from "react";
import { NavLink as Link } from 'react-router-dom';

function Navbar () {
    const [pageURL, setPageURL] = useState(0);

    useEffect(() => {
        const arrayA = window.location.href.split("/")
        if(arrayA[arrayA.length - 1] === 'blocks' || arrayA[arrayA.length - 2] === 'blocks') {
            setPageURL("BLOCKS");
        } else if (arrayA[arrayA.length - 1] === 'search' || arrayA[arrayA.length - 2] === 'search') {
            setPageURL("SEARCH");
        } else if (arrayA[arrayA.length - 1] === 'validators' || arrayA[arrayA.length - 2] === 'validators') {
            setPageURL("VALIDATORS");
        } else {
            setPageURL("HOME");
        }
    })

    return (
        <div>
            <div className='z-10 bg-[#303030] space-y-10 w-70 border-b border-[#636363]'>
                <div className='flex-1 flex items-center justify-center space-x-4 md:space-x-32 p-4 text-sm font-semibold text-[#FF9417]'>
                    <Link onClick={() => {setPageURL("HOME");}} to='/'className={`flex items-center space-x-4 justify-center w-20 py-2`}>
                        <div>DASHBOARD</div>
                    </Link>
                    <Link onClick={() => {setPageURL("BLOCKS");}} to='/blocks' className={`flex items-center space-x-4 justify-center w-20 py-2`}>
                        <div>BLOCKS</div>
                    </Link>
                    <Link onClick={() => {setPageURL("VALIDATORS");}} to='/validators' className={`flex items-center space-x-4 justify-center w-28 py-2`}>
                        <div>VAIDATORS</div>
                    </Link>
                    <Link onClick={() => {setPageURL("SEARCH");}} to='/search' className={`flex items-center space-x-4 justify-center w-20 py-2`}>
                        <div>SEARCH</div>
                    </Link>
                </div> 
            </div>
        </div>
    )
}

export default Navbar;