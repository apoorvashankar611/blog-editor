import React from 'react';
import { Blog } from '../types';
import { CalendarIcon, Clock, Tag } from 'lucide-react';

interface BlogCardProps {
  blog: Blog;
  onClick: (id: string) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 cursor-pointer"
      onClick={() => onClick(blog.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-gray-800">
          {blog.title || 'Untitled'}
        </h3>
        <span className={`px-2 py-1 text-xs rounded-full ${
          blog.status === 'published' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {blog.status === 'published' ? 'Published' : 'Draft'}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 min-h-[60px]">
        {truncateContent(blog.content) || 'No content'}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {blog.tags.map((tag, index) => (
          <span 
            key={index} 
            className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
          >
            <Tag className="w-3 h-3 mr-1" />
            {tag}
          </span>
        ))}
        {blog.tags.length === 0 && (
          <span className="text-gray-400 text-sm italic">No tags</span>
        )}
      </div>
      
      <div className="flex justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
        <span className="flex items-center">
          <CalendarIcon className="w-4 h-4 mr-1" />
          Created: {formatDate(blog.createdAt)}
        </span>
        <span className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          Updated: {formatDate(blog.updatedAt)}
        </span>
      </div>
    </div>
  );
};

export default BlogCard;