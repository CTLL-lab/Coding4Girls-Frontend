export const MiniGames = [
  { name: 'Match3', id: 1 },
  { name: 'Find your path', id: 2 },
  { name: 'Inventory/Marble', id: 3 },
  { name: 'Stepping Game', id: 4 },
  { name: 'Sound Game', id: 5 },
  { name: 'Snake game', id: 6 },
  { name: 'Witness Game', id: 7 },
  {
    name: 'Donald Game',
    id: 8,
    variables: [
      { name: 'first_var', value: 'test1' },
      { name: 'second_var', value: 'test2' }
    ]
  },
  { name: 'Stepping Game', id: 9 },
  { name: 'Slot Machine', id: 10 },
  {
    name: 'Multiple Questions',
    id: 11,
    variables: [
      { name: 'first_question', value: 'first_answer' },
      { name: 'second_question', value: 'second_answer' }
    ]
  }
];

export const MiniGamesCategories = {
  Loops: [{ categoryName: 'Loop', miniGames: [1] }],
  Conditionals: [
    {
      categoryName: 'Conditionals',
      miniGames: [2]
    }
  ],
  Variables: [
    {
      categoryName: 'Data types',
      miniGames: [3]
    },
    {
      categoryName: 'Data structures',
      miniGames: [3]
    }
  ],

  Statements: [
    {
      categoryName: 'Sequence of statements',
      miniGames: [4, 11]
    },
    {
      categoryName: 'Sounds',
      miniGames: [5]
    },
    {
      categoryName: 'Movement',
      miniGames: [4]
    },
    { categoryName: 'Looks', miniGames: [6] },
    {
      categoryName: 'Drawing',
      miniGames: [7]
    }
  ],

  Parallelism: [
    {
      categoryName: 'Simultaneous sounds/movements/characters/interactions',
      miniGames: [8]
    }
  ],
  Operators: [
    {
      categoryName: '4 basic operations',
      miniGames: [8]
    },
    {
      categoryName: 'Modulo, roundings',
      miniGames: [8]
    },
    {
      categoryName: 'Advanced, sin, cos, sqrt, power, roundings',
      miniGames: [8]
    },
    {
      categoryName: 'AND/OR/NOT, booleans, ==',
      miniGames: [8]
    },
    {
      categoryName: 'Random',
      miniGames: [10]
    },
    {
      categoryName: 'Simultaneous sounds/movements/characters/interactions',
      miniGames: [8]
    }
  ],
  Events: [
    {
      categoryName: 'Events',
      miniGames: [9]
    }
  ]
};
