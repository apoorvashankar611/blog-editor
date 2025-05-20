import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BlogList from './components/BlogList';
import BlogEditor from './components/BlogEditor';
import { Blog } from './types';

function App() {
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectBlog = (id: string) => {
    setSelectedBlogId(id === 'new' ? 'new' : id);
  };

  const handleBack = () => {
    setSelectedBlogId(null);
    // Trigger a refresh of the blog list
    setRefreshKey(prev => prev + 1);
  };

  const handleSave = (_blog: Blog) => {
    // This will be called after a save operation
    // We don't need to do anything special here since the API service
    // is already updating localStorage
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNewBlog={() => handleSelectBlog('new')} />
      
      <main className="container mx-auto px-4 py-8">
        {selectedBlogId ? (
          <BlogEditor
            blogId={selectedBlogId}
            onBack={handleBack}
            onSave={handleSave}
          />
        ) : (
          <div key={refreshKey}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Blogs</h2>
            <BlogList onSelectBlog={handleSelectBlog} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;