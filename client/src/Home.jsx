import { useState, useEffect } from 'react';
import BlogCard from './components/BlogCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let url = '/api/post/getposts';
        const params = [];
        
        if (searchTerm) params.push(`searchTerm=${searchTerm}`);
        if (category) params.push(`category=${category}`);

        if (params.length > 0) {
          url += '?' + params.join('&');
        }

        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Failed to fetch blogs');
          setLoading(false);
          return;
        }

        setPosts(data.posts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchTerm, category]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to SleekScript</h1>
          <p className="text-xl text-indigo-100 mb-8">
            Discover amazing stories, insights, and ideas from our community
          </p>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Categories</option>
              <option value="technology">Technology</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="travel">Travel</option>
              <option value="food">Food</option>
              <option value="business">Business</option>
              <option value="education">Education</option>
              <option value="health">Health</option>
              <option value="entertainment">Entertainment</option>
              <option value="uncategorized">Uncategorized</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading blogs...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No blogs found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Be the first to create a blog. Click "Add Blog" in the navigation!
            </p>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} onLike={() => {}} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
