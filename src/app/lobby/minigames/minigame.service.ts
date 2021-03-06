import { Injectable } from '@angular/core';
import { MinigameItem } from './minigame-item';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SimpleComponent } from './simple/simple.component';
import { QuestionareComponent } from './questionare/questionare.component';

@Injectable()
export class MinigameService {
  MiniGamesCategories = {
    None: [
      {
        categoryName: 'None',
        miniGames: [null],
        translation: 'minigameCategories.1'
      }
    ],
    Loops: [
      {
        categoryName: 'Loops',
        miniGames: [1],
        translation: 'minigameCategories.2'
      }
    ],
    Conditionals: [
      {
        categoryName: 'Conditionals',
        miniGames: [2],
        translation: 'minigameCategories.3'
      }
    ],
    Variables: [
      {
        categoryName: 'Data types',
        miniGames: [3],
        translation: 'minigameCategories.4'
      },
      {
        categoryName: 'Data structures',
        miniGames: [3],
        translation: 'minigameCategories.5'
      }
    ],

    Statements: [
      {
        categoryName: 'Sequence of statements',
        miniGames: [4],
        translation: 'minigameCategories.6'
      },
      {
        categoryName: 'Sounds',
        miniGames: [5],
        translation: 'minigameCategories.7'
      },
      {
        categoryName: 'Movement',
        miniGames: [4],
        translation: 'minigameCategories.8'
      },
      {
        categoryName: 'Looks',
        miniGames: [6],
        translation: 'minigameCategories.9'
      },
      {
        categoryName: 'Drawing',
        miniGames: [7],
        translation: 'minigameCategories.10'
      }
    ],

    Parallelism: [
      {
        categoryName: 'Simultaneous sounds/movements/characters/interactions',
        miniGames: [8],
        translation: 'minigameCategories.11'
      }
    ],
    Operators: [
      {
        categoryName: '4 basic operations',
        miniGames: [8],
        translation: 'variables.3'
      },
      {
        categoryName: 'Modulo, roundings',
        miniGames: [8],
        translation: 'variables.4'
      },
      {
        categoryName: 'Advanced, sin, cos, sqrt, power, roundings',
        miniGames: [8],
        translation: 'variables.5'
      },
      {
        categoryName: 'Random',
        miniGames: [10],
        translation: 'minigameCategories.16'
      }
    ],
    Events: [
      {
        categoryName: 'Events',
        miniGames: [9],
        translation: 'minigameCategories.18'
      }
    ],
    MultipleChoiceQuestions: [
      {
        categoryName: 'Multiple Choice Questions',
        miniGames: [11],
        translation: 'minigame.10'
      }
    ],
    All: [
      {
        categoryName: 'All',
        miniGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        translation: 'variables.6'
      }
    ]
  };

  MiniGames: MinigameItem[];

  MiniGameTags = [
    'None',
    'Loops',
    'Conditionals',
    'Data types',
    'Data structures',
    'Sequence of statements',
    'Sounds',
    'Movement',
    'Looks',
    'Drawing',
    'Simultaneous sounds/movements/characters/interactions',
    '4 basic operations',
    'Modulo, roundings',
    'Advanced, sin, cos, sqrt, power, roundings',
    'AND/OR/NOT, booleans, ==',
    'Random',
    'Simultaneous sounds/movements/characters/interactions',
    'Events'
  ];

