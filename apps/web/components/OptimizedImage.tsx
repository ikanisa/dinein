/**
 * Optimized Image Component
 * Enhanced with react-lazy-load-image-component for blur-up effect
 * Supports WebP, responsive images, lazy loading, and placeholder
 */

import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export interface OptimizedImageProps {
  src: string;
  alt: string;
  aspectRatio?: string; // e.g., "4/3", "16/9"
  placeholder?: string; // Base64 or URL for placeholder (LQIP)
  sizes?: string; // Responsive image sizes
  priority?: boolean; // Load immediately (skip lazy loading)
  className?: string;
  wrapperClassName?: string;
  width?: number | string;
  height?: number | string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Generate srcset for responsive images
 */
const generateSrcSet = (src: string): string | undefined => {
  if (!src || src.startsWith('data:') || src.includes('?')) {
    return undefined;
  }

  // For Supabase Storage URLs, append width transforms
  if (src.includes('supabase.co/storage')) {
    const widths = [320, 640, 960, 1280, 1920];
    return widths
      .map(w => `${src}?width=${w}&quality=80 ${w}w`)
      .join(', ');
  }

  return undefined;
};

/**
 * Generate responsive sizes attribute
 */
const generateSizes = (customSizes?: string): string => {
  if (customSizes) return customSizes;
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
};

export const OptimizedImage: React.FC<OptimizedImageProps> = React.memo(({
  src,
  alt,
  aspectRatio,
  placeholder,
  sizes,
  priority = false,
  className = '',
  wrapperClassName = '',
  width,
  height,
  objectFit = 'cover',
  onLoad,
  onError,
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    ...(aspectRatio && { aspectRatio }),
  };

  const imageStyle: React.CSSProperties = {
    objectFit,
    width: '100%',
    height: '100%',
  };

  // For priority images, use native img with eager loading
  if (priority) {
    return (
      <div className={`relative ${wrapperClassName}`} style={containerStyle}>
        <img
          src={src}
          alt={alt}
          className={`w-full h-full ${className}`}
          style={imageStyle}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          sizes={generateSizes(sizes)}
          srcSet={generateSrcSet(src)}
          onLoad={onLoad}
          onError={handleError}
          width={width}
          height={height}
        />
        {hasError && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-white/10 flex items-center justify-center">
            <span className="text-gray-400 text-xs">Failed to load</span>
          </div>
        )}
      </div>
    );
  }

  // For lazy images, use react-lazy-load-image-component with blur effect
  return (
    <div className={`relative ${wrapperClassName}`} style={containerStyle}>
      <LazyLoadImage
        src={src}
        alt={alt}
        effect="blur"
        className={`w-full h-full ${className}`}
        style={imageStyle}
        placeholderSrc={placeholder}
        threshold={100}
        afterLoad={onLoad}
        onError={handleError}
        width={width}
        height={height}
        wrapperClassName="!w-full !h-full"
      />
      {hasError && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-white/10 flex items-center justify-center">
          <span className="text-gray-400 text-xs">Failed to load</span>
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

/**
 * Hero Image - Priority loaded, optimized for LCP
 */
export const HeroImage: React.FC<Omit<OptimizedImageProps, 'priority'>> = (props) => (
  <OptimizedImage {...props} priority />
);

/**
 * Thumbnail Image - Small, eager lazy loading with low threshold
 */
export const ThumbnailImage: React.FC<OptimizedImageProps> = (props) => (
  <OptimizedImage
    {...props}
    sizes="(max-width: 640px) 50vw, 150px"
  />
);

/**
 * Avatar Image - Circular, small
 */
export const AvatarImage: React.FC<OptimizedImageProps & { size?: number }> = ({
  size = 40,
  className = '',
  ...props
}) => (
  <OptimizedImage
    {...props}
    width={size}
    height={size}
    className={`rounded-full ${className}`}
    wrapperClassName="rounded-full overflow-hidden"
    aspectRatio="1/1"
  />
);
