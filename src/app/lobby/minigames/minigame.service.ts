import { Injectable } from '@angular/core';
import { MinigameItem } from './minigame-item';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SimpleComponent } from './simple/simple.component';
import { QuestionareComponent } from './questionare/questionare.component';

@Injectable()
export class MinigameService {
  MiniGamesCategories = {
    Loops: [{ categoryName: 'Loops', miniGames: [1] }],
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

  MiniGames: MinigameItem[];

  constructor() {
    this.MiniGames = [
      new MinigameItem(SimpleComponent, {
        name: 'Match3',
        id: 1,
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 0,
            key: 'timer',
            controlType: 'textbox'
          }
        ]
      }),
      new MinigameItem(QuestionareComponent, {
        name: 'Find your path',
        id: 2,
        options: {
          fixedNumberOfQuestions: true,
          numberOfQuestions: 5,
          multipleCorrectAnswers: false,
          allowsImageUpload: false,
          numberOfAnswers: 2
        }
      }),
      new MinigameItem(null, { name: 'Inventory/Marble', id: 3 }), // null because no variables
      new MinigameItem(QuestionareComponent, {
        name: 'Stepping Game',
        id: 4,
        options: {
          fixedNumberOfQuestions: false,
          numberOfQuestions: 5,
          multipleCorrectAnswers: false,
          allowsImageUpload: false,
          numberOfAnswers: 1
        }
      }), // questions
      new MinigameItem(SimpleComponent, {
        name: 'Sound Game',
        id: 5,
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 0,
            key: 'timer',
            controlType: 'textbox'
          }
        ]
      }),
      new MinigameItem(SimpleComponent, {
        name: 'Snake game',
        id: 6,
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 0,
            key: 'timer',
            controlType: 'textbox'
          }
        ]
      }),
      new MinigameItem(SimpleComponent, {
        name: 'Witness Game',
        id: 7,
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 0,
            key: 'timer',
            controlType: 'textbox'
          }
        ]
      }),
      new MinigameItem(SimpleComponent, {
        name: 'Donald Game',
        id: 8,
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 0,
            key: 'timer',
            controlType: 'textbox'
          },
          {
            label: 'Operation family',
            key: 'opfamily',
            controlType: 'dropdown',
            options: [
              { key: 'basicop', value: 'Basic operations' },
              { key: 'advop', value: 'Advanced operations' },
              { key: 'trig', value: 'Trigonometry' },
              { key: 'all', value: 'All' }
            ]
          }
        ]
      }),
      new MinigameItem(QuestionareComponent, {
        name: 'Stepping Game',
        id: 9,
        options: {
          fixedNumberOfQuestions: false,
          numberOfQuestions: 5,
          multipleCorrectAnswers: false,
          allowsImageUpload: false,
          numberOfAnswers: 1
        }
      }),
      new MinigameItem(SimpleComponent, {
        name: 'Slot Machine',
        id: 10,
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 0,
            key: 'timer',
            controlType: 'textbox'
          }
        ]
      }),
      new MinigameItem(QuestionareComponent, {
        name: 'Multiple Questions',
        id: 11,
        options: {
          fixedNumberOfQuestions: false,
          numberOfQuestions: 5,
          multipleCorrectAnswers: true,
          allowsImageUpload: true,
          numberOfAnswers: 4
        },
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 0,
            key: 'timer',
            controlType: 'textbox'
          }
        ]
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
