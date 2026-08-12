import React, { useState } from 'react';
import { X, Music, BookOpen, Info, Bell, Sparkles, Check, Heart } from 'lucide-react';
import { Track } from '../types';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: Track[];
  currentTrack: Track;
  onSelectTrack: (index: number) => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  tracks,
  currentTrack,
  onSelectTrack,
}) => {
  const [activeTab, setActiveTab] = useState<'tracks' | 'lyrics' | 'about'>('tracks');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      {/* Side Glass Drawer */}
      <div className="relative w-full max-w-md h-full bg-[#1a0f0e]/95 backdrop-blur-2xl border-r border-white/15 p-6 text-white flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif text-white tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>जिन संगीत</span>
              <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-200 border border-orange-400/30 uppercase tracking-wider">
                Spiritual
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-stone-100 transition-colors"
              aria-label="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 my-4 p-1 rounded-xl bg-stone-900/80 border border-white/10">
            <button
              onClick={() => setActiveTab('tracks')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-sans font-medium flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'tracks'
                  ? 'bg-amber-600/50 text-amber-100 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Chants</span>
            </button>

            <button
              onClick={() => setActiveTab('lyrics')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-sans font-medium flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'lyrics'
                  ? 'bg-amber-600/50 text-amber-100 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Lyrics</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-sans font-medium flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'about'
                  ? 'bg-amber-600/50 text-amber-100 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>About</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'tracks' && (
            <div className="space-y-2 mt-4">
              <h4 className="text-xs font-sans font-semibold text-stone-400 uppercase tracking-wider mb-2">
                Sacred Collection
              </h4>
              {tracks.map((track, idx) => {
                const isSelected = track.id === currentTrack.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => {
                      onSelectTrack(idx);
                      onClose();
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-amber-950/50 border-amber-500/50 text-amber-100 shadow-md'
                        : 'bg-stone-900/40 hover:bg-stone-900/80 border-white/10 text-stone-300 hover:text-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="truncate">
                        <div className="text-sm font-cinzel font-semibold truncate group-hover:text-amber-200">
                          {track.title}
                        </div>
                        <div className="text-xs font-devanagari text-amber-300/80 truncate">
                          {track.titleDevanagari} • {track.subtitle}
                        </div>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'lyrics' && (
            <div className="mt-4 space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/20">
                <h4 className="text-lg font-devanagari font-bold text-amber-200">
                  {currentTrack.titleDevanagari} ({currentTrack.title})
                </h4>
                <p className="text-xs font-sans text-stone-400 mt-0.5">
                  {currentTrack.metadata}
                </p>

                <div className="mt-4 space-y-2 text-sm font-devanagari-subtle text-amber-100 leading-relaxed">
                  {currentTrack.lyricsDevanagari?.map((line, idx) => (
                    <p key={idx} className="p-1.5 rounded bg-black/20">{line}</p>
                  ))}
                </div>

                {currentTrack.meaning && (
                  <div className="mt-4 pt-3 border-t border-amber-500/20 text-xs font-sans text-stone-300 italic">
                    <strong className="text-amber-300 not-italic">Meaning: </strong>
                    {currentTrack.meaning}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="mt-4 space-y-4 text-xs font-sans leading-relaxed text-stone-300">
              <div className="p-4 rounded-xl bg-stone-900/60 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-amber-200 font-cinzel text-sm font-semibold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>About Jin Sangeet</span>
                </div>
                <p>
                  Jin Sangeet (जिन संगीत) is a peaceful spiritual music portal inspired by traditional Jain temple architecture, sacred mantras, and meditative resonances.
                </p>
                <p>
                  Rooted in the eternal teachings of Jainism (Jinshasan), these chants cultivate Ahimsa (non-violence), Karuna (compassion), and Samyag Darshana (right faith).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-900/60 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-amber-200 font-cinzel text-sm font-semibold">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>Soundscape &amp; Tanpura</span>
                </div>
                <p>
                  The Web Audio synth generates real-time harmonic tanpura resonances tuned to C# (136.1 Hz OM frequency) with traditional temple bell chimes.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 text-center text-[11px] font-sans text-stone-400 flex items-center justify-center gap-1">
          <span>Jai Jinendra</span>
          <Heart className="w-3 h-3 text-rose-400 fill-rose-400 inline" />
          <span>Jinshasan Devotion</span>
        </div>
      </div>
    </div>
  );
};
