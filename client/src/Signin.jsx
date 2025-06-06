import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';

import React, { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { signInStart,signInSuccess,signInFailure } from './redux/user/userSlice';
import Oauth from './components/Oauth.jsx';



export default function SignIn() {
  
  //this is used to keep the track of the form data in a continuous manner

  const [formData, setFormData] = useState({});

  const {loading,error:errorMessage} = useSelector((state)=>state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });

  };
 const handleSubmit = async (e) => {  
    e.preventDefault();//this will prevent the page from reloading after every entry
    if(!formData.email || !formData.password){
      return dispatch(signInFailure('Please fill in all the fields'));
    }
    try {
      dispatch(signInStart());//this will set the loading to true and error to null
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),//this converts the form data into a JSON string
      });
      const data = await res.json();
      if(data.success==false){
          dispatch(signInFailure(data.message));//this will set the loading to false and error to action.payload
      }
   
      if(res.ok){
        dispatch(signInSuccess(data));//this will set the loading to false and error to null and currentUser to action.payload
        navigate('/');
      }
    } catch (error) {
     dispatch(signInFailure(error.message));//this will set the loading to false and error to action.payload
    }
  }


  return (
    <div className='min-h-screen mt-20'>
      
    <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
      {/*left side*/}
      <div className="flex-1">
      <Link
        to="/"
        className="font-bold dark:text-white text-4xl"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Sleek
        </span>
        Script
      </Link>

      <p className='text-sm mt-5'>
        This is a demo project for a blog website. You can sign in to an existing account.
      </p>

      </div>
      {/*right side*/}
      <div className='flex-1'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

          <div>
            <Label value = 'Your email'/>
            <TextInput
            type='email'
            placeholder='name@company.com'
            id='email' onChange={handleChange}/>

          </div>
          <div>
            <Label value = 'Your password'/>
            <TextInput
            type='password'
            placeholder='Password'
            id='password' onChange={handleChange}/>

          </div>
          <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
            {loading ? (
              <>
              <Spinner size='sm'/>
              <span className='pl-3'>Loading...</span>
              </>
            ) : 'Sign In'}
          </Button>
           <Oauth/>
        </form>
        <div className='flex gap-2 text-sm mt-5'>
          <span>Have an account?</span>
          <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
        </div>
        {
          errorMessage && <Alert className='mt-5' color='failure'>
            {errorMessage}
            </Alert>
        }
      </div>
      </div>  
    </div>
  )
  
}
