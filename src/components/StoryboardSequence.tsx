import React, { useState } from 'react';
import { Button } from "./ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "./ui/input";
import { generateImages, generateVideo } from '../utils/falAi';
import { Card, CardContent, CardFooter } from "./ui/card";

interface StoryboardSequenceProps {
  images: string[]
  onDelete?: () => void
  onSave?: () => void
  showControls: boolean
  onUpdateImage: (oldImageUrl: string, newImageUrl: string) => void
}

const StoryboardSequence: React.FC<StoryboardSequenceProps> = ({ 
  images, 
  onDelete, 
  onSave, 
  showControls, 
  onUpdateImage
}) => {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    if (expandedImage === imageUrl) {
      setExpandedImage(null);
    } else {
      setExpandedImage(imageUrl);
      setGeneratedVideoUrl(null); 
    }
  };

  const handleGenerateImage = async () => {
    if (!expandedImage || !imagePrompt) return;
    
    setIsGeneratingImage(true);
    try {
      const newImages = await generateImages(imagePrompt);
      if (newImages.length > 0) {
        onUpdateImage(expandedImage, newImages[0]);
        setExpandedImage(null);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!expandedImage || !videoPrompt) return;
    
    setIsGeneratingVideo(true);
    try {
      const videoUrl = await generateVideo(videoPrompt, expandedImage);
      setGeneratedVideoUrl(videoUrl);
      onUpdateImage(expandedImage, videoUrl); 
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const GenerationSection = ({title, prompt, placeholder, onGenerate, isGenerating, children}: {title: string, prompt: string, placeholder: string, onGenerate: () => void, isGenerating: boolean, children: React.ReactNode}) => {
    return (
      <Card className="h-full bg-black border-0 shadow-lg flex flex-col overflow-hidden">
        <CardContent className="flex-grow flex flex-col justify-center p-0">
          {children}
        </CardContent>
        <CardFooter className="bg-black p-4 flex flex-col space-y-2">
          <Input
            value={prompt}
            onChange={(e) => {
              if (title === "Regenerate Image") setImagePrompt(e.target.value);
              else setVideoPrompt(e.target.value);
            }}
            placeholder={placeholder}
            className="mb-2 bg-gray-800 bg-opacity-70 border-gray-700 text-white placeholder-gray-400 h-12 justify-center"
          />
          <Button
            onClick={onGenerate}
            disabled={isGenerating || !prompt}
            className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white text-xs px-2 py-1"
          >
            {isGenerating ? 'Generating...' : title}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="bg-black rounded-lg shadow-md p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((mediaUrl, index) => (
          <motion.div 
            key={index}
            className="relative group aspect-video cursor-pointer"
            onClick={() => handleImageClick(mediaUrl)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mediaUrl.includes('.mp4') ? (
              <video
                src={mediaUrl}
                className="w-full h-full object-cover rounded-md"
                controls
              />
            ) : (
              <img
                src={mediaUrl}
                alt={`Storyboard frame ${index + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
            )}
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {expandedImage && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}
          >
            <motion.div
              className="flex flex-col md:flex-row gap-4 max-w-[90vw] max-h-[90vh] m-4"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <motion.div
                className="w-full md:w-1/2"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <GenerationSection title="Regenerate Image" prompt={imagePrompt} placeholder="Enter prompt for new image" onGenerate={handleGenerateImage} isGenerating={isGeneratingImage}>
                  <div className="relative aspect-video">
                    <img src={expandedImage} alt="Original image" className="w-full h-full object-cover" />
                  </div>
                </GenerationSection>
              </motion.div>
              <motion.div
                className="w-full md:w-1/2"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <GenerationSection title="Generate Video" prompt={videoPrompt} placeholder="Enter prompt for video" onGenerate={handleGenerateVideo} isGenerating={isGeneratingVideo}>
                  {generatedVideoUrl ? (
                    <video controls className="w-full aspect-video">
                      <source src={generatedVideoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="w-full aspect-video bg-gray-800 flex items-center justify-center text-gray-400">
                      Video will appear here
                    </div>
                  )}
                </GenerationSection>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {showControls && (
        <div className="mt-4 flex justify-end space-x-2">
          {onSave && (
            <Button onClick={onSave} size="sm" variant="outline" className="text-xs px-2 py-1 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white border-gray-700">
              Save
            </Button>
          )}
          {onDelete && (
            <Button onClick={onDelete} size="sm" variant="destructive" className="text-xs px-2 py-1 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white">
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default StoryboardSequence
