import React, { useEffect, useState } from 'react';
import { Blog } from '../types';
import { getBlogs } from '../services/api';
import BlogCard from './BlogCard';
import { FileText, FileEdit, Loader2 } from 'lucide-react';

interface BlogListProps {
  onSelectBlog: (id: string) => void;
}

const BlogList: React.FC<BlogListProps> = ({ onSelectBlog }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'drafts' | 'published'>('all');
  
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);
  
  const filteredBlogs = blogs.filter(blog => {
    if (activeTab === 'all') return true;
    return blog.status === activeTab.slice(0, -1); // Remove 's' from 'drafts' or 'published'
  });
  
  const getTabClass = (tab: typeof activeTab) => {
    return `px-4 py-2 font-medium text-sm transition-colors ${
      activeTab === tab 
        ? 'text-blue-600 border-b-2 border-blue-600' 
        : 'text-gray-600 hover:text-blue-600'
    }`;
  };
  
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading blogs...</p>
      </div>
    );
  }
  
  return (
    <div className="h-full">
      <div className="flex border-b mb-6">
        <button
          className={getTabClass('all')}
          onClick={() => setActiveTab('all')}
        >
          All Blogs
        </button>
        <button
          className={getTabClass('drafts')}
          onClick={() => setActiveTab('drafts')}
        >
          <FileEdit className="h-4 w-4 inline mr-1" />
          Drafts
        </button>
        <button
          className={getTabClass('published')}
          onClick={() => setActiveTab('published')}
        >
          <FileText className="h-4 w-4 inline mr-1" />
          Published
        </button>
      </div>
      
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No blogs found</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => onSelectBlog('new')}
          >
            Create a new blog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          {filteredBlogs.map(blog => (
            <BlogCard 
              key={blog.id} 
              blog={blog} 
              onClick={onSelectBlog}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;