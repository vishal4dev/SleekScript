import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
    const path = useLocation().pathname;
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { theme } = useSelector(state => state.theme);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/auth/signout', {
                method: 'POST',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    return (
        <Navbar className="border-b-2">
            {/* Left - Logo */}
            <Link
                to="/"
                className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
            >
                <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                    Sleek
                </span>
                Script
            </Link>

            {/* Right - Search, Theme Toggle, User Menu */}
            <div className="flex gap-3 md:order-2 items-center">
                {/* Search - Hidden on mobile */}
                <form onSubmit={handleSubmit} className="hidden lg:flex">
                    <TextInput
                        type="text"
                        placeholder="Search..."
                        rightIcon={AiOutlineSearch}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-48"
                    />
                </form>

                {/* Search Mobile Button */}
                <Button className="w-12 h-10 lg:hidden" color="gray" pill onClick={handleSubmit}>
                    <AiOutlineSearch />
                </Button>

                {/* Theme Toggle */}
                <Button
                    className="w-12 h-10 hidden sm:inline"
                    color="gray"
                    pill
                    onClick={() => dispatch(toggleTheme())}
                >
                    {theme === 'light' ? <FaSun /> : <FaMoon />}
                </Button>

                {/* User Dropdown or Sign In */}
                {currentUser ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar
                                alt='user'
                                img={currentUser.profilePicture}
                                rounded
                            />
                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">@{currentUser.username}</span>
                            <span className="block text-sm font-medium truncate">{currentUser.email}</span>
                        </Dropdown.Header>
                        <Link to={'/dashboard?tab=profile'}>
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleSignout}>
                            Sign Out
                        </Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to="/sign-in">
                        <Button gradientDuoTone="purpleToBlue" outline>
                            Sign In
                        </Button>
                    </Link>
                )}

                {/* Mobile Menu Toggle */}
                <Navbar.Toggle />
            </div>

            {/* Center - Navigation Links */}
            <Navbar.Collapse className="w-full">
                <div className="flex w-full justify-center gap-8">
                    <Navbar.Link active={path === "/"} as={"div"}>
                        <Link to="/">Home</Link>
                    </Navbar.Link>
                    <Navbar.Link active={path === "/about"} as={"div"}>
                        <Link to="/about">About</Link>
                    </Navbar.Link>
                    {currentUser && (
                        <Navbar.Link active={path === "/add-blog"} as={"div"}>
                            <Link to="/add-blog">Add Blog</Link>
                        </Navbar.Link>
                    )}
                    <Navbar.Link active={path === "/projects"} as={"div"}>
                        <Link to="/projects">Projects</Link>
                    </Navbar.Link>
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
}