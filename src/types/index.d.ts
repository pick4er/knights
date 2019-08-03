
export interface IKnight {
  ['bikeid']: number;
  ['starttime']: string;
  ['tripduration']: number;
  ['birth year']: string;
  ['end station id']: number;
  ['end station latitude']: number;
  ['end station longitude']: number;
  ['end station name']: string;
  ['gender']: string;
  ['start station id']: number;
  ['start station latitude']: number;
  ['start station longitude']: number;
  ['start station name']: string;
  ['starttime']: string;
  ['stoptime']: string;
  ['tripduration']: number;
  ['usertype']: string;
}

export interface IGeoJsonKnight {
  type: string;
  properties: object;
  geometry: object;
}

export interface IPulsingDot {
  width: number;
  height: number;
  data: any;
  context: CanvasRenderingContext2D | null;
  onAdd();
  render(): boolean;
}
