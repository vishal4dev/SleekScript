import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { MdEdit, MdDelete } from 'react-icons/md';

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?slug=${slug}`);
        const data = await res.json();
        
        if (!res.ok || data.posts.length === 0) {
          setError('Blog not found');
          setLoading(false);
          return;
        }

        const blogPost = data.posts[0];
        setPost(blogPost);
        setLikeCount(blogPost.likes.length);
        
        if (currentUser) {
          setIsLiked(blogPost.likes.includes(currentUser._id));
        }

        // Fetch author info
        try {
          const authorRes = await fetch(`/api/user/${blogPost.userId}`);
          const authorData = await authorRes.json();
          setAuthor(authorData);
        } catch (err) {
          console.log('Could not fetch author');
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, currentUser]);

  const handleLike = async () => {
    if (!currentUser) {
      navigate('/sign-in');
      return;
    }

    try {
      const res = await fetch(`/api/post/like/${post._id}`, {
        method: 'PUT',
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Failed to like post');
        return;
      }

      setIsLiked(!isLiked);
      setLikeCount(data.likes.length);
      setPost(data);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      const res = await fetch(
        `/api/post/deletepost/${post._id}/${currentUser._id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!res.ok) {
        console.error('Failed to delete post');
        return;
      }

      navigate('/');
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Blog not found</div>
      </div>
    );
  }

  const isAuthor = currentUser && currentUser._id === post.userId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Image */}
      <div className="w-full h-96 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1200x400?text=Blog+Image';
          }}
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b dark:border-gray-700">
            {author && (
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={author.profilePicture}
                  alt={author.username}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {author.username}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-start sm:justify-end">
              <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium whitespace-nowrap">
                {post.category}
              </span>
            </div>
          </div>

          {/* Like and Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {isLiked ? (
                <AiFillHeart className="text-red-500 text-xl" />
              ) : (
                <AiOutlineHeart className="text-gray-600 dark:text-gray-400 text-xl" />
              )}
              <span className="text-gray-700 dark:text-gray-300">{likeCount}</span>
            </button>

            {isAuthor && (
              <>
                <button
                  onClick={() => navigate(`/edit-blog/${post._id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <MdEdit /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <MdDelete /> Delete
                </button>
              </>
            )}
          </div>

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
