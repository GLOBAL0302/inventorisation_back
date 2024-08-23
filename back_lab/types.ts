export interface ICategory {
  id: number;
  title: string;
  description: string;
}

export interface ILocation {
  id: number;
  title: string;
  description: string;
}

export interface IRecord {
  id: number;
  category_id: number;
  location_id: number;
  title: string;
  description: string;
  image: string | null;
  create_at: string;
}

export type IRecordsMutations = Omit<IRecord, 'id' | 'create_at'>;
