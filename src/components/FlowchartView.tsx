import React, { useState } from 'react';
import { flowchartTopics } from '../data/flowchartData';
import { FlowchartTopic, FlowStep } from '../types';
import { sounds } from '../utils/audio';
import {
  GitMerge,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Check,
  ChevronRight,
  Landmark,
  ShieldCheck
} from 'lucide-react';

interface FlowchartViewProps {
  onGoToQuiz: () => void;
}

export const FlowchartView: React.FC<FlowchartViewProps> = ({ onGoToQuiz }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(flowchartTopics[0].id);
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({});

  const currentTopic = flowchartTopics.find((t) => t.id === selectedTopicId) || flowchartTopics[0];

  const toggleStepRead = (stepKey: string) => {
    sounds.playClick();
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const getFieldBadgeClass = (field: string) => {
    switch (field) {
      case '愛知特化':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case '地理':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case '歴史':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case '公民':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Topic Selection Tab Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-800">
              歴史・社会の流れフローチャート
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            全 {flowchartTopics.length} テーマ
          </span>
        </div>

        {/* Topic Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {flowchartTopics.map((topic) => {
            const isSelected = topic.id === currentTopic.id;
            return (
              <button
                key={topic.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedTopicId(topic.id);
                }}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getFieldBadgeClass(topic.field)}`}>
                    {topic.field}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {topic.grade}
                  </span>
                </div>
                <h3 className={`text-sm font-bold leading-snug ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                  {topic.title}
                </h3>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Topic Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 mb-8 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${getFieldBadgeClass(currentTopic.field)}`}>
            {currentTopic.field}
          </span>
          <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
            {currentTopic.grade}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
          {currentTopic.title}
        </h1>

        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          {currentTopic.summary}
        </p>

        {/* Aichi Exam Relevance */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-950">
            <span className="font-bold text-amber-900 block mb-0.5">愛知県高校入試の出題ポイント</span>
            {currentTopic.aichiRelevance}
          </div>
        </div>
      </div>

      {/* Visual Step-by-Step Flowchart */}
      <div className="relative space-y-6">
        {currentTopic.steps.map((step, index) => {
          const stepKey = `${currentTopic.id}-step-${step.stepNumber}`;
          const isDone = completedSteps[stepKey];

          return (
            <div key={step.stepNumber} className="relative">
              {/* Connector Arrow (unless last) */}
              {index < currentTopic.steps.length - 1 && (
                <div className="absolute left-6 top-full h-6 w-0.5 bg-indigo-200 -ml-px z-0 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 border-b-2 border-r-2 border-indigo-400 rotate-45 transform translate-y-2"></div>
                </div>
              )}

              {/* Step Card */}
              <div
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isDone ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Step Header */}
                <div className="bg-slate-50 border-b border-slate-100 p-4 sm:px-6 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                      {step.stepNumber}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-slate-500">
                        {step.periodOrStage}
                      </div>
                      <h4 className="font-bold text-base sm:text-lg text-slate-900">
                        {step.title}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleStepRead(stepKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>理解した！</span>
                      </>
                    ) : (
                      <>
                        <span>理解したらチェック</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 3 Causal Blocks */}
                <div className="p-4 sm:p-6 space-y-3.5">
                  {/* 1. きっかけ・原因 */}
                  <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100">
                    <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs mb-1">
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                        起
                      </span>
                      <span>【きっかけ・背景】なぜ起きたのか？</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-5">
                      {step.cause}
                    </p>
                  </div>

                  {/* 2. 主な出来事 */}
                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs mb-1">
                      <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center">
                        承
                      </span>
                      <span>【主な内容・出来事】何があったのか？</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed pl-5">
                      {step.mainEvent}
                    </p>
                  </div>

                  {/* 3. 影響・結果 */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs mb-1">
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">
                        結
                      </span>
                      <span>【影響・その後の結果】どうなったか・次へのつながり</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-5">
                      {step.effect}
                    </p>
                  </div>

                  {/* Key points tags */}
                  <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-400 mr-1">重要語句:</span>
                    {step.keyPoints.map((point, pIdx) => (
                      <span
                        key={pIdx}
                        className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        #{point}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom call to action */}
      <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-center shadow-md">
        <h3 className="text-lg font-bold mb-1">流れを頭に入れたらクイズで力試し！</h3>
        <p className="text-xs sm:text-sm text-indigo-100 mb-4">
          入試本番で問われる因果関係の理解度を4択クイズでチェックしましょう。
        </p>
        <button
          onClick={onGoToQuiz}
          className="px-6 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold rounded-xl text-sm shadow cursor-pointer transition-colors"
        >
          4択クイズに挑戦する
        </button>
      </div>
    </div>
  );
};
