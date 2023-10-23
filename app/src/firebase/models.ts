export module Models {
  export interface BaseEntity {
    id: string;
    timestamp: string;
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
