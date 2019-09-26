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
    ]
  };

  MiniGames: MinigameItem[];

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
            value: 0,
            key: 'timer',
            controlType: 'textbox',
            translation: 'variables.1'
          }
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
        }
      }),
      new MinigameItem(null, {
        name: 'Inventory/Marble',
        id: 3,
        translation: 'minigame.3'
      }), // null because no variables
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
        }
      }), // questions
      new MinigameItem(SimpleComponent, {
        name: 'Sound Game',
        id: 5,
        translation: 'minigame.5',
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 0,
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
            value: 0,
            key: 'timer',
            controlType: 'textbox',
            translation: 'variables.1'
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
            value: 0,
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
            value: 0,
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
              { key: 'all', value: 'All', translation: 'variables.6' }
            ]
          }
        ]
      }),
      new MinigameItem(QuestionareComponent, {
        name: 'Stepping Game',
        id: 9,
        translation: 'minigame.4',
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
        translation: 'minigame.9',
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 0,
            key: 'timer',
            controlType: 'textbox',
            translation: 'variables.1'
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
          numberOfAnswers: 4
        },
        variables: [
          {
            label: 'Timer',
            type: 'number',
            value: 0,
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
