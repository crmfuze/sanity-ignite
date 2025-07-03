import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../components/dialog";
import { Play } from "lucide-react";

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageUrl?: string;
  overlayColor?: string;
  textColor?: string;
  videoUrl?: string;
  spanishUrl?: string;
  showVideoButton?: boolean;
}

const HeroBanner = ({
  title,
  subtitle,
  ctaText = "Buy Now!",
  ctaLink = "/products",
  secondaryCtaText = "Watch Now",
  secondaryCtaLink = "/about",
  imageUrl,
  overlayColor = "rgba(255, 255, 255, 0.4)",
  textColor = "#000000",
  videoUrl,
  spanishUrl,
  showVideoButton = true,
}: HeroBannerProps) => {
  return (
    <div className="relative w-full h-[500px] bg-contain overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ backgroundColor: overlayColor }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 md:px-8 lg:px-16 text-center">
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-3xl"
          style={{ color: textColor }}
        >
          {title}
        </h1>

        <p
          className="text-base md:text-lg lg:text-xl mb-8 max-w-2xl"
          style={{ color: textColor }}
        >
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          {showVideoButton ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className='bg-[#9B37AE] text-white font-bold tracking-normal font-inter hover:bg-purple-800 transition'
                >
                  <Play className="mr-2 h-4 w-4" />
                  {secondaryCtaText}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full bg-white">
                <div className="aspect-video w-full">
                  <iframe
                    src={videoUrl}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                    title="Video"
                  />
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button
              variant="outline"
              size="lg"
              className="font-medium bg-transparent border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white px-8"
              onClick={() => (window.location.href = secondaryCtaLink)}
            >
              {secondaryCtaText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
