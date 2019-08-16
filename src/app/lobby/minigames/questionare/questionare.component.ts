import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { UploaderService } from 'src/app/shared/services/uploader/uploader.service';

// options: {
//   fixedNumberOfQuestions: false,
//   numberOfQuestions: 5,
//   multipleCorrectAnswers: true,
//   allowsImageUpload: true,
//   numberOfAnswers: 4
// }

@Component({
  selector: 'app-questionare',
  templateUrl: './questionare.component.html',
  styleUrls: ['./questionare.component.css']
})
export class QuestionareComponent implements OnInit {
  @Input() variables;
  @Input() options: {
    fixedNumberOfQuestions: boolean;
    numberOfQuestions?: number;
    multipleCorrectAnswers: boolean;
    allowsImageUpload: boolean;
    numberOfAnswers: number;
  };
  @Input() form: FormGroup;

  questionImages: Array<string> = [];
  answersImages: Array<Array<string>> = [];
  constructor(private uploader: UploaderService) {}

  ngOnInit() {
    this.form.addControl('questions', new FormArray([]));
    if (this.options.fixedNumberOfQuestions) {
      for (let i = 0; i < this.options.numberOfQuestions; i++) {
        const question = new FormGroup({
          question: new FormControl(''),
          answers: new FormArray([])
        });
        if (this.options.allowsImageUpload) {
          question.addControl('questionImage', new FormControl(''));
        }
        for (let j = 0; j < this.options.numberOfAnswers; j++) {
          const answer = new FormGroup({
            answer: new FormControl(''),
            correct: new FormControl(false)
          });
          if (this.options.allowsImageUpload) {
            answer.addControl('image', new FormControl(''));
          }
          (question.get('answers') as FormArray).push(answer);
        }
        this.QuestionsForm.push(question);
      }
    }
  }

  get QuestionsForm() {
    return this.form.get('questions') as FormArray;
  }

  addQuestion() {
    // we create a new Form group to facilitate the question and its contents
    const question = new FormGroup({
      question: new FormControl(''),
      answers: new FormArray([])
    });
    // if we can have pictures add a new form control for that
    if (this.options.allowsImageUpload) {
      question.addControl('questionImage', new FormControl(''));
    }
    // for each answer
    for (let j = 0; j < this.options.numberOfAnswers; j++) {
      // create a form group for it and for its details
      const answer = new FormGroup({
        answer: new FormControl(''),
        correct: new FormControl(false)
      });
      // add a form control if we can upload images
      if (this.options.allowsImageUpload) {
        answer.addControl('image', new FormControl(''));
      }
      // push the answer to questions array
      // we need to typecast so typescript treats it as an FormArray
      (question.get('answers') as FormArray).push(answer);
    }
    this.QuestionsForm.push(question);
  }

  fileChange(event: any, i, j) {
    const file: File = event.target.files[0];
    this.uploader.uploadImage(file).subscribe(r => {
      const imageURL = r['data']['link'];
      if (j == -1) {
        // if user uploaded a question image
        this.QuestionsForm.at(i)
          .get('questionImage')
          .setValue(imageURL);
      } else {
        // if user uploaded an answer image
        (<FormArray>this.QuestionsForm.at(i).get('answers'))
          .at(j)
          .get('image')
          .setValue(imageURL);
      }
    });
  }
}
