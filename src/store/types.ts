import { MainData } from '@/types';

export interface RootState {
  rid: number;
  mainData?: MainData;
  preferences: any;
  pasteUrl: string | null;
}

export interface ConfigState {
  userConfig: any;
}
