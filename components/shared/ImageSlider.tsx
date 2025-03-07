/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import Description from "./DescriptionSlider";

export default function ImageSlider({ images }: { images: any }) {
  // const text = [
  //   "Create once, share with the world.",
  //   "Expand your reach, inspire beyond borders. One message, endless languages.",
  //   "Speak their language, share your vision.",
  // ];

  const [activeImage, setActiveImage] = useState(0);

  const clickNext = useCallback(() => {
    activeImage === images.length - 1
      ? setActiveImage(0)
      : setActiveImage(activeImage + 1);
  }, [activeImage, images.length]);
  const clickPrev = () => {
    activeImage === 0
      ? setActiveImage(images.length - 1)
      : setActiveImage(activeImage - 1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      clickNext();
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [activeImage, clickNext]);

  return (
    <div
      className={`w-full relative h-full transition-transform ease-in-out duration-500 rounded-md mx-auto`}
    >
      {images.map((elem: string, i: number) => (
        <div
          key={i}
          className={`${
            i === activeImage
              ? "block w-full h-full object-cover transition-all duration-500 ease-in-out"
              : "hidden"
          }`}
        >
          <Image
            src={elem}
            alt=""
            width={1000}
            height={1000}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      ))}

      {/* Centering the Description div */}
      {/* <div className="absolute z-50 bottom-2 md:bottom-16 left-1/2 transform -translate-x-1/2 flex justify-center items-center min-w-fit">
        <Description
          images={text}
          activeImage={activeImage}
          clickNext={clickNext}
          clickPrev={clickPrev}
        />
      </div> */}
    </div>
  );
}
