"use client";

import React from "react";
import MDEditor from "@uiw/react-md-editor";

const CoverLetterPreview = ({ content }) => {
  return (
    <div className="relative p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Page dots decoration */}
      <div className="absolute top-5 left-5 flex space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-400 opacity-70"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-70"></div>
        <div className="w-3 h-3 rounded-full bg-green-400 opacity-70"></div>
      </div>
      
      <div className="prose prose-blue dark:prose-invert max-w-full overflow-auto pt-4 pb-2">
        <MDEditor 
          value={content} 
          preview="preview" 
          height={700}
          previewOptions={{
            className: "bg-transparent border-none shadow-none"
          }}
          hideToolbar={true}
          className="!border-none !bg-transparent !shadow-none"
        />
      </div>
      
      {/* Watermark */}
      <div className="absolute bottom-4 right-6 text-xs text-muted-foreground opacity-70">
        Created with MyCareerAI
      </div>
    </div>
  );
};

export default CoverLetterPreview;