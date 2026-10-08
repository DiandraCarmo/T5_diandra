import { test, expect, beforeAll } from 'vitest';
import { startServer, registerHandler } from './web/server.js';
import db from './db/Database.js';
import { getQuestions, getQuestion, createQuestion } from './handlers/questions.js';
import { getAnswer, postAnswer } from './handlers/answer.js';

process.env.NODE_ENV = 'test';

const PORT = 8080;
const BASE_URL = `http://localhost:${PORT}`;

beforeAll(async () => {
  registerHandler({
    method: 'GET',
    path: '/questions',
    accept: ['application/json'],
  }, getQuestions);

  registerHandler({
    method: 'GET',
    path: '/questions/:id',
    accept: ['application/json'],
  }, getQuestion);

  registerHandler({
    method: 'POST',
    path: '/question',
    accept: ['application/json'],
  }, createQuestion);

  registerHandler({
    method: 'GET',
    path: '/answers/:id',
    accept: ['application/json'],
  }, getAnswer);

  registerHandler({
    method: 'POST',
    path: '/answer/:id',
    accept: ['application/json'],
  }, postAnswer);
  await startServer(PORT);

  db.prepare(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stem TEXT,
      answer TEXT,
      distractors TEXT,
      random INTEGER
    )
  `).run();

  db.prepare('DELETE FROM questions').run();
  db.prepare("DELETE FROM sqlite_sequence WHERE name='questions'").run();

  db.prepare(`
    INSERT INTO questions (id, stem, answer, distractors, random)
    VALUES 
    (1,
    'How many days are there in a week?',
    '7 days',
    '["5 days","8 days","1 week"]',
    0),
    (2,
    'What do humans need to breathe to survive?',
    'Oxygen',
    '["Carbon dioxide","Nitrogen","Helium"]',
    1)
  `).run();
});

test('GET /questions - Deve listar as questões (máximo 10)', async () => {
  const response = await fetch(`${BASE_URL}/questions`, {
    headers: { 'Accept': 'application/json' },

  });

  expect(response.status).toBe(200);
  const body = await response.json();

  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeLessThanOrEqual(10);

  const ques1 = body.find((ques) => ques.id === 1);
  expect(ques1).toBeDefined();
  expect(ques1.stem).toBe('How many days are there in a week?');
  expect(ques1.answer).toBeUndefined();
});

test('GET /questions/1 - Deve retornar a questão 1 completa', async () => {
  const response = await fetch(`${BASE_URL}/questions/1`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer super-secret-token',
    },
  });

  expect(response.status).toBe(200);
  const body = await response.json();

  expect(body).toEqual({
    id: 1,
    stem: 'How many days are there in a week?',
    answer: '7 days',
    distractors: ['5 days', '8 days', '1 week'],
    random: false,
  });
});

test('POST /question - Deve criar uma nova questão e retornar o objeto com ID gerado', async () => {
  const novaQuestao = {
    stem: 'What is the most likely reason someone opens the fridge for the third time?',
    answer: 'New food might have spawned',
    distractors: [
      'They forgot what they wanted',
      'They are conducting an experiment',
      'The fridge told them to',
    ],
    random: true,
  };

  const response = await fetch(`${BASE_URL}/question`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer super-secret-token',
    },
    body: JSON.stringify(novaQuestao),
  });

  expect(response.status).toBe(201);
  const body = await response.json();

  expect(body.id).toBe(3);
  expect(body.stem).toBe(novaQuestao.stem);
  expect(body.random).toBe(true);
});

test('GET /answers/1 - Deve retornar formato de exibição sem a propriedade "answer"', async () => {
  const response = await fetch(`${BASE_URL}/answers/1`, {
    headers: { 'Accept': 'application/json' },
  });

  expect(response.status).toBe(200);
  const body = await response.json();

  expect(body.question).toBe('How many days are there in a week?');
  expect(body.answer).toBeUndefined();
  expect(body.alternatives).toContain('7 days');
  expect(body.alternatives.length).toBe(4);
});

test('POST /answer/1 - Deve validar resposta CORRETA e retornar right: true', async () => {
  const response = await fetch(`${BASE_URL}/answer/1`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer super-secret-token',
    },
    body: JSON.stringify({ choice: '7 days' }),
  });

  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body).toEqual({ right: true });
});

test('POST /answer/1 - Deve validar resposta INCORRETA e retornar right: false', async () => {
  const response = await fetch(`${BASE_URL}/answer/1`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer super-secret-token',
    },
    body: JSON.stringify({ choice: '5 days' }),
  });

  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body).toEqual({ right: false });
});
