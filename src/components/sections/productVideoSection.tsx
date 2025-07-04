"use client";

import React from "react";
import type { Video as VideoType } from "@/sanity.types";
import Video from "../modules/Video";

interface VideoItem {
    title?: string;
    thumbnail?: { asset?: { _ref?: string }; alt?: string };
    video?: VideoType;
}

interface ProductVideoSectionProps {
    title?: string;
    thumbnail?: { asset?: { _ref?: string }; alt?: string };
    heading?: string;
    subheading?: string;
    video?: VideoType;
}

const ProductVideoSection: React.FC<ProductVideoSectionProps> = ({
    video,
    heading,
    subheading,
    title,
    thumbnail,
}) => {
    const VideoCard = ({ video }: { video: VideoItem }) => {

        return (
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border-8 border-white/20 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-300">
                <div className="w-full h-0 pb-[56.25%] relative overflow-hidden">
                    <div className="absolute inset-0">
                        {video.video?.url ? (
                            <Video
                                src={video.video.url}
                                controls={true}
                                aspectRatio="16/9"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gray-100">
                                <p className="text-gray-500 text-lg">No video URL available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="py-20 lg:py-28 px-4 lg:px-8 bg-gradient-to-br from-[#4ACAC6] via-[#7ED4D1] to-[#B2F7EF]">
            <div className="container mx-auto max-w-5xl">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-800 mb-6 leading-tight">
                        {heading}
                    </h2>
                    <p className="text-lg md:text-xl lg:text-2xl text-slate-700 max-w-3xl mx-auto leading-relaxed font-light">
                        {subheading}
                    </p>
                </div>

                {/* Video Section */}
                <div className="relative">
                    {/* Decorative elements */}
                    <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    
                    {video && (
                        <div className="relative">
                            <VideoCard
                                video={{
                                    title: title,
                                    thumbnail: thumbnail,
                                    video: video,
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductVideoSection