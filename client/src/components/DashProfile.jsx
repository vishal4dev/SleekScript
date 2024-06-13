import { Alert, Button, TextInput } from 'flowbite-react';
import React, { useState,useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getStorage } from 'firebase/storage';
import {app} from '../firebase.js';
import { ref, uploadBytesResumable,getDownloadURL } from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {updateStart,updateSuccess,updateFailure} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { set } from 'mongoose';



export default function DashProfile() {
    const {currentUser} = useSelector(state => state.user);
    const [imageFile,setImageFile] = useState(null);
    const [imageFileURL,setImageFileURL] = useState(null);
    const [imageFileUploadProgress,setImageFileUploadProgress] = useState(null);//this will be a number between 0 and 100
    const [imageFileUploadError,setImageFileUploadError] = useState(null);//this will be a string that will contain the error message if there is an error
    const [formData,setFormData] = useState({});//this will be an object that will contain the form data [username,email,password
    const [imageFileUploading,setImageFileUploading] = useState(false);//this will be a boolean that will be true if the image is being uploaded
    const [updateUserSuccess,setUpdateUserSuccess] = useState(null);//this will be a boolean that will be true if the user is updated successfully

    const [updateUserError,setUpdateUserError] = useState(null);//this will be a boolean that will be true if the user is updated successfully

    const filePickerRef = useRef(null);
    const dispatch = useDispatch();
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file){
            setImageFile(file);
            setImageFileURL(URL.createObjectURL(file));
        }
        //conversion of image to URL

    };
   useEffect(() => {
    if(imageFile){
       uploadImage();
    }
   }, [imageFile]);

   const uploadImage = async () => {
    /*service firebase.storage {
        match /b/{bucket}/o {
          match /{allPaths=**} {
            allow read;
            allow write: if
            request.resource.size < 2*1024 * 1024 &&
            request.resource.contentType.matches('image/.*')
          }
        }*/
          setImageFileUploading(true);
          setImageFileUploadError(null);
    const storage = getStorage(app);//app is the firebase app we created in the firebase.js file so when we want to use the storage we need to import it from the firebase storage and then we need to pass the app to it

    // const fileName =  imageFile.name;//this will throw error if we upload image 2 times with the same name so we need to generate a unique name for the image
    const fileName =  new Date().getTime() +imageFile.name;//now this keeps the name unique 

    const storageRef = ref(storage,fileName);//this is the root reference of the storage

    //upload task-> this is the task that will upload the image to the storage

    const uploadTask = uploadBytesResumable(storageRef,imageFile);//this will upload the image to the storage
    uploadTask.on(
        'state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageFileUploadProgress(progress.toFixed(0));//toFixed(0) will round the number to the nearest whole number
            },
            (error) => {
                setImageFileUploadError("Could not upload the image(File must be less than 2MB)");
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileURL(null);
                setImageFileUploading(false);
            },
            () => {
                // Handle successful uploads on complete
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileURL(downloadURL);
                    setFormData({...formData,profilePicture:downloadURL});
                    setImageFileUploading(false);
                }
            );
            }
        );
    };
    const handleChange = (e) => {
        setFormData({...formData,[e.target.id]:e.target.value});
        //keep the other form data as it is and update the form data with the new value where e.target.id is the id of the input field and e.target.value is the value of the input field
    };
    const handleSubmit = async (e) => {
        //this will prevent the form from refreshing the page
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if(Object.keys(formData).length === 0){
            setUpdateUserError("No changes made");
            return;
        }
        if(imageFileUploading){
            setUpdateUserError("Image is being uploaded");
            return;
        }
        try {
            dispatch(updateStart());
            //we need to update the user in the database
            //we need to update the user in the redux store
            const res = await fetch(`/api/user/update/${currentUser._id}`,{ 
                method:'PUT',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(formData),
            });
            const data = await res.json();
            if(!res.ok){
               dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            }else{
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User updated successfully");
            }
            
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input type="file" accept = 'image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
            <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=>{
                filePickerRef.current.click();
            }}>

            {imageFileUploadProgress && (
                <CircularProgressbar
                 value = {imageFileUploadProgress || 0} 
                text={'${imageFileUploadingProgress}%'}
                    strokeWidth={5}
                    styles={{
                        root:{
                            width:'100%',
                            height:'100%',
                            position:'absolute',
                            top:0,
                            left:0,
                        },
                        path:{
                            stroke: `rgba(62, 152, 199, ${
                                imageFileUploadProgress / 100
                              })`,
                        },
                    }}
                />
            )
            }
            <img src={imageFileURL || currentUser.profilePicture} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress<100 && 'opacity-55'}`} />
            </div>
            {imageFileUploadError &&
            <Alert color='failure'>
                {imageFileUploadError}
            </Alert>
            }
            <TextInput type = 'text' id='username'
            placeholder='username'
            defaultValue={currentUser.username} onChange={handleChange}/>

            <TextInput type = 'email' id='email'
            placeholder='email'
            defaultValue={currentUser.email} onChange={handleChange}/>

            <TextInput type = 'password' id='password'
            placeholder='password'
            />
            <Button type='submit' gradientDuoTone='purpleToPink' outline>
                Update
                </Button>   
        </form>
        <div className='text-red-500 flex justify-between mt-5'>
            <span className='cursor-pointer'>
                Delete Account
            </span>
            <span className='cursor-pointer'>
                Sign Out
            </span>
        </div>
        {updateUserSuccess && (
            <Alert color='success' className='mt-5'>
                {updateUserSuccess}
            </Alert>
        )}
        {updateUserError && (
            <Alert color='failure' className='mt-5'>
                {updateUserError}
            </Alert>
        )}
    </div>
  );
};

/*in order to keep the aspect ration of the image we use object-cover so if someone uploads a rectangular image it will be cropped to be a square*/

//useEffect react hook : so any time new image is uploaded we want to convert it to a URL so that we can display it in the image tag

//now we are going to firebase and activate our storage get the info and then we are going to upload the image to the firebase storage