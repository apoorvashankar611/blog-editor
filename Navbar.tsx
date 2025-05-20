import React from 'react';
import { FileType2, PlusCircle } from 'lucide-react';

interface NavbarProps {
  onNewBlog: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNewBlog }) => {
  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <FileType2 className="h-6 w-6 text-blue-600 mr-2" />
        <h1 className="text-xl font-semibold text-gray-800">BlogEditor</h1>
      </div>
      
      <button
        onClick={onNewBlog}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        New Blog
      </button>
    </nav>
  );
};

export default Navbar;