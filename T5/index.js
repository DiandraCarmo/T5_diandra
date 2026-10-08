import { startServer, registerHandler, registerFilter } from './web/server.js';

import log from './filters/log.js';
import auth from './filters/auth.js';
import { getQuestions, getQuestion, createQuestion } from './handlers/questions.js';
import { getAnswer, postAnswer } from './handlers/answer.js';

registerFilter(log);
registerFilter(auth, 'authentication');

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

const port = 9090;

startServer(port).then(() => { // resolve
  console.log(`Server running at http://localhost:${port}`);
}).catch((error) => { // reject
  console.error('Server cannot start: ', error);
});