  constructor() {
    this.MiniGames = [
      new MinigameItem(SimpleComponent, {
        name: 'Match3',
        id: 1,
        translation: 'minigame.1',
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 120,
            key: 'timer',
            controlType: 'textbox',
            translation: 'variables.1'
          },
          {
            label: 'Score',
            type: 'number',
            value: 500,
            key: 'score',
            controlType: 'textbox',
            translation: 'variables.12'
          }
          // {
          //   label: 'Timer/Score',
          //   key: 'condition',
          //   controlType: 'dropdown',
          //   // translation: 'variables.2',
          //   options: [
          //     {
          //       key: 'timer',
          //       value: 'Timer',
          //       translation: 'variables.1'
          //     },
          //     {
          //       key: 'score',
          //       value: 'Score',
          //       translation: 'variables.12'
          //     }
          //   ]
          // }
        ]
      }),
      new MinigameItem(QuestionareComponent, {
        name: 'Find your path',
        id: 2,
        translation: 'minigame.2',
        options: {
          fixedNumberOfQuestions: true,
          numberOfQuestions: 5,
          multipleCorrectAnswers: false,
          allowsImageUpload: false,
          numberOfAnswers: 2
        },
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 120,
            key: 'timer',
            controlType: 'textbox',
            translation: 'variables.1'
          }
        ]
      }),
      new MinigameItem(SimpleComponent, {
        name: 'Inventory/Marble',
        id: 3,
        translation: 'minigame.3',
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 120,
            key: 'timer',
            controlType: 'textbox',
            translation: 'variables.1'
          },
          {
            label: 'Instructions',
            type: 'text',
            value: 0,
            key: 'instructions',
            controlType: 'textarea',
            translation: 'edit-team.6'
          }
        ]
      }),
      new MinigameItem(QuestionareComponent, {
        name: 'Stepping Game',
        translation: 'minigame.4',
        id: 4,
        options: {
          fixedNumberOfQuestions: false,
          numberOfQuestions: 5,
          multipleCorrectAnswers: false,
          allowsImageUpload: false,
          numberOfAnswers: 1
        },
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 120,
            key: 'timer',
            controlType: 'textbox',
            translation: 'variables.1'
          }
        ]
      }), // questions
      new MinigameItem(SimpleComponent, {
        name: 'Sound Game',
        id: 5,
        translation: 'minigame.5',
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 120,
            key: 'timer',
            controlType: 'textbox',
            translation: 'variables.1'
          }
        ]
      }),
      new MinigameItem(SimpleComponent, {
        name: 'Snake game',
        id: 6,
        translation: 'minigame.6',
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 120,
            key: 'timer',
            controlType: 'textbox',
            translation: 'variables.1'
          },
          {
            label: 'Score',
            type: 'number',
            value: 500,
            key: 'score',
            controlType: 'textbox',
            translation: 'variables.12'
          }
        ]
      }),
      new MinigameItem(SimpleComponent, {
        name: 'Witness Game',
        id: 7,
        translation: 'minigame.7',
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 120,
            key: 'timer',
            controlType: 'textbox',
            translation: 'variables.1'
          }
        ]
      }),
      new MinigameItem(SimpleComponent, {
        name: 'Donald Game',
        id: 8,
        translation: 'minigame.8',
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 120,
            key: 'timer',
            controlType: 'textbox',
            translation: 'variables.1'
          },
          {
            label: 'Operation family',
            key: 'opfamily',
            controlType: 'dropdown',
            translation: 'variables.2',
            options: [
              {
                key: 'basicop',
                value: 'Basic operations',
                translation: 'variables.3'
              },
              {
                key: 'advop',
                value: 'Advanced operations',
                translation: 'variables.4'
              },
              {
                key: 'trig',
                value: 'Trigonometry',
                translation: 'variables.5'
              },
              { key: 'bool', value: 'Boolean', translation: 'variables.11' }
              // 'all' category has been removed
              // { key: 'all', value: 'All', translation: 'variables.6' }
            ]
          }
        ]
      }),
      new MinigameItem(QuestionareComponent, {
        name: 'Stepping Game',
        id: 9,
        translation: 'minigame.4',
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 120,
            key: 'timer',
            controlType: 'textbox',
            translation: 'variables.1'
          }
        ],
        options: {
          fixedNumberOfQuestions: false,
          numberOfQuestions: 5,
          multipleCorrectAnswers: false,
          allowsImageUpload: false,
          numberOfAnswers: 1
        }
      }),
      new MinigameItem(SimpleComponent, {
        name: 'Dice',
        id: 10,
        translation: 'minigame.9',
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 120,
            key: 'timer',
            controlType: 'textbox',
            translation: 'variables.1'
          },
          {
            label: 'Score',
            type: 'number',
            value: 500,
            key: 'score',
            controlType: 'textbox',
            translation: 'variables.12'
          }
        ]
      }),
      new MinigameItem(QuestionareComponent, {
        name: 'Multiple Questions',
        id: 11,
        translation: 'minigame.10',
        options: {
          fixedNumberOfQuestions: false,
          numberOfQuestions: 5,
          multipleCorrectAnswers: true,
          allowsImageUpload: true,
          numberOfAnswers: 4,
          hasHints: true
        },
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 120,
            key: 'timer',
            controlType: 'textbox',
            translation: 'variables.1'
          }
        ]
      }),
      // none minigame
      new MinigameItem(null, {
        name: 'None',
        id: null,
        translation: 'minigameHeaders.1'
      })
    ];
  }
  getMinigames(): MinigameItem[] {
    return this.MiniGames;
  }

  getMinigamesCategories() {
    return this.MiniGamesCategories;
  }

  getMinigameByIDAsFormGroup(id: number) {
    let group: any = {};
    const minigame = this.getMinigameItemByID(id);
    if (minigame.data.variables != null) {
      minigame.data.variables.forEach(question => {
        group[question.key] = question.required
          ? new FormControl(question.value || '', Validators.required)
          : new FormControl(question.value || '');
      });
    }
    return new FormGroup(group);
  }

  getMinigameItemByID(id): MinigameItem {
    return this.MiniGames.find(x => x.data.id == id);
  }
}
