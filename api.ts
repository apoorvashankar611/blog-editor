import { Blog } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all blogs from localStorage
export const getBlogs = async (): Promise<Blog[]> => {
  await delay(300); // Simulate network delay
  const blogs = localStorage.getItem('blogs');
  return blogs ? JSON.parse(blogs) : [];
};

// Get a single blog by ID
export const getBlogById = async (id: string): Promise<Blog | null> => {
  await delay(200);
  const blogs = await getBlogs();
  return blogs.find((blog: Blog) => blog.id === id) || null;
};

// Save or update a blog
export const saveBlog = async (blog: Blog): Promise<Blog> => {
  await delay(500);
  const blogs = await getBlogs();
  const existingIndex = blogs.findIndex((b: Blog) => b.id === blog.id);
  
  if (existingIndex >= 0) {
    blogs[existingIndex] = {
      ...blog,
      updatedAt: new Date().toISOString()
    };
  } else {
    blogs.push({
      ...blog,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem('blogs', JSON.stringify(blogs));
  return blog;
};

// Delete a blog
export const deleteBlog = async (id: string): Promise<void> => {
  await delay(300);
  const blogs = await getBlogs();
  localStorage.setItem('blogs', JSON.stringify(blogs.filter((b: Blog) => b.id !== id)));
};