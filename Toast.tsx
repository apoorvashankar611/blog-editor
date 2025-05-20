import React, { useEffect, useState } from 'react';
import { SaveStatus } from '../types';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ToastProps {
  status: SaveStatus;
}

const Toast: React.FC<ToastProps> = ({ status }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (status === 'idle') {
      setVisible(false);
      return;
    }
    
    setVisible(true);
  }, [status]);
  
  if (!visible) return null;
  
  const getToastContent = () => {
    switch (status) {
      case 'saving':
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-white" />
            <span>Saving...</span>
          </>
        );
      case 'saved':
        return (
          <>
            <CheckCircle className="h-4 w-4 text-white" />
            <span>Saved</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="h-4 w-4 text-white" />
            <span>Error saving</span>
          </>
        );
      default:
        return null;
    }
  };
  
  const getToastColor = () => {
    switch (status) {
      case 'saving':
        return 'bg-blue-600';
      case 'saved':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-gray-700';
    }
  };
  
  return (
    <div className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm transition-all ${getToastColor()}`}>
      {getToastContent()}
    </div>
  );
};

export default Toast;