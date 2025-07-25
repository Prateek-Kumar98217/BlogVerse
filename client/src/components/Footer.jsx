import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/3'>
        <div className='flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500'>
        
        <div>
            <img src ={assets.logo} alt='logo' className='w-32 sm:w-44'/>
            <p className='max-w-[410px] mt-6'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Totam ab facilis eligendi. Reiciendis animi sit ad necessitatibus iste, ea dolores et neque dolor non ipsam nulla nam aperiam obcaecati eum.</p>
        </div>
        
        </div>
        <p className='py-4 text-center text-sm md:text-base text-gray-500/80'>Copyright 2025 © BlogVerse - All Rights Reserved.</p>

    </div>
    
  )
}

export default Footer