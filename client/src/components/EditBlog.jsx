import { Button, TextInput, Select } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const categories = [
    'Technology',
    'Business',
    'Travel',
    'Food',
    'Lifestyle',
    'Health',
    'Education',
    'Entertainment',
    'Other'
];

export default function EditBlog() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Technology',
        image: ''
    });
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch existing blog post
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch all posts and find the one with matching ID
                const res = await fetch(`/api/post/getposts`);
                
                if (!res.ok) {
                    setError('Failed to fetch posts');
                    return;
                }
                
                const data = await res.json();
                const post = data.posts?.find(p => p._id === postId);
                
                if (!post) {
                    setError('Blog post not found');
                    return;
                }

                // Check if current user is the author
                if (post.userId !== currentUser._id) {
                    setError('You are not authorized to edit this blog');
                    return;
                }

                setFormData({
                    title: post.title,
                    description: post.content,
                    category: post.category,
                    image: post.image
                });
                setImagePreview(post.image);
            } catch (error) {
                console.error('Error fetching post:', error);
                setError('Error loading blog post: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        if (postId && currentUser) {
            fetchPost();
        }
    }, [postId, currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const imageUrl = e.target.value;
        setFormData({
            ...formData,
            image: imageUrl
        });
        setImagePreview(imageUrl);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.title || !formData.description || !formData.image) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`/api/post/updatepost/${postId}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: formData.title,
                    content: formData.description,
                    category: formData.category,
                    image: formData.image
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Failed to update blog');
                return;
            }

            // data is the post object directly, not wrapped in data.post
            navigate(`/blog/${data.slug}`);
        } catch (error) {
            console.error('Error updating post:', error);
            setError('Error updating blog: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData.title) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Edit Blog</h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Blog Title
                        </label>
                        <TextInput
                            type="text"
                            name="title"
                            placeholder="Enter blog title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Image URL
                        </label>
                        <TextInput
                            type="url"
                            name="image"
                            placeholder="Enter image URL"
                            value={formData.image}
                            onChange={handleImageChange}
                            required
                        />
                        {imagePreview && (
                            <div className="mt-4">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-lg"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Category
                        </label>
                        <Select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </Select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="Write your blog content here..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={10}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            gradientDuoTone="purpleToBlue"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? 'Updating...' : 'Update Blog'}
                        </Button>
                        <Button
                            type="button"
                            color="gray"
                            onClick={() => navigate(-1)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
