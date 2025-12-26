import React from 'react'
import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs'

export default function FooterCom() {
  return (
  <Footer container className='border border-t-8 border-teal-500 mt-12'>
    <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1 mb-8'>
            <div className='mt-5'>
              <Link
                to="/"
                className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white">
                <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Sleek
                </span>
                Script
              </Link>
              <p className='text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-sm'>
                A modern blogging platform where creators share their stories, ideas, and insights with the world.
              </p>
            </div>
            <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
                <div>
               <Footer.Title title = 'Resources' />
                <Footer.LinkGroup col>
                    <Footer.Link
                    href='/'
                    target='_blank'
                    rel='noopener noreferrer'>
                    Explore Blogs
                    </Footer.Link>

                    <Footer.Link
                    href='/add-blog'
                    target='_blank'
                    rel='noopener noreferrer'>
                    Create Blog
                    </Footer.Link>

                    <Footer.Link
                    href='/projects'
                    target='_blank'
                    rel='noopener noreferrer'>
                    My Blogs
                    </Footer.Link>
                </Footer.LinkGroup>
                </div>

            <div>
               <Footer.Title title = 'Follow us' />
                <Footer.LinkGroup col>
                    <Footer.Link
                    href='#'
                    target='_blank'
                    rel='noopener noreferrer'>
                    github
                    </Footer.Link>

                    <Footer.Link
                    href='#'
                    target='_blank'
                    rel='noopener noreferrer'>
                      discord
                    </Footer.Link>
                </Footer.LinkGroup>
                </div>

                <div>
                    <Footer.Title title = 'Legal' />
                    <Footer.LinkGroup col>
                        <Footer.Link
                        href='#'
                        target='_blank'
                        rel='noopener noreferrer'>
                        Privacy policy
                        </Footer.Link>

                        <Footer.Link
                        href='#'
                        target='_blank'
                        rel='noopener noreferrer'>
                        terms & conditions
                        </Footer.Link>
                    </Footer.LinkGroup>
                    </div>                           
            </div>
        </div>
      
       <Footer.Divider/>
       <div className='w-full sm:flex sm:items-center sm:justify-between '>
        <Footer.Copyright href='#' 
        by="SleekScript Enterprises" 
        year = {new Date().getFullYear() }/>
        <div className='flex gap-5 sm:mt-0 mt-4 sm:justify-center'>
            <Footer.Icon href='#' icon={BsFacebook}/>
            <Footer.Icon href='#' icon={BsInstagram}/>
            <Footer.Icon href='#' icon={BsTwitter}/>
            <Footer.Icon href='#' icon={BsDribbble}/>
            <Footer.Icon href='#' icon={BsGithub}/>
        </div>
       </div>
      </div>
    </Footer>
  );
}
