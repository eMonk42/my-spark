export interface Note {
  id: string;
  title: string;
  content?: string;
  collection: string;
  createdBy: string;
  createdAt: Date;
  deletedAt: Date;
  updatedAt: Date;
}
