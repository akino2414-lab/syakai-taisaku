import React, { useState, useMemo } from 'react';
import { QuizQuestion, Field, Grade } from '../types';
import {
  quizQuestions,
  geographyQuestions,
  historyQuestions,
  civicsQuestions,
  aichiQuestions
} from '../data/socialQuizData';
import { sounds } from '../utils/audio';
import {
  Globe,
  Scroll,
  Scale,
  Landmark,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Trophy,
  GitMerge,
  BookOpen,
  Shuffle,
  Compass
} from 'lucide-react';

interface QuizViewProps {
  onGoToFlowchart: () => void;
  onGoToReview: () => void;
}

type QuizMode = '10q' | 'all';

export const QuizView: React.FC<QuizViewProps> = ({
  onGoToFlowchart,
  onGoToReview,
}) => {
  const [selectedField, setSelectedField] = useState<Field | 'すべて'>('地理');
  const [selectedGrade, setSelectedGrade] = useState<Grade | '全学年'>('全学年');
  const [quizMode, setQuizMode] = useState<QuizMode>('10q');

  // Build question set based on field, grade, and mode
  const buildQuestions = (field: Field | 'すべて', grade: Grade | '全学年', mode: QuizMode) => {
    let pool = quizQuestions.filter((q) => {
      const matchField = field === 'すべて' || q.field === field;
      const matchGrade = grade === '全学年' || q.grade === grade;
      return matchField && matchGrade;
    });

    if (mode === '10q') {
      // Shuffle and pick 10
      pool = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    }
    return pool;
  };

  const [questionList, setQuestionList] = useState<QuizQuestion[]>(() =>
    buildQuestions('地理', '全学年', '10q')
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: { answeredIndex: number; isCorrect: boolean } }>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Directly start a specific subject with one click
  const handleSelectFieldDirectly = (field: Field | 'すべて', mode: QuizMode = quizMode) => {
    sounds.playClick();
    setSelectedField(field);
    setQuizMode(mode);
    const newQuestions = buildQuestions(field, selectedGrade, mode);
    setQuestionList(newQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setUserAnswers({});
    setIsFinished(false);
  };

  const handleGradeFilter = (grade: Grade | '全学年') => {
    sounds.playClick();
    setSelectedGrade(grade);
    const newQuestions = buildQuestions(selectedField, grade, quizMode);
    setQuestionList(newQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setUserAnswers({});
    setIsFinished(false);
  };

  const handleModeChange = (mode: QuizMode) => {
    sounds.playClick();
    setQuizMode(mode);
    const newQuestions = buildQuestions(selectedField, selectedGrade, mode);
    setQuestionList(newQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setUserAnswers({});
    setIsFinished(false);
  };

  const currentQuestion: QuizQuestion | undefined = questionList[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedOption(index);
    setIsAnswered(true);
    const isCorrect = index === currentQuestion.correctIndex;

    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playIncorrect();
    }

    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        answeredIndex: index,
        isCorrect,
      },
    }));
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIndex + 1 < questionList.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestartCurrent = () => {
    sounds.playClick();
    const newQuestions = buildQuestions(selectedField, selectedGrade, quizMode);
    setQuestionList(newQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setUserAnswers({});
    setIsFinished(false);
  };

  const handleRetryMistakes = () => {
    sounds.playClick();
    const mistakes = questionList.filter((q) => {
      const ans = userAnswers[q.id];
      return ans && !ans.isCorrect;
    });
    if (mistakes.length > 0) {
      setQuestionList(mistakes);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
      setUserAnswers({});
      setIsFinished(false);
    }
  };

  // Result metrics
  const totalCount = questionList.length;
  const correctCount = useMemo(() => {
    return Object.values(userAnswers).filter((a) => a.isCorrect).length;
  }, [userAnswers]);
  const scorePercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

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

  const getFieldIcon = (field: Field | 'すべて') => {
    switch (field) {
      case '地理':
        return <Globe className="w-5 h-5 text-emerald-600" />;
      case '歴史':
        return <Scroll className="w-5 h-5 text-rose-600" />;
      case '公民':
        return <Scale className="w-5 h-5 text-blue-600" />;
      case '愛知特化':
        return <Landmark className="w-5 h-5 text-amber-600" />;
      default:
        return <Compass className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* 1-Click Subject Selection Hub (As requested by user: ボタンクリックしたら地理の問題が解ける) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            <h2 className="font-extrabold text-base sm:text-lg text-slate-800">
              教科・分野を選んでクイズを解く
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-bold">
            収録数：全 {quizQuestions.length} 問
          </span>
        </div>

        {/* Big One-Click Action Cards for Geography, History, Civics, Aichi */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-4">
          {/* 地理 */}
          <button
            onClick={() => handleSelectFieldDirectly('地理')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between shadow-xs ${
              selectedField === '地理'
                ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300'
                : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <Globe className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {geographyQuestions.length}問
              </span>
            </div>
            <div>
              <div className="font-extrabold text-base text-slate-900 flex items-center gap-1">
                <span>地理を解く</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                世界の気候・日本の地形・産業
              </p>
            </div>
          </button>

          {/* 歴史 */}
          <button
            onClick={() => handleSelectFieldDirectly('歴史')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between shadow-xs ${
              selectedField === '歴史'
                ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-300'
                : 'bg-white border-slate-200 hover:border-rose-300 hover:bg-rose-50/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="p-2 rounded-xl bg-rose-100 text-rose-700">
                <Scroll className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                {historyQuestions.length}問
              </span>
            </div>
            <div>
              <div className="font-extrabold text-base text-slate-900 flex items-center gap-1">
                <span>歴史を解く</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                縄文〜江戸・明治維新・昭和現代
              </p>
            </div>
          </button>

          {/* 公民 */}
          <button
            onClick={() => handleSelectFieldDirectly('公民')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between shadow-xs ${
              selectedField === '公民'
                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-300'
                : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
                <Scale className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {civicsQuestions.length}問
              </span>
            </div>
            <div>
              <div className="font-extrabold text-base text-slate-900 flex items-center gap-1">
                <span>公民を解く</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                日本国憲法・三権分立・経済
              </p>
            </div>
          </button>

          {/* 愛知特化 */}
          <button
            onClick={() => handleSelectFieldDirectly('愛知特化')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between shadow-xs ${
              selectedField === '愛知特化'
                ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-300'
                : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                <Landmark className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {aichiQuestions.length}問
              </span>
            </div>
            <div>
              <div className="font-extrabold text-base text-slate-900 flex items-center gap-1">
                <span>愛知特化</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                中京工業・三英傑・用水・入試頻出
              </p>
            </div>
          </button>
        </div>

        {/* Sub Controls: Mode (10問スピード or 全問) & Grade Filter */}
        <div className="bg-slate-100/80 p-2.5 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-600">出題モード:</span>
            <button
              onClick={() => handleModeChange('10q')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                quizMode === '10q'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              10問スピードテスト
            </button>
            <button
              onClick={() => handleModeChange('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                quizMode === 'all'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              全問じっくりモード
            </button>
            <button
              onClick={() => handleSelectFieldDirectly('すべて', '10q')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedField === 'すべて'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>全分野ランダム</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-bold text-slate-600 mr-1">学年:</span>
            {(['全学年', '中1', '中2', '中3'] as const).map((grade) => (
              <button
                key={grade}
                onClick={() => handleGradeFilter(grade)}
                className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                  selectedGrade === grade
                    ? 'bg-slate-800 text-white'
                    : 'bg-white/70 text-slate-600 hover:bg-white'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Completion View */}
      {isFinished ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-center p-6 sm:p-10">
          <div className="inline-flex p-4 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 shadow-inner mb-4">
            <Trophy className="w-12 h-12" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {selectedField}クイズ 終了！
          </h2>
          <p className="text-slate-600 mt-1 font-medium">
            愛知県公立高校入試マスターへの確かなステップです
          </p>

          {/* Score card */}
          <div className="my-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">正答率</div>
            <div className="text-5xl font-black text-indigo-600 my-2">
              {scorePercent}<span className="text-2xl font-bold text-slate-600">%</span>
            </div>
            <div className="text-sm font-bold text-slate-700">
              {totalCount} 問中 <span className="text-indigo-600 text-lg">{correctCount}</span> 問正解
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {totalCount - correctCount > 0 && (
              <button
                onClick={handleRetryMistakes}
                className="px-6 py-3 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                間違えた問題だけ再挑戦 ({totalCount - correctCount}問)
              </button>
            )}

            <button
              onClick={handleRestartCurrent}
              className="px-6 py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              もう一度解く
            </button>

            <button
              onClick={() => handleSelectFieldDirectly(selectedField === '地理' ? '歴史' : selectedField === '歴史' ? '公民' : '地理')}
              className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              次の分野へ進む
            </button>
          </div>

          {/* Detailed Question Review List */}
          <div className="text-left border-t border-slate-100 pt-6">
            <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              今回の回答結果まとめ
            </h3>
            <div className="space-y-2.5">
              {questionList.map((q, idx) => {
                const ans = userAnswers[q.id];
                const isCorrect = ans ? ans.isCorrect : false;
                return (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-xl border bg-white ${
                      isCorrect ? 'border-emerald-200' : 'border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          第 {idx + 1} 問
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getFieldBadgeClass(q.field)}`}>
                          {q.field}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">{q.grade}</span>
                        <h4 className="font-bold text-slate-900 text-sm">{q.title}</h4>
                      </div>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs shrink-0">
                          <CheckCircle2 className="w-4 h-4" /> 正解
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-500 font-bold text-xs shrink-0">
                          <XCircle className="w-4 h-4" /> 不正解
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 mt-1 font-medium">{q.question}</p>
                    <div className="mt-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50/80 p-2 rounded-lg">
                      正解： {q.options[q.correctIndex]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : !currentQuestion ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-slate-500 mb-4">選択した条件に一致する問題がありません。</p>
          <button
            onClick={() => handleSelectFieldDirectly('地理')}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold cursor-pointer"
          >
            地理の問題を開始する
          </button>
        </div>
      ) : (
        /* Active Question Card */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 sm:p-7 transition-all">
          {/* Question Progress and Field */}
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${getFieldBadgeClass(currentQuestion.field)}`}>
                {currentQuestion.field}
              </span>
              <span className="text-xs font-semibold text-slate-500 px-2 py-0.5 bg-slate-100 rounded-md">
                {currentQuestion.grade}
              </span>
              <span className="font-bold text-slate-800 text-sm">
                {currentQuestion.title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-indigo-600">
                第 {currentIndex + 1} 問 / {questionList.length} 問
              </span>
              {!isAnswered && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    setShowHint(!showHint);
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                    showHint
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHint ? 'ヒントを閉じる' : 'ヒントを見る'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-5">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questionList.length) * 100}%` }}
            />
          </div>

          {/* Hint Card */}
          {showHint && !isAnswered && (
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-900 flex items-start gap-2.5 animate-fadeIn">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-amber-800 mb-0.5">💡 解答のヒント</span>
                {currentQuestion.hint}
              </div>
            </div>
          )}

          {/* Question Text */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          {/* 4 Choices */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOption = idx === currentQuestion.correctIndex;

              let buttonStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
              let iconElement = (
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
              );

              if (isAnswered) {
                if (isCorrectOption) {
                  buttonStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-300';
                  iconElement = (
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  );
                } else if (isSelected && !isCorrectOption) {
                  buttonStyle = 'bg-rose-50 border-rose-300 text-rose-950 font-bold';
                  iconElement = (
                    <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                      <XCircle className="w-4 h-4" />
                    </span>
                  );
                } else {
                  buttonStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-center gap-3 cursor-pointer text-sm sm:text-base ${buttonStyle}`}
                >
                  {iconElement}
                  <span className="flex-1 leading-snug">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Post-Answer Feedback & Causal Deep Dive */}
          {isAnswered && (
            <div className="pt-4 border-t border-slate-200 space-y-4">
              {/* Quick Result Status */}
              <div
                className={`p-3 rounded-xl flex items-center gap-2.5 font-bold text-sm sm:text-base ${
                  selectedOption === currentQuestion.correctIndex
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}
              >
                {selectedOption === currentQuestion.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>正解！素晴らしい！</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>おしい！ 正解は 「{currentQuestion.options[currentQuestion.correctIndex]}」 です</span>
                  </>
                )}
              </div>

              {/* Explanation Summary */}
              <div className="text-slate-800 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="font-bold text-indigo-700 block mb-1">【要点解説】</span>
                {currentQuestion.explanation}
              </div>

              {/* Cause & Effect Mechanics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* きっかけ・原因 */}
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs mb-1.5">
                    <span className="px-1.5 py-0.5 bg-blue-200 text-blue-900 rounded text-[10px]">なぜ起きた？</span>
                    <span>出来事のきっかけ・原因</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {currentQuestion.cause}
                  </p>
                </div>

                {/* 影響・その後の結果 */}
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs mb-1.5">
                    <span className="px-1.5 py-0.5 bg-emerald-200 text-emerald-900 rounded text-[10px]">どうなった？</span>
                    <span>影響・その後の結果</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {currentQuestion.effect}
                  </p>
                </div>
              </div>

              {/* Aichi Exam Tip Card */}
              {currentQuestion.aichiExamTip && (
                <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-950 flex items-start gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-800 block text-xs">🏯 愛知県公立高校入試の重要ポイント</span>
                    <p className="mt-0.5">{currentQuestion.aichiExamTip}</p>
                  </div>
                </div>
              )}

              {/* Next Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>{currentIndex + 1 < questionList.length ? '次の問題へ' : '結果を見る'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
