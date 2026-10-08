import google from 'eslint-config-google';

// ESLINT Config baseado no Google Style Guide,
// adaptado para um ambiente de desenvolvimento moderno,
// usado na disciplina de Programação Corporativa do
// curso Técnico em Informática para Internet do IFRS - Campus Rio Grande.

export default [
  {
    ...google,
    rules: {
      ...google.rules,

      // Ponto-e-vírgula obrigatório
      'semi': ['error', 'always'],

      // Operador de igualdade estrita
      'eqeqeq': ['error', 'always'],

      // Sem var — apenas const/let
      'no-var': 'error',
      'prefer-const': 'warn',

      // Curly braces para todos os blocos
      'curly': ['warn', 'all'],

      // Estrito: sem console em produção
      // 'no-console': 'warn', // let it go, for now

      // Google usa 2 espaços — força explícito
      'indent': ['warn', 2, { SwitchCase: 1 }],

      // Sem variáveis não utilizadas
      'no-unused-vars': 'warn',

      // Aspas simples
      'quotes': ['warn', 'single', { avoidEscape: true }],

      // Max linha: 80 (padrão Google) -- alterado para 100
      'max-len': ['warn', { code: 100, ignoreUrls: true }],

      // Sem trailing spaces
      'no-trailing-spaces': 'warn',

      // Arrow functions com parênteses sempre
      'arrow-parens': ['warn', 'always'],

      // Sem abreviações em nomes de variáveis
      'id-length': ['warn', { min: 3, exceptions: ['i', 'j', 'x', 'y'] }],

      // Sem reassign em parâmetros de função
      'no-param-reassign': 'warn',

      // Sem return implícito de valor undefined misturado com return de valor
      'consistent-return': 'warn',

      // Sem shadowing de variáveis de escopo externo
      'no-shadow': 'warn',

      // Espaço antes e depois de operadores binários
      'space-infix-ops': 'warn',

      // Espaço após operadores unários de palavra (typeof, void, delete)
      'space-unary-ops': ['warn', { words: true, nonwords: false }],

      // Profundidade máxima de aninhamento
      'max-depth': ['warn', 4],

      // Máximo de parâmetros por função
      'max-params': ['warn', 3],

      // Regras ignoradas
      'object-curly-spacing': 'off',
      'object-curly-newline': 'off',
      'valid-jsdoc': 'off',
      'require-jsdoc': 'off',
    },
  },
];
