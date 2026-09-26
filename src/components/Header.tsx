import React from 'react';
import { BookOpen, GitMerge, ListChecks, Volume2, VolumeX, Landmark } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  currentTab: 'quiz' | 'flowchart' | 'review';
  onSelectTab: (tab: 'quiz' | 'flowchart' | 'review') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('quiz')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight">中学社会マスター</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                  愛知県高校入試対応
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-800 rounded-full">
                  全145問収録
                </span>
              </div>
              <p className="text-xs text-slate-700 hidden sm:block">
                中1〜中3 社会（地理・歴史・公民）原因と影響で覚える実戦アプリ
              </p>
            </div>
          </div>

          {/* Sound & Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onToggleSound();
                sounds.playClick();
              }}
              title={soundEnabled ? '効果音をOFFにする' : '効果音をONにする'}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Sound Toggle"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-indigo-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 sm:space-x-3 -mb-px overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => {
              sounds.playClick();
              onSelectTab('quiz');
            }}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              currentTab === 'quiz'
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <ListChecks className="w-4 h-4" />
            <span>4択クイズ</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onSelectTab('flowchart');
            }}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              currentTab === 'flowchart'
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <GitMerge className="w-4 h-4" />
            <span>流れフローチャート</span>
            <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-emerald-100 text-emerald-800 rounded font-bold">
              因果関係
            </span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onSelectTab('review');
            }}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              currentTab === 'review'
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>問題・解答の確認一覧</span>
          </button>
        </div>
      </div>
    </header>
  );
};
