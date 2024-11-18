import React, { useState, useEffect, useRef } from 'react';

export const Popover = ({ open, onOpenChange, children }) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <div className="relative">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { open: isOpen, onOpenChange: handleOpenChange })
      )}
    </div>
  );
};

export const PopoverTrigger = ({ asChild, children, open, onOpenChange }) => {
  return React.cloneElement(children, {
    onClick: () => onOpenChange?.(!open),
  });
};

export const PopoverContent = ({ className = "", children }) => {
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      className={`z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none ${className}`}
    >
      {children}
    </div>
  );
};