import React from 'react'
import { useSelector } from 'react-redux';
export default function ThemeProviders ({children}) {
    const {theme} = useSelector(state => state.theme);
  return (<div className={theme}>
        <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen'>
        {children}
        </div>
    </div>

  );
}

//min-h-screen is used to make the height of the div to be atleast the height of the screen so for smaller screen the div will take the height of the screen and for larger screen it will take the height of the content