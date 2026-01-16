import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import Button from '../components/common/Button';
import Input from '../components/ui/Input';
import { useVendors } from '../hooks/useVendors';
import { PullToRefresh } from '../components/PullToRefresh';
import { NavigationDrawer } from '../components/NavigationDrawer';
import { hapticButton, hapticSelection, hapticSuccess } from '../utils/haptics';

type ParsedVenue = {
  venueId: string;
  tableCode?: string;
};

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const parseVenueInput = (rawInput: string): ParsedVenue | null => {
  const trimmed = rawInput.trim();
  if (!trimmed) return null;

  const withoutDomain = trimmed.replace(/^https?:\/\/[^/]+/i, '');
  const match = withoutDomain.match(/\/v\/([^/?#]+)(?:\/t\/([^/?#]+))?/i);
  if (match) {
    return {
      venueId: safeDecode(match[1]),
      tableCode: match[2] ? safeDecode(match[2]) : undefined,
    };
  }

  const shortMatch = withoutDomain.match(/^#?\/?v\/([^/?#]+)(?:\/t\/([^/?#]+))?/i);
  if (shortMatch) {
    return {
      venueId: safeDecode(shortMatch[1]),
      tableCode: shortMatch[2] ? safeDecode(shortMatch[2]) : undefined,
    };
  }

  return { venueId: trimmed };
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
};

const ClientLanding: React.FC = () => {
  const navigate = useNavigate();
  const [menuInput, setMenuInput] = useState('');
  const [tableInput, setTableInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch active venues for exploration
  const { data: venues, isLoading, refetch } = useVendors({ status: 'active' });

  // Get last visited venue for quick access (but no auto-redirect)
  const lastVenueId = typeof window !== 'undefined'
    ? localStorage.getItem('last_venue_id')
    : null;

  // Find the last venue object if available
  const lastVenue = venues?.find(v => v.id === lastVenueId);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    hapticButton();

    const parsed = parseVenueInput(menuInput);
    if (!parsed?.venueId) {
      setError('Enter a menu link or venue code to continue.');
      return;
    }

    hapticSuccess();
    const tableCode = tableInput.trim() || parsed.tableCode;
    const target = tableCode
      ? `/v/${parsed.venueId}/t/${tableCode}`
      : `/v/${parsed.venueId}`;
    navigate(target);
  }, [menuInput, tableInput, navigate]);

  const handleVenueClick = useCallback((venueId: string) => {
    hapticSelection();
    navigate(`/v/${venueId}`);
  }, [navigate]);

  const handleRefresh = useCallback(async () => {
    hapticButton();
    await refetch();
    hapticSuccess();
  }, [refetch]);

  const toggleDrawer = useCallback(() => {
    hapticButton();
    setIsDrawerOpen(prev => !prev);
  }, []);

  return (
    <>
      <NavigationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <PullToRefresh onRefresh={handleRefresh} scrollContainerId="landing-content">
        <main id="landing-content" className="min-h-screen bg-background overflow-y-auto">

          {/* Fixed Header */}
          <header
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/5"
            style={{ paddingTop: 'var(--safe-top, 0px)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
              {/* Menu Button */}
              <button
                onClick={toggleDrawer}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all touch-target"
                aria-label="Open menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </button>

              {/* Logo */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  hapticButton();
                  window.location.reload();
                }}
                className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"
              >
                DineIn
              </motion.button>

              {/* Settings Button */}
              <button
                onClick={() => {
                  hapticSelection();
                  navigate('/settings');
                }}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all touch-target"
                aria-label="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              </button>
            </div>
          </header>

          {/* Content with top padding for fixed header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-md mx-auto py-6 px-4 space-y-8"
            style={{ paddingTop: 'calc(var(--safe-top, 0px) + 72px)', paddingBottom: 'calc(var(--safe-bottom, 0px) + 24px)' }}
          >

            {/* Hero Section */}
            <motion.div variants={itemVariants} className="text-center space-y-2 pt-4">
              <h1 className="text-2xl font-bold text-foreground">
                Welcome to DineIn
              </h1>
              <p className="text-sm text-muted">
                Order & pay from your phone — no app needed
              </p>
            </motion.div>

            {/* Manual Entry Card */}
            <motion.div variants={cardVariants}>
              <GlassCard className="w-full">
                <div className="text-center mb-4">
                  <h2 className="text-lg font-bold text-foreground">Start your order</h2>
                  <p className="text-xs text-muted">
                    Scan QR code or enter details below
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <Input
                      id="menu-input"
                      label="Menu / Venue"
                      type="text"
                      value={menuInput}
                      onChange={(event) => setMenuInput(event.target.value)}
                      placeholder="Paste link or code"
                      variant="filled"
                      autoComplete="off"
                      inputMode="url"
                    />

                    <Input
                      id="table-input"
                      label="Table (Optional)"
                      type="text"
                      value={tableInput}
                      onChange={(event) => setTableInput(event.target.value)}
                      placeholder="e.g. 12"
                      variant="filled"
                      autoComplete="off"
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400 font-medium px-1"
                      role="alert"
                    >
                      {error}
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full py-3.5 font-bold"
                  >
                    Go to Menu
                  </Button>
                </form>
              </GlassCard>
            </motion.div>

            {/* Recently Visited (if available) */}
            {lastVenue && (
              <motion.div variants={itemVariants} className="space-y-3">
                <h3 className="text-sm font-semibold text-muted px-1">Recently Visited</h3>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <GlassCard
                    className="p-0 overflow-hidden hover:bg-surface-highlight transition-colors cursor-pointer"
                    onClick={() => handleVenueClick(lastVenue.id)}
                  >
                    <div className="flex items-center p-3 gap-4">
                      {lastVenue.imageUrl ? (
                        <img src={lastVenue.imageUrl} alt={lastVenue.name} className="w-12 h-12 rounded-lg object-cover bg-surface-base" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-surface-base flex items-center justify-center text-xl">
                          🍽️
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-foreground">{lastVenue.name}</div>
                        <div className="text-xs text-muted">Tap to reopen menu</div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
                <div className="h-px bg-border/50 mx-4" />
              </motion.div>
            )}

            {/* Explore Card List */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-sm font-semibold text-muted px-1">Explore Venues</h3>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-surface-highlight rounded-2xl w-full animate-pulse opacity-50" />
                  ))}
                </div>
              ) : venues && venues.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 gap-4"
                >
                  {venues.map((venue, index) => (
                    <motion.div
                      key={venue.id}
                      variants={cardVariants}
                      custom={index}
                      whileTap={{ scale: 0.98 }}
                    >
                      <GlassCard
                        className="p-0 overflow-hidden hover:bg-surface-highlight transition-colors cursor-pointer"
                        onClick={() => handleVenueClick(venue.id)}
                      >
                        <div className="flex items-center p-4 gap-4">
                          {venue.imageUrl ? (
                            <img src={venue.imageUrl} alt={venue.name} className="w-16 h-16 rounded-xl object-cover bg-surface-base shadow-sm" />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-surface-highlight to-surface-base flex items-center justify-center text-2xl shadow-inner border border-white/5">
                              🏪
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-lg text-foreground truncate">{venue.name}</h4>
                            <p className="text-xs text-muted truncate">{venue.address || 'Excellent dining'}</p>
                            {venue.openingHours && (
                              <div className="mt-1 flex items-center gap-1 text-[10px] text-green-400 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Open
                              </div>
                            )}
                          </div>
                          <div className="text-primary-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14" />
                              <path d="m12 5 7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-10 text-muted text-sm">
                  No active venues found.
                </div>
              )}
            </motion.div>

          </motion.div>
        </main>
      </PullToRefresh>
    </>
  );
};

export default ClientLanding;

