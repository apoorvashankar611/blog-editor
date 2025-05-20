import React, { useEffect, useState } from 'react';
import { Blog, SaveStatus } from '../types';
import { useAutoSave } from '../hooks/useAutoSave';
import { getBlogById, saveBlog } from '../services/api';
import Toast from './Toast';
import TagInput from './TagInput';
import { ArrowLeft, Save, Send } from 'lucide-react';

interface BlogEditorProps {
  blogId: string | null;
  onBack: () => void;
  onSave: (blog: Blog) => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ blogId, onBack, onSave }) => {
  const [blog, setBlog] = useState<Blog>({
    id: '',
    title: '',
    content: '',
    tags: [],
    status: 'draft',
    createdAt: '',
    updatedAt: ''
  });
  
  const [loading, setLoading] = useState(blogId !== 'new');
  
  const { saveStatus, debouncedSave, save } = useAutoSave({
    blog,
    onSave: (savedBlog) => {
      if (!blog.id && savedBlog.id) {
        setBlog(prevBlog => ({ ...prevBlog, id: savedBlog.id }));
      }
      onSave(savedBlog);
    }
  });
  
  useEffect(() => {
    const loadBlog = async () => {
      if (blogId && blogId !== 'new') {
        try {
          const loadedBlog = await getBlogById(blogId);
          if (loadedBlog) {
            setBlog(loadedBlog);
          }
        } catch (error) {
          console.error('Error loading blog:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadBlog();
  }, [blogId]);
  
  useEffect(() => {
    if (blog.id) {
      debouncedSave(blog);
    }
  }, [blog.title, blog.content, blog.tags]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlog(prev => ({ ...prev, title: e.target.value }));
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBlog(prev => ({ ...prev, content: e.target.value }));
  };
  
  const handleTagsChange = (newTags: string[]) => {
    setBlog(prev => ({ ...prev, tags: newTags }));
  };
  
  const handlePublish = async () => {
    try {
      const publishedBlog = await saveBlog({ ...blog, status: 'published' });
      onSave(publishedBlog);
      onBack();
    } catch (error) {
      console.error('Error publishing blog:', error);
    }
  };
  
  const handleSaveClick = async () => {
    await save(blog);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack} 
          className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800 flex-grow">
          {blog.id ? 'Edit Blog' : 'Create New Blog'}
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={handleSaveClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </button>
          <button
            onClick={handlePublish}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <Send className="w-4 h-4 mr-2" />
            Publish
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <input
            type="text"
            value={blog.title}
            onChange={handleTitleChange}
            placeholder="Enter blog title..."
            className="w-full px-4 py-3 text-2xl font-serif border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
        
        <div>
          <textarea
            value={blog.content}
            onChange={handleContentChange}
            placeholder="Write your blog content here..."
            className="w-full px-4 py-3 min-h-[400px] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-sans"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <TagInput 
            tags={blog.tags} 
            onChange={handleTagsChange} 
          />
        </div>
      </div>
      
      <Toast status={saveStatus} />
    </div>
  );
};

export default BlogEditor;