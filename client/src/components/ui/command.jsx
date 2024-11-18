import React from 'react';

export const Command = React.forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

export const CommandInput = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <div className="flex items-center border-b px-3">
      <input
        ref={ref}
        className={`flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    </div>
  );
});

export const CommandEmpty = React.forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`py-6 text-center text-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

export const CommandGroup = React.forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`overflow-hidden p-1 text-foreground ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

export const CommandItem = React.forwardRef(({ className = "", children, onSelect, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground ${className}`}
      onClick={onSelect}
      {...props}
    >
      {children}
    </div>
  );
});
