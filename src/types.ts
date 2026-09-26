export type Grade = '中1' | '中2' | '中3';
export type Field = '地理' | '歴史' | '公民' | '愛知特化';

export interface QuizQuestion {
  id: string;
  grade: Grade;
  field: Field;
  title: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, 3
  hint: string; // クイズがわからないときのヒント
  explanation: string; // 短い要点解説
  cause: string; // その出来事が起きた「きっかけ・原因」
  effect: string; // その後の「影響・結果」
  aichiExamTip?: string; // 愛知県高校入試の着眼点
}

export interface FlowStep {
  stepNumber: number;
  periodOrStage: string;
  title: string;
  cause: string; // きっかけ・背景
  mainEvent: string; // 主な内容・出来事
  effect: string; // 影響・結果・つながり
  keyPoints: string[];
}

export interface FlowchartTopic {
  id: string;
  title: string;
  field: Field;
  grade: Grade;
  summary: string;
  aichiRelevance: string; // 愛知県入試での重要ポイント
  steps: FlowStep[];
}
