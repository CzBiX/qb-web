export interface Group {
  title: string;
  icon: string;
  children: Child[];
  model: boolean;
  select: string;
}

export interface Child {
  title: string;
  key: string | null;
  icon: string;
  append: string | null;
}