import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Signin from "./Signin";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Projects from "./Projects";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoutes from "./components/PrivateRoutes";
import AddBlog from "./components/AddBlog";
import EditBlog from "./components/EditBlog";
import BlogDetail from "./components/BlogDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route element = {<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-blog" element={<AddBlog />} />
          <Route path="/edit-blog/:postId" element={<EditBlog />} />
        </Route>
        <Route path="/projects" element={<Projects />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
