import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnapService {
  public worldBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  private sub: Subscription;
  constructor() {
    console.log('snap service created');

    window['world'] = this.worldBehaviorSubject;
    this.worldBehaviorSubject.subscribe(x => {
      console.log('new snap world', x);
    });
  }

  LoadProject(project: string) {
    this.sub = this.worldBehaviorSubject.subscribe(world => {
      if (world == null) {
        return;
      }
      if (project.startsWith('<project')) {
        world.children[0].rawOpenProjectString(project);
        this.sub.unsubscribe();
      }
    });
  }

  GetCurrentSnapData(projectName: string = ''): string {
    const world = this.worldBehaviorSubject.value;

    // If not initiated yet, we wait
    // because this code runs when the user clicks the Save button
    // in edit team
    if (world == null) {
      return;
    }

    let snapTemplateXML: string;

    if (this.isSnapCanvasEmpty(world)) {
      // Snap will produce some xml even with no blocks
      // so to save space in database we store an empty string
      snapTemplateXML = '';
    } else {
      world.children[0].setProjectName(projectName);
      snapTemplateXML = world.children[0].serializer.serialize(
        world.children[0].stage
      );
    }
    return snapTemplateXML;
  }

  // Takes the world as argument and uses the serializer
  // to find if the canvas is empty or not
  isSnapCanvasEmpty(a): boolean {
    // Load the current project to the serializer
    a.children[0].serializer.store(a.children[0].stage);
    const numberOfContents = a.children[0].serializer.contents.length;
    a.children[0].serializer.flush();
    // An empty project has 15 contents. So if we have 15, the user didn't add any blocks
    if (numberOfContents == 15) {
      return true;
    }
    return false;
  }
}
