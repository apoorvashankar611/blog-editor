import React, { KeyboardEvent, useState } from 'react';
import { Tag, X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };
  
  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      const newTags = [...tags, trimmedValue];
      onChange(newTags);
      setInputValue('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    onChange(newTags);
  };
  
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <div 
            key={index} 
            className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
          >
            <Tag className="w-3 h-3 mr-1" />
            <span>{tag}</span>
            <button 
              onClick={() => removeTag(tag)}
              className="ml-1 p-1 rounded-full hover:bg-blue-200 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      
      <div className="relative">
        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder="Add tags (press Enter or , to add)"
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Press Enter or comma (,) after each tag
      </p>
    </div>
  );
};

export default TagInput;