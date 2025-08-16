import { useState } from 'react';
import useClickOutside from '../hooks/useClickOutside';

export default function DropdownMenu({ children, trigger }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));

  return (
    <div className="dropdown-container" ref={ref}>
      <button 
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {trigger}
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          {children}
        </div>
      )}
    </div>
  );
}