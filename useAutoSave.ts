import { useEffect, useRef, useState } from 'react';
import { Blog, SaveStatus } from '../types';
import { saveBlog } from '../services/api';

interface AutoSaveProps {
  blog: Blog;
  onSave?: (blog: Blog) => void;
  debounceTime?: number;
}

export const useAutoSave = ({ blog, onSave, debounceTime = 5000 }: AutoSaveProps) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const timerRef = useRef<number | null>(null);
  const lastSavedRef = useRef<string>('');

  const getBlogSignature = (blog: Blog): string => {
    return `${blog.title}|${blog.content}|${blog.tags.join(',')}`;
  };

  const save = async (blogToSave: Blog) => {
    const blogSignature = getBlogSignature(blogToSave);
    
    // Only save if content has changed since last save
    if (blogSignature !== lastSavedRef.current) {
      setSaveStatus('saving');
      try {
        const savedBlog = await saveBlog({ ...blogToSave, status: 'draft' });
        lastSavedRef.current = blogSignature;
        setSaveStatus('saved');
        if (onSave) onSave(savedBlog);
        
        // Reset saved status after 3 seconds
        setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      } catch (error) {
        setSaveStatus('error');
        console.error('Error saving draft:', error);
      }
    }
  };

  const debouncedSave = (blogToSave: Blog) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    
    timerRef.current = window.setTimeout(() => {
      save(blogToSave);
    }, debounceTime);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { saveStatus, debouncedSave, save };
};