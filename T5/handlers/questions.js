import db from '../db/Database.js';

export function getQuestions(request, response) {
  const questions = db.prepare(`
    SELECT id, stem
    FROM questions
    LIMIT 10
  `).all();
  response.writeHead(200, {
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify(questions));
}

export function getQuestion(request, response, id) {
  const question = db.prepare(`
    SELECT id, stem, answer, distractors, random
    FROM questions
    WHERE id = ?
  `).get(id);
  if (!question) {
    response.writeHead(404);
    response.end();
    return;
  }
  question.distractors = JSON.parse(question.distractors);
  question.random = Boolean(question.random);
  response.writeHead(200, {
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify(question));
}

export function createQuestion(request, response) {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk;
  });
  request.on('end', () => {
    const data = JSON.parse(body);
    const result = db.prepare(`
      INSERT INTO questions (stem, answer, distractors, random)
      VALUES (?, ?, ?, ?)
    `).run(
      data.stem,
      data.answer,
      JSON.stringify(data.distractors),
      data.random ? 1 : 0,
    );
    const question = {
      id: result.lastInsertRowid,
      stem: data.stem,
      answer: data.answer,
      distractors: data.distractors,
      random: data.random,
    };
    response.writeHead(201, {
      'Content-Type': 'application/json',
    });
    response.end(JSON.stringify(question));
  });
}
