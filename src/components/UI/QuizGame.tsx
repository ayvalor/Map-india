import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, BookOpen, Star, SlidersHorizontal } from 'lucide-react';
import { educationalData } from '../../data/educationalData';
import { CITY_DIRECTORY_SOURCE } from '../../data/cities';
import type { CityLocation } from '../../data/cities';
import { buildQuizBank, countQuizTopics, drawQuizRound, QUIZ_TOPICS } from '../../data/quiz';
import type { QuizLength, QuizQuestion, QuizTopic } from '../../data/quiz';

interface QuizGameProps { cityDirectory?: CityLocation[] }
const emptyDirectory: CityLocation[] = [];
const HISTORY_KEY = 'bharat-atlas-quiz-history-v1';
const lengths: QuizLength[] = [5, 10, 20];
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-700';
function readHistory(): string[] {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(HISTORY_KEY) ?? '[]');
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string').slice(0, 50000) : [];
  } catch { return []; }
}
function saveHistory(ids: string[]) {
  try { sessionStorage.setItem(HISTORY_KEY, JSON.stringify(ids)); } catch { /* In-memory history still works when storage is unavailable. */ }
}

export const QuizGame: React.FC<QuizGameProps> = ({ cityDirectory = emptyDirectory }) => {
  const reducedMotion = useReducedMotion();
  const bank = useMemo(() => buildQuizBank(educationalData, cityDirectory), [cityDirectory]);
  const counts = useMemo(() => countQuizTopics(bank), [bank]);
  const [topic, setTopic] = useState<QuizTopic>('mixed');
  const [roundLength, setRoundLength] = useState<QuizLength>(5);
  const [phase, setPhase] = useState<'setup' | 'playing' | 'complete'>('setup');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [seenIds, setSeenIds] = useState(readHistory);
  const answered = useRef(false);
  const hasStarted = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const question = questions[currentIdx];
  const showFeedback = selectedAnswer !== null;
  const topicLabel = QUIZ_TOPICS.find(item => item.id === topic)?.label ?? 'Mixed';
  const available = counts[topic];
  const actualLength = Math.min(roundLength, available);

  useEffect(() => {
    const target = phase === 'playing' ? questionRef.current : phase === 'complete' ? resultRef.current : hasStarted.current ? headingRef.current : null;
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [phase, currentIdx]);
  useEffect(() => { if (showFeedback) nextRef.current?.focus({ preventScroll: true }); }, [showFeedback]);

  const startRound = () => {
    const round = drawQuizRound(bank, topic, roundLength, seenIds);
    if (!round.questions.length) return;
    hasStarted.current = true;
    answered.current = false;
    setQuestions(round.questions);
    setSeenIds(round.seenIds); saveHistory(round.seenIds);
    setCurrentIdx(0); setScore(0); setSelectedAnswer(null); setPhase('playing');
  };
  const submitAnswer = (option: string) => {
    if (phase !== 'playing' || answered.current || !question?.options.includes(option)) return;
    answered.current = true;
    setSelectedAnswer(option);
    if (option === question.answer) setScore(value => value + 1);
  };
  const nextQuestion = () => {
    if (!answered.current || phase !== 'playing') return;
    answered.current = false;
    setSelectedAnswer(null);
    if (currentIdx + 1 < questions.length) setCurrentIdx(value => value + 1);
    else setPhase('complete');
  };
  const changeOptions = () => { answered.current = false; setSelectedAnswer(null); setPhase('setup'); };

  return (
    <section aria-label="Bharat geography quiz" data-quiz-phase={phase}
      className="bg-white border border-cream-200 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col w-full min-w-0 min-h-[480px]">
      {phase === 'setup' && (
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 bg-saffron-50 text-saffron rounded-2xl flex items-center justify-center border border-saffron-100"><HelpCircle className="w-6 h-6" aria-hidden="true" /></div>
            <div className="min-w-0"><h3 ref={headingRef} tabIndex={-1} className={`text-xl font-medium font-regal text-navy scroll-mt-32 ${focusRing}`}>Bharat Geography Quiz</h3>
              <p className="text-sm text-navy-600 mt-2 leading-relaxed">Choose a topic and round length. Explore {counts.mixed.toLocaleString('en-IN')} questions drawn from the atlas entries and city directory.</p>
            </div>
          </div>
          <fieldset className="space-y-3">
            <legend className="text-sm font-bold text-navy mb-3">Choose a topic</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUIZ_TOPICS.map(item => <label key={item.id} className={`flex items-start gap-3 rounded-2xl border p-4 min-h-20 cursor-pointer focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gold-700 ${topic === item.id ? 'border-gold bg-gold-50' : 'border-cream-200 bg-cream-50/40 hover:bg-cream-50'} ${!counts[item.id] ? 'opacity-50' : ''}`}>
                <input type="radio" name="quiz-topic" value={item.id} checked={topic === item.id} disabled={!counts[item.id]} onChange={() => setTopic(item.id)} className="mt-1 accent-navy shrink-0" />
                <span className="min-w-0"><span className="flex flex-wrap items-baseline gap-x-2 text-sm font-bold text-navy">{item.label}<span className="text-xs font-normal text-navy-600">{counts[item.id].toLocaleString('en-IN')} questions</span></span><span className="block mt-1 text-xs leading-relaxed text-navy-600">{item.description}</span></span>
              </label>)}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-bold text-navy mb-3">Questions per round</legend>
            <div className="flex flex-wrap gap-3">{lengths.map(length => <label key={length} className={`min-h-11 min-w-16 px-4 py-3 flex items-center justify-center gap-2 rounded-xl border cursor-pointer text-sm font-bold text-navy focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gold-700 ${roundLength === length ? 'border-gold bg-gold-50' : 'border-cream-200 hover:bg-cream-50'}`}><input type="radio" name="quiz-length" value={length} checked={roundLength === length} onChange={() => setRoundLength(length)} className="accent-navy" />{length}</label>)}</div>
          </fieldset>
          <p className="text-xs leading-relaxed text-navy-600">Questions do not repeat within a round. New rounds use unseen questions until the chosen topic's pool is exhausted, with question history remembered for this browser session.</p>
          {actualLength < roundLength && <p role="status" className="text-sm text-navy-600">This topic currently has {available} unique questions, so this round will contain {actualLength}.</p>}
          <button type="button" onClick={startRound} disabled={!actualLength}
            className={`min-h-12 px-6 py-3 bg-navy text-gold-100 hover:bg-navy-800 disabled:opacity-50 border border-gold/30 font-bold rounded-2xl inline-flex items-center justify-center gap-2 transition-colors ${focusRing}`}>
            Start {actualLength}-question round <ArrowRight className="w-4 h-4 text-gold" aria-hidden="true" />
          </button>
        </div>
      )}

      {phase === 'playing' && question && (
        <div className="space-y-5" data-quiz-question-id={question.id} data-quiz-category={question.category}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div><p className="text-xs font-bold text-navy-600 uppercase tracking-wide">{topicLabel} · Question {currentIdx + 1} of {questions.length}</p><p className="text-xs text-gold-700 mt-1">{QUIZ_TOPICS.find(item => item.id === question.category)?.label}</p></div>
            <div className="flex items-center gap-2 text-sm font-bold text-navy bg-saffron-50 px-3 py-2 rounded-lg border border-saffron-100/50"><Star className="w-4 h-4 text-saffron" aria-hidden="true" />Score: {score}</div>
          </div>
          <div role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={currentIdx + Number(showFeedback)} className="w-full bg-cream-100 h-1.5 rounded-full overflow-hidden">
            <motion.div className="bg-saffron h-full" animate={{ width: `${((currentIdx + Number(showFeedback)) / questions.length) * 100}%` }} transition={{ duration: reducedMotion ? 0 : 0.2 }} />
          </div>
          <h3 id="quiz-question" ref={questionRef} tabIndex={-1} className={`text-lg sm:text-xl font-medium font-regal text-navy leading-relaxed break-words scroll-mt-32 ${focusRing}`}>{question.question}</h3>
          <div role="group" aria-labelledby="quiz-question" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options.map(option => {
              const isSelected = selectedAnswer === option, correct = option === question.answer;
              const style = showFeedback ? correct ? 'bg-green-50 border-green-600 text-green-800' : isSelected ? 'bg-red-50 border-red-600 text-red-800' : 'bg-white border-cream-200 text-navy-600' : 'bg-cream-50/50 hover:bg-cream-100 border-cream-200 text-navy hover:border-gold';
              return <button key={option} type="button" disabled={showFeedback} onClick={() => submitAnswer(option)} aria-pressed={isSelected}
                className={`min-h-14 p-4 border rounded-2xl text-sm font-semibold transition-colors text-left flex justify-between items-center gap-3 break-words ${style} ${focusRing}`}>
                <span className="min-w-0">{option}</span>
                {showFeedback && correct && <><CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" aria-hidden="true" /><span className="sr-only">Correct answer</span></>}
                {showFeedback && isSelected && !correct && <><XCircle className="w-5 h-5 text-red-700 shrink-0" aria-hidden="true" /><span className="sr-only">Your answer was incorrect</span></>}
              </button>;
            })}
          </div>
          <AnimatePresence initial={false}>
            {showFeedback && <motion.div key={question.id} initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.15 }}
              className="p-4 bg-saffron-50/30 border border-saffron-100/50 rounded-2xl space-y-2">
              <div role="status" aria-live="polite"><p className="font-bold text-sm text-navy">{selectedAnswer === question.answer ? 'Correct!' : `Not quite. The answer is ${question.answer}.`}</p><p className="text-sm text-navy-600 leading-relaxed mt-2">{question.explanation}</p></div>
              <p className="flex items-start gap-2 text-xs text-navy-600"><BookOpen className="w-4 h-4 shrink-0 text-gold-700" aria-hidden="true" />{question.source === 'geonames' ? <span>Source: <a href={CITY_DIRECTORY_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline">GeoNames directory</a> · <a href={CITY_DIRECTORY_SOURCE.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">CC BY 4.0</a></span> : 'Source: existing atlas educational entries.'}</p>
            </motion.div>}
          </AnimatePresence>
          <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
            <button type="button" onClick={changeOptions} className={`min-h-11 inline-flex items-center gap-2 py-2 text-sm font-semibold text-navy-600 hover:text-navy ${focusRing}`}><SlidersHorizontal className="w-4 h-4" aria-hidden="true" />Change quiz options</button>
            {showFeedback && <button ref={nextRef} type="button" onClick={nextQuestion} className={`min-h-11 px-5 py-3 bg-navy text-gold-100 border border-gold/30 font-bold rounded-xl inline-flex items-center gap-2 hover:bg-navy-800 transition-colors text-sm ${focusRing}`}>{currentIdx + 1 === questions.length ? 'Finish quiz' : 'Next question'}<ArrowRight className="w-4 h-4 text-gold" aria-hidden="true" /></button>}
          </div>
        </div>
      )}

      {phase === 'complete' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6 space-y-6">
          <div className="w-20 h-20 bg-saffron-50 rounded-3xl flex items-center justify-center border border-saffron-100"><Award className="w-10 h-10 text-gold-700" aria-hidden="true" /></div>
          <div><h3 ref={resultRef} tabIndex={-1} className={`text-xl font-medium font-regal text-navy scroll-mt-32 ${focusRing}`}>Round complete!</h3><p className="text-base text-navy-600 mt-3">You scored <strong className="text-navy">{score} out of {questions.length}</strong>.</p><p className="text-sm text-navy-600 mt-2">{topicLabel} · {questions.length} questions</p></div>
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={startRound} className={`min-h-12 px-6 py-3 bg-navy text-gold-100 hover:bg-navy-800 border border-gold/30 font-bold rounded-2xl inline-flex items-center justify-center gap-2 transition-colors ${focusRing}`}><RotateCcw className="w-4 h-4 text-gold" aria-hidden="true" />Play again</button>
            <button type="button" onClick={changeOptions} className={`min-h-12 px-5 py-3 border border-cream-200 rounded-2xl font-semibold text-sm text-navy hover:bg-cream-50 transition-colors ${focusRing}`}>Change quiz options</button>
          </div>
        </div>
      )}
    </section>
  );
};
