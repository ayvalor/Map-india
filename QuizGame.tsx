import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, BookOpen, Star } from 'lucide-react';
import { educationalData } from '../../data/educationalData';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
  fact: string;
}

export const QuizGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Generate a randomized bank of questions from our educationalData
  const generateQuiz = () => {
    const questionTemplates: QuizQuestion[] = [];
    const states = Object.keys(educationalData);

    // Template 1: Capitals matching
    states.forEach((stateName, idx) => {
      const state = educationalData[stateName];
      if (state.capital && state.capital !== 'N/A') {
        // Find 3 fake capitals as distractors
        const otherCapitals = states
          .map((s) => educationalData[s].capital)
          .filter((cap) => cap && cap !== 'N/A' && cap !== state.capital);
        
        const shuffledFakes = [...otherCapitals].sort(() => 0.5 - Math.random());
        const options = [state.capital, shuffledFakes[0], shuffledFakes[1], shuffledFakes[2]].sort();

        questionTemplates.push({
          id: idx * 10 + 1,
          question: `What is the capital city of ${stateName}?`,
          options,
          answer: state.capital,
          fact: `${stateName}'s capital is ${state.capital}. ${state.description.slice(0, 100)}...`,
        });
      }
    });

    // Template 2: Landmarks matching
    states.forEach((stateName, idx) => {
      const state = educationalData[stateName];
      state.cities.forEach((city) => {
        if (city.landmarks && city.landmarks.length > 0) {
          const landmark = city.landmarks[0];
          const otherCities = states
            .flatMap((s) => educationalData[s].cities.map((c) => c.name))
            .filter((cName) => cName !== city.name);
          const shuffledFakes = [...otherCities].sort(() => 0.5 - Math.random());
          const options = [city.name, shuffledFakes[0], shuffledFakes[1], shuffledFakes[2]].sort();

          questionTemplates.push({
            id: idx * 10 + 2,
            question: `In which prominent Indian city can you find the famous landmark "${landmark}"?`,
            options,
            answer: city.name,
            fact: `"${landmark}" is located in the beautiful city of ${city.name}, ${stateName}.`,
          });
        }
      });
    });

    // Template 3: Fun Facts matching
    states.forEach((stateName, idx) => {
      const state = educationalData[stateName];
      if (state.funFact && state.funFact.length > 30) {
        const factText = state.funFact.replace(stateName, 'This state');
        const otherStates = states.filter((s) => s !== stateName);
        const shuffledFakes = [...otherStates].sort(() => 0.5 - Math.random());
        const options = [stateName, shuffledFakes[0], shuffledFakes[1], shuffledFakes[2]].sort();

        questionTemplates.push({
          id: idx * 10 + 3,
          question: `Which state is this fact referring to: "${factText}"?`,
          options,
          answer: stateName,
          fact: state.funFact,
        });
      }
    });

    // Template 4: Languages
    states.forEach((stateName, idx) => {
      const state = educationalData[stateName];
      if (state.languages && state.languages.length > 0) {
        const lang = state.languages[0];
        const otherLangs = Array.from(new Set(states.flatMap((s) => educationalData[s].languages))).filter(l => l !== lang);
        const shuffledFakes = [...otherLangs].sort(() => 0.5 - Math.random());
        const options = [lang, shuffledFakes[0], shuffledFakes[1], shuffledFakes[2]].sort();

        questionTemplates.push({
          id: idx * 10 + 4,
          question: `Which language is widely spoken in the state of ${stateName}?`,
          options,
          answer: lang,
          fact: `The primary languages of ${stateName} include ${state.languages.join(', ')}.`,
        });
      }
    });

    // Template 5: City fun facts
    states.forEach((stateName, idx) => {
      educationalData[stateName].cities.forEach((city, cIdx) => {
        if (city.funFacts && city.funFacts.length > 0) {
          const fact = city.funFacts[0];
          const factText = fact.replace(city.name, 'This city');
          const otherCities = states.flatMap(s => educationalData[s].cities.map(c => c.name)).filter(c => c !== city.name);
          const shuffledFakes = [...otherCities].sort(() => 0.5 - Math.random());
          const options = [city.name, shuffledFakes[0], shuffledFakes[1], shuffledFakes[2]].sort();

          questionTemplates.push({
            id: idx * 100 + cIdx * 10 + 5,
            question: `Which city is this fact referring to: "${factText}"?`,
            options,
            answer: city.name,
            fact: fact,
          });
        }
      });
    });

    // Template 6: City location (State)
    states.forEach((stateName, idx) => {
      educationalData[stateName].cities.forEach((city, cIdx) => {
        const otherStates = states.filter((s) => s !== stateName);
        const shuffledFakes = [...otherStates].sort(() => 0.5 - Math.random());
        const options = [stateName, shuffledFakes[0], shuffledFakes[1], shuffledFakes[2]].sort();

        questionTemplates.push({
          id: idx * 100 + cIdx * 10 + 6,
          question: `In which state/union territory is the city of ${city.name} located?`,
          options,
          answer: stateName,
          fact: `${city.name} is a major city in ${stateName}.`,
        });
      });
    });

    // Template 7: State descriptions
    states.forEach((stateName, idx) => {
      const state = educationalData[stateName];
      if (state.description) {
        const descText = state.description.replace(new RegExp(stateName, 'gi'), 'This region');
        const otherStates = states.filter((s) => s !== stateName);
        const shuffledFakes = [...otherStates].sort(() => 0.5 - Math.random());
        const options = [stateName, shuffledFakes[0], shuffledFakes[1], shuffledFakes[2]].sort();

        questionTemplates.push({
          id: idx * 10 + 7,
          question: `Which state or territory is described as: "${descText.slice(0, 150)}..."?`,
          options,
          answer: stateName,
          fact: state.description,
        });
      }
    });

    // Template 8: City Geography
    states.forEach((stateName, idx) => {
      educationalData[stateName].cities.forEach((city, cIdx) => {
        if (city.geography && city.geography.length > 20) {
          const geoText = city.geography.replace(new RegExp(city.name, 'gi'), 'This city');
          const otherCities = states.flatMap(s => educationalData[s].cities.map(c => c.name)).filter(c => c !== city.name);
          const shuffledFakes = [...otherCities].sort(() => 0.5 - Math.random());
          const options = [city.name, shuffledFakes[0], shuffledFakes[1], shuffledFakes[2]].sort();

          questionTemplates.push({
            id: idx * 100 + cIdx * 10 + 8,
            question: `Geographically, which city is described as: "${geoText.slice(0, 150)}..."?`,
            options,
            answer: city.name,
            fact: city.geography,
          });
        }
      });
    });

    // Template 9: State Population
    states.forEach((stateName, idx) => {
      const state = educationalData[stateName];
      if (state.population) {
        const otherStates = states.filter((s) => s !== stateName);
        const shuffledFakes = [...otherStates].sort(() => 0.5 - Math.random());
        const options = [stateName, shuffledFakes[0], shuffledFakes[1], shuffledFakes[2]].sort();

        questionTemplates.push({
          id: idx * 10 + 9,
          question: `Which of the following has a population of approximately ${state.population}?`,
          options,
          answer: stateName,
          fact: `The population of ${stateName} is roughly ${state.population}.`,
        });
      }
    });

    // Template 10: City History
    states.forEach((stateName, idx) => {
      educationalData[stateName].cities.forEach((city, cIdx) => {
        if (city.history && city.history.length > 20) {
          const histText = city.history.replace(new RegExp(city.name, 'gi'), 'This city');
          const otherCities = states.flatMap(s => educationalData[s].cities.map(c => c.name)).filter(c => c !== city.name);
          const shuffledFakes = [...otherCities].sort(() => 0.5 - Math.random());
          const options = [city.name, shuffledFakes[0], shuffledFakes[1], shuffledFakes[2]].sort();

          questionTemplates.push({
            id: idx * 100 + cIdx * 10 + 10,
            question: `Historically, which city is known for this: "${histText.slice(0, 150)}..."?`,
            options,
            answer: city.name,
            fact: city.history,
          });
        }
      });
    });

    // Shuffle and pick 10 questions for a varied round
    const shuffledQuestions = [...questionTemplates]
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);

    setQuestions(shuffledQuestions);
    setCurrentIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setQuizFinished(false);
    setIsPlaying(true);
  };

  const handleAnswerSubmit = (option: string) => {
    if (showFeedback) return;
    
    setSelectedAnswer(option);
    const correct = option === questions[currentIdx].answer;
    if (correct) {
      setScore((prev) => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="bg-white border border-cream-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-colors duration-300 w-full min-h-[480px]">
      
      {/* Intro State */}
      {!isPlaying && !quizFinished && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6">
          <div className="w-16 h-16 bg-saffron-50 text-saffron rounded-2xl flex items-center justify-center border border-saffron-100">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-medium font-regal text-navy tracking-wide">
              Bharat Geography Quiz
            </h3>
            <p className="text-xs text-navy-600 mt-2 max-w-sm font-medium leading-relaxed">
              Challenge yourself with 5 dynamic, curriculum-aligned questions about Indian states, capitals, landmarks, and national history.
            </p>
          </div>
          <button
            onClick={generateQuiz}
            className="px-8 py-3.5 bg-navy text-gold-100 hover:bg-navy-800 border border-gold/30 font-bold rounded-2xl transition-all shadow-md flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
          >
            Start Quiz Round
            <ArrowRight className="w-4.5 h-4.5 text-gold" />
          </button>
        </div>
      )}

      {/* Quiz Progress & Question Rendering */}
      {isPlaying && !quizFinished && questions.length > 0 && (
        <div className="flex-1 flex flex-col justify-between space-y-6">
          
          {/* Progress Header */}
          <div className="flex items-center justify-between select-none">
            <span className="text-[10px] font-extrabold text-navy-600 uppercase tracking-wider">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-saffron bg-saffron-50 px-3 py-1.5 rounded-lg border border-saffron-100/50">
              <Star className="w-3.5 h-3.5 fill-current" />
              Score: {score}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-cream-100 h-1.5 rounded-full overflow-hidden">
            <motion.div
              className="bg-saffron h-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Question Text */}
          <div className="text-base sm:text-lg font-medium font-regal text-navy leading-snug tracking-wide">
            {questions[currentIdx].question}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {questions[currentIdx].options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer = option === questions[currentIdx].answer;

              let buttonStyle = 'bg-cream-50/50 hover:bg-cream-100 border border-cream-200 text-navy-850 hover:border-gold/50';
              
              if (showFeedback) {
                if (isCorrectAnswer) {
                  buttonStyle = 'bg-green-500/10 border-green-500 text-green-700 font-bold';
                } else if (isSelected) {
                  buttonStyle = 'bg-red-500/10 border-red-500 text-red-700 font-bold';
                } else {
                  buttonStyle = 'opacity-40 border-cream-105';
                }
              }

              return (
                <button
                  key={option}
                  disabled={showFeedback}
                  onClick={() => handleAnswerSubmit(option)}
                  className={`p-4 border rounded-2xl text-xs font-bold transition-all text-left flex justify-between items-center cursor-pointer ${buttonStyle}`}
                >
                  <span>{option}</span>
                  {showFeedback && isCorrectAnswer && (
                    <CheckCircle2 className="w-4.5 h-4.5 text-green-600 shrink-0" />
                  )}
                  {showFeedback && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-4.5 h-4.5 text-red-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanatory educational feedback box */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-4 bg-saffron-50/20 border border-saffron-100/50 rounded-2xl space-y-2 select-none"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-saffron" />
                  <span className="text-[9px] font-extrabold text-saffron uppercase tracking-wider">
                    Educational Insight
                  </span>
                </div>
                <p className="text-xs text-navy-600 leading-relaxed font-semibold">
                  {questions[currentIdx].fact}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            {showFeedback && (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-navy text-gold-100 border border-gold/30 font-bold rounded-xl flex items-center gap-2 hover:bg-navy-800 hover:scale-[1.01] transition-all text-xs cursor-pointer"
              >
                {currentIdx + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
                <ArrowRight className="w-4 h-4 text-gold" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Finished State */}
      {quizFinished && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6">
          <div className="w-20 h-20 bg-saffron-50 text-saffron rounded-3xl flex items-center justify-center border border-saffron-100">
            <Award className="w-10 h-10 text-gold-700" />
          </div>
          <div>
            <h3 className="text-xl font-medium font-regal text-navy tracking-wide">
              Round Complete!
            </h3>
            <p className="text-xs text-navy-600 mt-2 font-bold uppercase tracking-wider">
              You scored <span className="text-saffron font-black text-sm">{score}</span> out of <span className="text-navy">{questions.length}</span>!
            </p>
          </div>
          
          <button
            onClick={generateQuiz}
            className="px-8 py-3.5 bg-navy text-gold-100 hover:bg-navy-800 border border-gold/30 font-bold rounded-2xl transition-all shadow-md flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-gold" />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
