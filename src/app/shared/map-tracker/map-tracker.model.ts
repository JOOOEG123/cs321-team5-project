export class PinInformation {
  public imageLocation: string = '';
  public imageXSize: number = 0;
  public imageYSize: number = 0;
  public pins: Array<Pin> = [];
}
export class Pin {
  text: string | undefined;
  header: string | undefined;
  xcoords: number = 0;
  ycoords: number = 0;
  id!: string;
  direction: Direction = 0;
  size: Size = 0;
}
export class PinUpdate {
  id: string | undefined = undefined;
  text: string | undefined = undefined;
  header: string | undefined = undefined;
}

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}
export enum Size {
  Small,
  Medium,
  Large,
}

