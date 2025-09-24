"use client"
import { CardHoverEffectDemo } from '@/components/projectcard'
import React from 'react'

function page() {
  return (
    <div>
         <div className={`min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300`}>
      {/* Fixed Navbar */}
      
      
      {/* Content with padding to account for fixed navbar */}
      <div className="pt-16"> {/* Adjust this value based on your navbar height */}
        <CardHoverEffectDemo/>
      </div>
    </div>
    </div>
  )
}

export default page