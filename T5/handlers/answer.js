import db from '../db/Database.js';

export function getAnswer(request, response, id) {
  const question = db.prepare(`
    SELECT stem, answer, distractors, random
    FROM questions
    WHERE id = ?
  `).get(id);
  if (!question) {
    response.writeHead(404);
    response.end();
    return;
  }
  const alternatives = [
    question.answer,
    ...JSON.parse(question.distractors),
  ];
  if (question.random) {
    alternatives.sort(() => Math.random() - 0.5);
  }
  response.writeHead(200, {
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify({
    question: question.stem,
    alternatives,
  }));
}

export function postAnswer(request, response, id) {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk;
  });
  request.on('end', () => {
    const data = JSON.parse(body);
    const question = db.prepare(`
      SELECT answer
      FROM questions
      WHERE id = ?
    `).get(id);
    if (!question) {
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(200, {
      'Content-Type': 'application/json',
    });
    response.end(JSON.stringify({
      right: data.choice === question.answer,
    }));
  });
}
