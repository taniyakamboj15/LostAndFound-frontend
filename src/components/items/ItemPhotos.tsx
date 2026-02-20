import { useState } from 'react';
import { Package, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@components/ui';
import { UploadedFile } from '../../types/item.types';
import { API_BASE_URL } from '../../constants/api';

interface ItemPhotosProps {
  photos: UploadedFile[];
  itemTitle: string;
}

const ItemPhotos = ({ photos, itemTitle }: ItemPhotosProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<number>(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setSelectedPhoto((prev) => (prev + newDirection + photos.length) % photos.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="space-y-4">
      <Card className="p-0 overflow-hidden relative border-none shadow-lg bg-gray-50 group">
        {/* Main Photo Container */}
        <div className="aspect-[16/10] relative flex items-center justify-center overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            {photos && photos.length > 0 && photos[selectedPhoto] ? (
              <motion.img
                key={selectedPhoto}
                src={photos[selectedPhoto].path.startsWith('http') ? photos[selectedPhoto].path : `${API_BASE_URL}/${photos[selectedPhoto].path}`}
                alt={`${itemTitle} - Photo ${selectedPhoto + 1}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="w-full h-full object-contain pointer-events-none"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <Package className="h-20 w-20 stroke-[1]" />
                <p className="mt-4 font-medium">No Image Available</p>
              </div>
            )}
          </AnimatePresence>

          {/* Controls Overlay */}
          {photos && photos.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-md text-gray-800 hover:bg-white transition-all z-10 opacity-0 group-hover:opacity-100"
                onClick={() => paginate(-1)}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-md text-gray-800 hover:bg-white transition-all z-10 opacity-0 group-hover:opacity-100"
                onClick={() => paginate(1)}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              
              {/* Counter Indicator */}
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-bold z-10">
                {selectedPhoto + 1} / {photos.length}
              </div>
            </>
          )}

          {/* Fullscreen indicator - cosmetic hint */}
          <div className="absolute top-4 right-4 p-2 rounded-lg bg-black/20 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="h-4 w-4" />
          </div>
        </div>
      </Card>

      {/* Thumbnail Gallery */}
      {photos && photos.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {photos.map((photo: UploadedFile, index: number) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setDirection(index > selectedPhoto ? 1 : -1);
                setSelectedPhoto(index);
              }}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                selectedPhoto === index 
                ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' 
                : 'border-transparent hover:border-gray-300 grayscale-[0.5] hover:grayscale-0'
              }`}
            >
              <img
                src={photo.path.startsWith('http') ? photo.path : `${API_BASE_URL}/${photo.path}`}
                alt={photo.filename}
                className="w-full h-full object-cover"
              />
              {selectedPhoto === index && (
                <div className="absolute inset-0 bg-blue-500/10" />
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemPhotos;
