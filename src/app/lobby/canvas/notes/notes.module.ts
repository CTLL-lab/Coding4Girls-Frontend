import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteComponent } from './note/note.component';
import { FormsModule } from '@angular/forms';
import {
  AngularDraggableModule,
  AngularDraggableDirective,
  AngularResizableDirective
} from 'angular2-draggable';
import { MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { HoldableDirective } from './directives/holdable/holdable.directive';
import { NotesProviderService } from './services/notes/notes-provider.service';
import { UploaderService } from './services/uploader/uploader.service';
import { EmbedVideoService } from './services/embed/embed-video.service';

@NgModule({
  declarations: [NoteComponent, HoldableDirective],
  imports: [
    CommonModule,
    FormsModule,
    AngularDraggableModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptionsFactory
      }
    })
  ],
  exports: [
    NoteComponent,
    AngularDraggableDirective,
    AngularResizableDirective
  ],
  providers: [NotesProviderService, UploaderService, EmbedVideoService]
})
export class NotesModule {}

// Markdown options factory for links to open in new tab by default
export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  const linkRenderer = renderer.link;

  renderer.link = (href, title, text) => {
    const html = linkRenderer.call(renderer, href, title, text);
    return html.replace(
      /^<a /,
      '<a role="link" tabindex="0" target="_blank" rel="nofollow noopener noreferrer" '
    );
  };

  return {
    renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
  };
}
