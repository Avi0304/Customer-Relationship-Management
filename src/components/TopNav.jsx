import React, {useState} from 'react'
import {FiBell, FiUser} from "react-icons/fi"

const TopNav = ({title}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [count, setCount] = useState(0) 
    
   
return (
    <div className='bg-white shadow-lg flex items-center justify-between p-6 h-16 transition-all duration-300 sticky top-0 z-50'>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h1>

        <div className="flex items-center  space-x-6">
            {/* Code for Notifications */}
                        <div className="relative">
                            <button className="relative hover:transform hover:scale-110 transition-all duration-200">
                                <FiBell size={26} className='text-gray-700 hover:text-blue-600' />
                                <span className={`absolute -top-1 -right-1 bg-red-500 
                                        text-white text-xs rounded-full px-2 py-1 font-semibold
                                        transition-all duration-300 transform 
                                        ${count === 0 ? 'scale-0 opacity-0' : 'scale-100 opacity-100 animate-pulse'}`}>
                                    {count}
                                </span>
                            </button>
                        </div>
            {/* Code for Profile DropDown */}
            <div className="relative">
                    <button className='flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200' 
                                    onClick={()=>setIsOpen(!isOpen)}>
                            <div className='p-2 bg-gray-100 rounded-full'>
                                    <FiUser size={24} className='text-gray-700'/>
                            </div>
                            <span className='text-gray-700 font-medium hidden md:block'>Admin</span>
                    </button>
                    {isOpen && (
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl p-3 
                                    transform transition-all duration-300 border border-gray-100 z-50">
                                    <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 
                                            hover:text-blue-600 rounded-md transition-colors duration-200"> 
                                            Profile
                                    </button>
                                    
                                    <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 
                                            hover:text-blue-600 rounded-md transition-colors duration-200"> 
                                            Settings
                                    </button>
                                    
                                    {/* <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 
                                            hover:text-blue-600 rounded-md transition-colors duration-200"> 
                                            Logout
                                    </button> */}
                            </div>
                    )}
            </div>
        </div>
    </div>
)
}

export default TopNav