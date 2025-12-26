import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { useState } from 'react';

export default function BlogCard({ post, onLike }) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser?._id));
  const [likeCount, setLikeCount] = useState(post.likes.length);

  const handleLike = async (e) => {
    e.stopPropagation();

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
        return;
      }

      setIsLiked(!isLiked);
      setLikeCount(data.likes.length);
      onLike && onLike();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div
      onClick={() => navigate(`/blog/${post.slug}`)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl overflow-hidden transition-shadow cursor-pointer h-full"
    >
      {/* Image */}
      <div className="overflow-hidden h-48">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Blog+Image';
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="mb-2">
          <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {post.title}
        </h3>

        {/* Description with Read More */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {truncateText(post.content, 100)}
        </p>

        {/* Read More Link */}
        <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4 hover:underline">
          Read More →
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t dark:border-gray-700">
          {/* Date */}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-500 transition"
          >
            {isLiked ? (
              <AiFillHeart className="text-red-500 text-lg" />
            ) : (
              <AiOutlineHeart className="text-lg" />
            )}
            <span className="text-sm">{likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
