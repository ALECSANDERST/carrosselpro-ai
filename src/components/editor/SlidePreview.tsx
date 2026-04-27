'use client';

import React from 'react';
import { Slide, BrandColors } from '@/types';

interface SlidePreviewProps {
  slide: Slide;
  brandColors: BrandColors;
  logoUrl?: string;
  isSelected?: boolean;
  onClick?: () => void;
  previewRef?: React.Ref<HTMLDivElement>;
  size?: 'sm' | 'md' | 'lg';
}

export default function SlidePreview({
  slide,
  brandColors,
  logoUrl,
  isSelected = false,
  onClick,
  previewRef,
  size = 'md',
}: SlidePreviewProps) {
  const dimensions = {
    sm: 'w-[120px] h-[120px]',
    md: 'w-[400px] h-[400px]',
    lg: 'w-[540px] h-[540px]',
  };

  const titleSize = {
    sm: 'text-[8px]',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const subtitleSize = {
    sm: 'text-[6px]',
    md: 'text-sm',
    lg: 'text-base',
  };

  const textSize = {
    sm: 'text-[5px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  const bg = slide.backgroundColor || brandColors.background;
  const isFirstSlide = slide.order === 0;

  return (
    <div
      ref={previewRef}
      onClick={onClick}
      className={`${dimensions[size]} rounded-xl overflow-hidden flex-shrink-0 relative transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      } ${isSelected ? 'ring-3 ring-indigo-500 ring-offset-2' : ''}`}
      style={{
        backgroundColor: bg,
        backgroundImage: slide.backgroundImageUrl ? `url(${slide.backgroundImageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: slide.fontFamily || 'Inter, sans-serif',
      }}
    >
      {slide.backgroundImageUrl && (
        <div className="absolute inset-0 bg-black/40" />
      )}

      <div className="relative z-10 h-full flex flex-col justify-between p-[8%]">
        {/* Logo */}
        {logoUrl && size !== 'sm' && (
          <div className="mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Logo"
              className={`${size === 'lg' ? 'h-8' : 'h-6'} object-contain`}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center">
          <h2
            className={`${titleSize[size]} font-bold leading-tight mb-1`}
            style={{ color: isFirstSlide && !slide.backgroundImageUrl ? '#FFFFFF' : (slide.titleColor || brandColors.primary) }}
          >
            {slide.title}
          </h2>
          {slide.subtitle && (
            <p
              className={`${subtitleSize[size]} font-medium opacity-80 mb-2`}
              style={{ color: isFirstSlide && !slide.backgroundImageUrl ? '#FFFFFF' : (slide.textColor || brandColors.text) }}
            >
              {slide.subtitle}
            </p>
          )}
          {slide.shortText && (
            <p
              className={`${textSize[size]} opacity-70 leading-relaxed`}
              style={{ color: isFirstSlide && !slide.backgroundImageUrl ? '#FFFFFF' : (slide.textColor || brandColors.text) }}
            >
              {slide.shortText}
            </p>
          )}
        </div>

        {/* CTA */}
        {slide.cta && (
          <div className="mt-2">
            <span
              className={`inline-block ${
                size === 'sm' ? 'px-1.5 py-0.5 text-[5px]' : size === 'md' ? 'px-4 py-2 text-xs' : 'px-5 py-2.5 text-sm'
              } rounded-lg font-medium`}
              style={{
                backgroundColor: slide.ctaColor || brandColors.accent,
                color: slide.ctaTextColor || '#FFFFFF',
              }}
            >
              {slide.cta}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
