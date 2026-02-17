import React from "react";

const ImageModal = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border-4 border-border shadow-brutal w-full max-w-5xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b-4 border-border bg-surface-primary">
          <h3 className="font-bold text-text-primary uppercase tracking-wider text-sm md:text-base truncate pr-4">
            {image.title}
          </h3>
          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-primary text-white hover:bg-white hover:text-primary px-4 py-2 text-sm font-bold uppercase tracking-widest border-2 border-transparent hover:border-border transition-all"
          >
            <span>✕</span>
            Close
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-4 md:p-8 overflow-hidden bg-white flex items-center justify-center">
          <img
            src={image.img}
            alt={image.title}
            className="max-w-full max-h-[70vh] object-contain border-2 border-border shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
