import { Sidebar } from 'flowbite-react'
import React ,{useEffect,useState} from 'react'
import {HiArrowSmRight, HiUser} from 'react-icons/hi'
import { Link, useLocation} from 'react-router-dom'


export default function DashSidebar() {
    const location = useLocation()
    const [tab,setTab] = useState('');//to know which tab is active
  
    useEffect(() => {
         const urlParams = new URLSearchParams(location.search);
         const tabFromUrl = urlParams.get('tab');
          if(tabFromUrl){
            setTab(tabFromUrl)
          }
    },
    [location.search]
    )
  return (
    <Sidebar className='w-full md:w-56 '>
        <Sidebar.Items>
         <Sidebar.ItemGroup>
            <Link to='/dashboard?tab=profile'>
            <Sidebar.Item active={tab==='profile'} icon={HiUser} label ={'user'} labelColor='dark' as = 'div'>
                Profile
            </Sidebar.Item>
            </Link>
            <Sidebar.Item icon={HiArrowSmRight} className = 'cursor-pointer'>
                Sign Out
            </Sidebar.Item>     
         </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  );
}
//added as div to the sidebar item to make it a div instead of a link because we are using a link to wrap the sidebar item which is also a link so we were getting a warining on the console