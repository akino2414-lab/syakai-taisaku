import React, { useState, useMemo } from 'react';
import { quizQuestions } from '../data/socialQuizData';
import { Field, Grade } from '../types';
import { Search, CheckCircle2, Lightbulb, Sparkles, BookOpen, Layers } from 'lucide-react';

export const QuestionListView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState<Field | 'すべて'>('すべて');
  const [selectedGrade, setSelectedGrade] = useState<Grade | '全学年'>('全学年');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return quizQuestions.filter((q) => {
      const matchField = selectedField === 'すべて' || q.field === selectedField;
      const matchGrade = selectedGrade === '全学年' || q.grade === selectedGrade;
      const matchQuery =
        !searchQuery.trim() ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.options.some((opt) => opt.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchField && matchGrade && matchQuery;
    });
  }, [searchQuery, selectedField, selectedGrade]);

  const getFieldBadgeClass = (field: Field) => {
    switch (field) {
      case '愛知特化':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case '地理':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case '歴史':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case '公民':
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Title & Introduction */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">
            問題・解答・解説 一覧（確認モード）
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600">
          全問題の選択肢・正解・きっかけ・影響をいつでも確認・復習できます。教員・保護者の確認用にもお使いいただけます。
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="キーワードで検索（例：中京工業地帯、織田信長、憲法、愛知用水）..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-500 mr-1">分野:</span>
            <button
              onClick={() => setSelectedField('すべて')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedField === 'すべて'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              すべて ({quizQuestions.length})
            </button>
            <button
              onClick={() => setSelectedField('地理')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedField === '地理'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              地理 ({quizQuestions.filter((q) => q.field === '地理').length})
            </button>
            <button
              onClick={() => setSelectedField('歴史')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedField === '歴史'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              歴史 ({quizQuestions.filter((q) => q.field === '歴史').length})
            </button>
            <button
              onClick={() => setSelectedField('公民')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedField === '公民'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              公民 ({quizQuestions.filter((q) => q.field === '公民').length})
            </button>
            <button
              onClick={() => setSelectedField('愛知特化')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedField === '愛知特化'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              愛知特化 ({quizQuestions.filter((q) => q.field === '愛知特化').length})
            </button>
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-xs font-bold text-slate-500 mr-1">学年:</span>
            {(['全学年', '中1', '中2', '中3'] as const).map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedGrade === grade
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500 flex justify-between items-center">
          <span>表示中: {filtered.length} 件 / 全 {quizQuestions.length} 件</span>
          <button
            onClick={() => setExpandedId(expandedId ? null : 'all')}
            className="text-indigo-600 hover:text-indigo-700 text-xs font-bold cursor-pointer"
          >
            {expandedId === 'all' ? 'すべての詳細を閉じる' : 'すべての詳細を開く'}
          </button>
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {filtered.map((item, index) => {
          const isExpanded = expandedId === 'all' || expandedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
            >
              {/* Card Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100">
                <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-400">
                      #{index + 1}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getFieldBadgeClass(item.field)}`}>
                      {item.field}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {item.grade}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">
                      {item.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    {isExpanded ? '詳細をたたむ' : '解説・背景を見る'}
                  </button>
                </div>

                <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                  {item.question}
                </p>

                {/* 4 Choices Grid with Right Answer Highlighted */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === item.correctIndex;
                    return (
                      <div
                        key={optIdx}
                        className={`text-xs p-2.5 rounded-lg border flex items-center gap-2 ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold ring-1 ring-emerald-200'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : optIdx + 1}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isCorrect && (
                          <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold">
                            正解
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Collapsible / Expanded Details */}
              {isExpanded && (
                <div className="p-4 sm:p-5 bg-slate-50/50 space-y-3 text-xs sm:text-sm">
                  {/* Short Explanation */}
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="font-bold text-indigo-700 block mb-1">【要点解説】</span>
                    <p className="text-slate-700 leading-relaxed">{item.explanation}</p>
                  </div>

                  {/* Causal Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl">
                      <span className="font-bold text-blue-900 block mb-1">【きっかけ・原因】なぜ起きた？</span>
                      <p className="text-slate-700 leading-relaxed">{item.cause}</p>
                    </div>

                    <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                      <span className="font-bold text-emerald-900 block mb-1">【影響・結果】どうなった？</span>
                      <p className="text-slate-700 leading-relaxed">{item.effect}</p>
                    </div>
                  </div>

                  {/* Hint & Exam Tip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl">
                      <div className="flex items-center gap-1 font-bold text-amber-900 mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span>【問題のヒント】</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{item.hint}</p>
                    </div>

                    {item.aichiExamTip && (
                      <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl">
                        <div className="flex items-center gap-1 font-bold text-indigo-900 mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>【愛知県高校入試のツボ】</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{item.aichiExamTip}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
