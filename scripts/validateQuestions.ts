import { QUESTIONS } from '@/src/data/questions';

const errors: string[] = [];
const ids = new Set<string>();

for (const question of QUESTIONS) {
  if (ids.has(question.id)) errors.push(`${question.id}: doppelte ID`);
  ids.add(question.id);
  if (!question.text.trim()) errors.push(`${question.id}: fehlender Fragetext`);
  if (question.options.length !== 4) errors.push(`${question.id}: nicht genau vier Antworten`);
  if (new Set(question.options).size !== 4) errors.push(`${question.id}: Antworten wiederholen sich`);
  if (question.correctIndex < 0 || question.correctIndex > 3) errors.push(`${question.id}: ungültige richtige Antwort`);
  if (!question.hint.trim()) errors.push(`${question.id}: fehlender Hinweis`);
  if (!question.explanation.trim()) errors.push(`${question.id}: fehlende Erklärung`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`✓ ${QUESTIONS.length} Fragen validiert.`);
