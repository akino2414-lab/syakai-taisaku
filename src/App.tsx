/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { QuizView } from './components/QuizView';
import { FlowchartView } from './components/FlowchartView';
import { QuestionListView } from './components/QuestionListView';
import { sounds } from './utils/audio';
import { Sparkles, MapPin, Compass, Award } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'quiz' | 'flowchart' | 'review'>('quiz');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const handleToggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header with Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentTab === 'quiz' && (
          <QuizView
            onGoToFlowchart={() => setCurrentTab('flowchart')}
            onGoToReview={() => setCurrentTab('review')}
          />
        )}

        {currentTab === 'flowchart' && (
          <FlowchartView
            onGoToQuiz={() => setCurrentTab('quiz')}
          />
        )}

        {currentTab === 'review' && (
          <QuestionListView />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 font-bold text-slate-700">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>愛知県高校入試 中学社会 マスター学習室</span>
          </div>
          <p className="text-slate-600">
            地理（中京工業地帯・気候・用水）・歴史（三大英傑・明治維新・近現代）・公民（憲法・三権分立）の因果関係で学ぶ実戦型Web教材
          </p>
          <div className="text-[11px] text-slate-600 pt-1">
            ※ 一般的な学習指導要領の内容および愛知県公立高校入試の出題傾向に基づき作成されています。
          </div>
        </div>
      </footer>
    </div>
  );
}
