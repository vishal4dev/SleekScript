import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdEdit, MdDelete } from 'react-icons/md';

export default function Projects() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/sign-in');
      return;
    }

    const fetchUserBlogs = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Failed to fetch your blogs');
          setLoading(false);
          return;
        }

        setBlogs(data.posts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [currentUser, navigate]);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      const res = await fetch(`/api/post/deletepost/${postId}/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        alert('Failed to delete blog');
        return;
      }

      setBlogs(blogs.filter((blog) => blog._id !== postId));
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Error deleting blog');
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Blogs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and view all your published blogs
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading your blogs...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && blogs.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No blogs yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't created any blogs yet. Start creating one now!
            </p>
            <button
              onClick={() => navigate('/add-blog')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition"
            >
              Create Your First Blog
            </button>
          </div>
        )}

        {!loading && blogs.length > 0 && (
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/blog/${blog.slug}`)}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        {blog.title}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/edit-blog/${blog._id}`)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition"
                        >
                          <MdEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm transition"
                        >
                          <MdDelete /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
