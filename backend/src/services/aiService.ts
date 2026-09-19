export interface AiQuestionService {
  generateQuestion(instruction?: string, excludedQuestions?: string[]): string;
}

const QUESTIONS: string[] = [
  "What's the funniest excuse someone could give for being late to college?",
  "What would be the worst superpower to have?",
  "If animals could talk, which animal would be the rudest?",
  "What's the most ridiculous thing you could bring to a job interview?",
  "What would happen if your phone could expose all your secrets?",
  "I have keys but no locks, space but no room. What am I?",
];

export class MockAiQuestionService implements AiQuestionService {
  generateQuestion(instruction = "", excludedQuestions: string[] = []) {
    const normalizedInstruction = instruction.trim().toLowerCase();
    const matchingQuestions = QUESTIONS.filter((question) => {
      if (normalizedInstruction.includes("riddle")) {
        return question.includes("keys but no locks");
      }

      if (normalizedInstruction.includes("college")) {
        return question.includes("college");
      }

      if (normalizedInstruction.includes("funny")) {
        return question.includes("funniest") || question.includes("ridiculous");
      }

      return true;
    });

    const unusedQuestions = QUESTIONS.filter((candidate) => !excludedQuestions.includes(candidate));
    const unusedMatchingQuestions = matchingQuestions.filter((candidate) => !excludedQuestions.includes(candidate));
    const questions = unusedMatchingQuestions.length > 0
      ? unusedMatchingQuestions
      : unusedQuestions.length > 0
        ? unusedQuestions
        : matchingQuestions.length > 0
          ? matchingQuestions
          : QUESTIONS;
    return questions[Math.floor(Math.random() * questions.length)] ?? QUESTIONS[0]!;
  }
}

export const aiQuestionService: AiQuestionService = new MockAiQuestionService();
