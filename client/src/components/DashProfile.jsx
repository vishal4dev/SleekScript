import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getStorage } from 'firebase/storage';
import { app } from '../firebase.js';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutSuccess
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function DashProfile() {
    const { currentUser, error, loading } = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileURL, setImageFileURL] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [userStats, setUserStats] = useState({ blogs: 0, likes: 0 });
    const [statsLoading, setStatsLoading] = useState(true);

    const filePickerRef = useRef(null);
    const dispatch = useDispatch();

    // Fetch user statistics
    useEffect(() => {
        if (currentUser) {
            fetchUserStats();
        }
    }, [currentUser]);

    const fetchUserStats = async () => {
        try {
            setStatsLoading(true);
            // Fetch user's blogs
            const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
            const data = await res.json();
            
            if (res.ok && data.posts) {
                const totalBlogs = data.posts.length;
                const totalLikes = data.posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
                setUserStats({ blogs: totalBlogs, likes: totalLikes });
            }
        } catch (error) {
            console.log('Error fetching user stats:', error.message);
        } finally {
            setStatsLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileURL(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = async () => {
        setImageFileUploading(true);
        setImageFileUploadError(null);
        
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadError('Could not upload image (File must be less than 2MB)');
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileURL(null);
                setImageFileUploading(false);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setImageFileURL(downloadURL);
                setFormData({ ...formData, profilePicture: downloadURL });
                setImageFileUploading(false);
                setImageFileUploadProgress(null);
            }
        );
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);

        if (Object.keys(formData).length === 0) {
            setUpdateUserError('No changes made');
            return;
        }

        if (imageFileUploading) {
            setUpdateUserError('Please wait for image to upload');
            return;
        }

        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (!res.ok) {
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User's profile updated successfully");
                setFormData({});
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message));
            } else {
                dispatch(deleteUserSuccess(data));
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

            {/* User Statistics Section */}
            <div className="mb-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Stats</h2>
                {statsLoading ? (
                    <p className="text-gray-600 dark:text-gray-400">Loading stats...</p>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Blogs</p>
                            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{userStats.blogs}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Likes</p>
                            <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">{userStats.likes}</p>
                        </div>
                        <div className="col-span-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Member Since</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div
                    onClick={() => filePickerRef.current.click()}
                    className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                >
                    {imageFileUploadProgress && (
                        <CircularProgressbar
                            value={imageFileUploadProgress}
                            text={`${imageFileUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                },
                                path: {
                                    stroke: `rgba(62, 252, 148, ${imageFileUploadProgress / 100})`,
                                },
                            }}
                        />
                    )}
                    <img
                        src={imageFileURL || currentUser.profilePicture}
                        alt="user"
                        className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'
                            }`}
                    />
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={filePickerRef}
                    hidden
                />
                {imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>}
                <TextInput
                    type="text"
                    id="username"
                    placeholder="username"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />
                <TextInput
                    type="email"
                    id="email"
                    placeholder="email"
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <TextInput
                    type="password"
                    id="password"
                    placeholder="password"
                    onChange={handleChange}
                />
                <Button
                    type="submit"
                    gradientDuoTone="purpleToBlue"
                    outline
                    disabled={loading || imageFileUploading}
                >
                    {loading ? 'Loading...' : 'Update'}
                </Button>
                {currentUser.isAdmin && (
                    <Link to="/create-post">
                        <Button
                            type="button"
                            gradientDuoTone="purpleToPink"
                            className="w-full"
                        >
                            Create a post
                        </Button>
                    </Link>
                )}
            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span
                    onClick={() => setShowModal(true)}
                    className="cursor-pointer"
                >
                    Delete Account
                </span>
                <span className="cursor-pointer" onClick={handleSubmit}>
                    Sign Out
                </span>
            </div>
            {updateUserSuccess && (
                <Alert color="success" className="mt-5">
                    {updateUserSuccess}
                </Alert>
            )}
            {updateUserError && (
                <Alert color="failure" className="mt-5">
                    {updateUserError}
                </Alert>
            )}
            {error && (
                <Alert color="failure" className="mt-5">
                    {error}
                </Alert>
            )}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size="md"
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete your account?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDeleteUser}>
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}