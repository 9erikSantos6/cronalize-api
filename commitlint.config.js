const Configuration = {
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',
  rules: {
    'type-enum': [
      2,
      'always',
      ['foo', 'feat', 'fix', 'chore', 'ci', 'docs', 'style', 'refactor', 'perf', 'test'],
    ],
    'subject-case': [2, 'always', 'lower-case'],
  },
  ignores: [(commit) => commit === ''],
  defaultIgnores: true,
  helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
  prompt: {
    messages: {},
    questions: {
      type: {
        description: 'please input type:',
      },
    },
  },
};

export default Configuration;
