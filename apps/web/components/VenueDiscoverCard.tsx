import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { OptimizedImage } from './OptimizedImage';
import { VenueResult } from '../services/geminiService';
import { Venue } from '../types';

interface VenueDiscoverCardProps {
    venue: VenueResult;
    index: number;
    registeredVenue?: Venue;
    currency?: string;
    onImageGenerated?: (imageUrl: string) => void;
}

/**
 * Premium venue discovery card with:
 * - Glassmorphism effect
 * - Smooth entrance animations
 * - Hero image with gradient overlay
 * - Quick action buttons
 * - Distance & rating badges
 */
export const VenueDiscoverCard: React.FC<VenueDiscoverCardProps> = ({
    venue,
    index,
    registeredVenue,
    currency = '€',
    onImageGenerated
}) => {
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);

    const isVerified = !!registeredVenue;
    const displayCurrency = registeredVenue?.currency || currency;

    // Format distance
    const formatDistance = (meters?: number) => {
        if (!meters) return '';
        if (meters < 1000) return `${meters}m`;
        return `${(meters / 1000).toFixed(1)}km`;
    };

    // WhatsApp link
    const whatsappNumber = registeredVenue?.whatsappNumber || venue.whatsapp || venue.phone;
    const whatsappLink = whatsappNumber
        ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`
        : null;

    // Animation variants
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    const handleCardClick = () => {
        if (isVerified) {
            navigate(`/menu/${registeredVenue.id}`);
        }
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const { shareVenue } = await import('../services/shareAPI');
        const url = `${window.location.origin}/#/menu/${registeredVenue?.id || ''}`;
        await shareVenue(registeredVenue?.id || venue.google_place_id || '', venue.name, url);
    };

    return (
        <motion.div
            className="w-full mb-6"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div
                className={`
          relative overflow-hidden rounded-3xl
          bg-glass backdrop-blur-xl
          border border-glassBorder
          shadow-2xl shadow-black/20
          ${isVerified ? 'cursor-pointer' : 'cursor-default'}
          transition-all duration-300
          hover:shadow-3xl hover:shadow-primary-500/10
          hover:border-primary-500/30
        `}
                onClick={handleCardClick}
            >
                {/* Hero Image */}
                <div className="aspect-[4/3] w-full relative overflow-hidden">
                    {/* Image */}
                    <OptimizedImage
                        src={venue.photo_url || registeredVenue?.imageUrl || `https://via.placeholder.com/600x400?text=${encodeURIComponent(venue.name)}`}
                        alt={venue.name}
                        aspectRatio="4/3"
                        className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'scale-100' : 'scale-105'}`}
                        onLoad={() => setImageLoaded(true)}
                        priority={index < 3}
                    />

                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary-500/10" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        {/* Verified Badge */}
                        {isVerified && (
                            <motion.div
                                className="px-3 py-1.5 bg-primary-500 rounded-full text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-primary-500/40"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                            >
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                Order Online
                            </motion.div>
                        )}

                        {/* Rating Badge */}
                        {venue.rating && (
                            <motion.div
                                className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-xs font-bold text-white flex items-center gap-1 border border-white/10"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                            >
                                <span className="text-yellow-400">★</span>
                                {venue.rating.toFixed(1)}
                            </motion.div>
                        )}
                    </div>

                    {/* Bottom Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                        {/* Distance Pill */}
                        {venue.distance_meters && (
                            <motion.span
                                className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-medium text-white mb-2 border border-white/10"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.4 }}
                            >
                                📍 {formatDistance(venue.distance_meters)} away
                            </motion.span>
                        )}

                        {/* Venue Name */}
                        <h3 className="font-bold text-white text-2xl leading-tight mb-1.5 drop-shadow-lg">
                            {venue.name}
                        </h3>

                        {/* Meta Info */}
                        <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                            {venue.category && <span>{venue.category}</span>}
                            {venue.price_level && (
                                <>
                                    <span className="w-1 h-1 bg-gray-500 rounded-full" />
                                    <span>{displayCurrency.repeat(venue.price_level)}</span>
                                </>
                            )}
                        </div>

                        {/* Why Recommended */}
                        {venue.why_recommended && (
                            <p className="text-xs text-gray-400 mt-2 line-clamp-1 italic">
                                "{venue.why_recommended}"
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Bar */}
                <div
                    className="p-3 bg-surface-highlight/80 backdrop-blur-md flex gap-2 border-t border-border/50"
                    onClick={e => e.stopPropagation()}
                >
                    {/* View Menu Button */}
                    {isVerified && (
                        <button
                            onClick={() => navigate(`/menu/${registeredVenue.id}`)}
                            className="flex-[2] py-3 bg-foreground text-background rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg hover:shadow-xl"
                            aria-label={`View menu for ${venue.name}`}
                        >
                            🍽️ View Menu
                        </button>
                    )}

                    {/* WhatsApp Button */}
                    {whatsappLink && (
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex-1 py-3 bg-[#25D366]/20 border border-[#25D366]/30 rounded-xl text-sm font-bold text-[#25D366] flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-[#25D366]/30 ${!isVerified ? 'flex-[1]' : ''}`}
                            aria-label={`Contact ${venue.name} via WhatsApp`}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                        </a>
                    )}

                    {/* Share Button */}
                    <button
                        onClick={handleShare}
                        className="flex-1 py-3 bg-surface border border-border rounded-xl text-sm font-bold text-foreground flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-surface-highlight"
                        aria-label={`Share ${venue.name}`}
                    >
                        <span className="text-lg" aria-hidden="true">🔗</span>
                    </button>

                    {/* Maps Button */}
                    {venue.google_place_id && (
                        <a
                            href={`https://www.google.com/maps/place/?q=place_id:${venue.google_place_id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 py-3 bg-surface border border-border rounded-xl text-sm font-bold text-foreground flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-surface-highlight"
                            aria-label={`View ${venue.name} on Google Maps`}
                        >
                            <span className="text-lg" aria-hidden="true">📍</span>
                        </a>
                    )}
                </div>

                {/* Quick Tags */}
                {venue.quick_tags && venue.quick_tags.length > 0 && (
                    <div className="px-4 pb-4 flex gap-1.5 flex-wrap">
                        {venue.quick_tags.slice(0, 4).map((tag, i) => (
                            <span
                                key={i}
                                className="px-2 py-0.5 bg-surface rounded-full text-[10px] text-muted font-medium border border-border"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default VenueDiscoverCard;
