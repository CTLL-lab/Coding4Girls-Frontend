export class PostIt {
  public id: string;
  public type: string;
  public text: string;
  public content: string;
  public position = { x: 0, y: 0, z: 1 };
  public size = { width: 250, height: 150 };
  public locked: boolean;
  public color: string;
  public isUnderEditing = false;
  public contentposter: string;
  constructor(
    text: string = '',
    x: number = Math.random(),
    y: number = Math.random(),
    type: string = 'text',
    content: string = '',
    z: number = 1
  ) {
    this.id =
      '_' +
      Math.random()
        .toString(36)
        .substr(2, 15);
    this.text = text;
    this.type = type;
    this.position = { x: x, y: y, z: z };
    this.content = content;
    this.locked = false;
    this.color = '#ffff99';
  }
}
