import React from "react";

type Props = {
  activeImage: number;
  clickNext: () => void;
  clickPrev: () => void;
  images: string[];
};

const Description = ({ activeImage, images }: Props) => {
  return (
    <div className="relative w-full h-full">
      <div className="overflow-hidden relative w-full h-full">
        {images.map((elem, idx) => (
          <div
            key={idx}
            className={` w-full h-full text-pretty ${
              idx === activeImage ? "block" : "hidden"
            }`}
          >
            <div className="flex flex-col justify-center items-center h-full w-full mb-3 md:mb-6">
              <h2 className="text-sm md:text-2xl font-semibold mb-4 text-center text-white">{elem}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Slide progress bars */}
      <div className="absolute bottom-2 md:bottom-4 left-0 right-0 flex justify-center items-center space-x-2">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 w-6 md:w-8 rounded-full ${
              idx === activeImage ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Description;
