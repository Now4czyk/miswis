export module Models {
  export interface BaseEntity {
    //id is a timestamp
    id: string;
  }

  export type Session = BaseEntity;

  export interface Temperature extends BaseEntity {
    temperature: number;
  }

  export interface Target {
    id: string;
    temperature: number;
  }
}
