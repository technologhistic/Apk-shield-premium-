import React from 'react';
import { Shield, Layers, FileText, History, Settings, Star } from 'lucide-react';
import { ScreenType } from '../../types';

interface NavbarProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  isPremium: boolean;
  onTogglePremium: () => void;
}

export const Header: React.FC<{ isPremium: boolean; onTogglePremium: () => void }> = ({
  isPremium,
  onTogglePremium
}) => {
  return (
    <header className="bg-[#121929]/95 backdrop-blur-md border-b border-[#334155]/50 sticky top-0 z-40 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Shield className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-[#121929]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-wide text-white flex items-center gap-1.5">
                APK Shield <span className="text-[#10B981]">Premium</span>
              </h1>
            </div>
            <p className="text-xs text-[#94A3B8]">Mobile Threat Security Core</p>
          </div>
        </div>

        <div>
          <div className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-[#10B981]/15 border-[#10B981] text-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            ★ PREMIUM ACTIVE
          </div>
        </div>
      </div>
    </header>
  );
};

export const BottomNav: React.FC<NavbarProps> = ({ currentScreen, onSelectScreen, isPremium }) => {
  const navItems: { id: ScreenType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'scan', label: 'Scanner', icon: Layers },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'premium', label: 'Premium', icon: Star }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#121929]/95 backdrop-blur-md border-t border-[#334155]/60 z-40 py-1.5 px-2">
      <div className="max-w-5xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isSelected = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectScreen(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isSelected
                  ? 'text-[#10B981]'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {isSelected && (
                <span className="absolute -top-1.5 w-8 h-1 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              )}
              <div className={`p-1 rounded-lg ${isSelected ? 'bg-[#10B981]/15' : ''}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <span className={`text-[10px] mt-0.5 font-medium ${isSelected ? 'font-bold text-[#10B981]' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
