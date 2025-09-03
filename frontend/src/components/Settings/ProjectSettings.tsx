import React, { useState, useRef, useEffect } from 'react';

import {SettingsDropdownProps} from '@/constants/interfaces';

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  isOpen,
  onClose,
  onSaveAsTemplate,
  buttonRef
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 200; // Approximate dropdown width
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let left = buttonRect.right - dropdownWidth;
      let top = buttonRect.bottom + 8;

      // Adjust if dropdown goes off-screen horizontally
      if (left < 8) {
        left = buttonRect.left;
      }
      if (left + dropdownWidth > viewportWidth - 8) {
        left = viewportWidth - dropdownWidth - 8;
      }

      // Adjust if dropdown goes off-screen vertically
      if (top + 100 > viewportHeight - 8) { // 100 is approximate dropdown height
        top = buttonRect.top - 100 - 8;
      }

      setPosition({ top, left });
    }
  }, [isOpen, buttonRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for mobile */}
      <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={onClose} />
      
      {/* Dropdown */}
      <div
        ref={dropdownRef}
        className="fixed z-50 w-48 sm:w-52"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`
        }}
      >
        <div className="bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Project Settings</h3>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/5 rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                onSaveAsTemplate();
                onClose();
              }}
              className="w-full px-4 py-3 text-left text-sm text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center space-x-3 group"
            >
              <div className="flex-shrink-0 w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Save as Template</div>
                <div className="text-xs text-white/50 mt-0.5">Create a reusable project template</div>
              </div>
            </button>

            {/* You can add more menu items here */}
            <div className="h-px bg-white/10 mx-2 my-2" />
            
            <button
              onClick={() => {
                // Add more actions here
                onClose();
              }}
              className="w-full px-4 py-3 text-left text-sm text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center space-x-3 group"
            >
              <div className="flex-shrink-0 w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707v6.586a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Export Project</div>
                <div className="text-xs text-white/50 mt-0.5">Download project data</div>
              </div>
            </button>

            <button
              onClick={() => {
                // Add more actions here
                onClose();
              }}
              className="w-full px-4 py-3 text-left text-sm text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center space-x-3 group"
            >
              <div className="flex-shrink-0 w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Project Settings</div>
                <div className="text-xs text-white/50 mt-0.5">Configure project preferences</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsDropdown;