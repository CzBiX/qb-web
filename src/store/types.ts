import { MainData, SearchPlugin } from '@/types';
import { Config } from './config';

export interface RootState {
  rid: number;
  mainData?: MainData;
  preferences: any;
  pasteUrl: string | null;
  needAuth: boolean;
  query: string | null;
}

export interface SearchEnginePage {
  searchPlugins: SearchPlugin[] | null | undefined;
  isPluginManagerOpen: boolean;
}

export interface AddFormState {
  isOpen: boolean;
  downloadItem: {
    title: string;
    url: string;
  } | null;
}

export interface TorrentFilter {
  state: string;
  category: string;
  tag: string;
  site: string;
  query: string;
}

export interface ConfigState {
  userConfig: any;
}

export interface ConfigPayload {
  key: keyof Config;
  value: any;
}

export enum DialogType {
  Alert,
  YesNo,
  OkCancel,
  Input,
  Custom,
}

export interface DialogConfig {
  dialog?: any;

  title?: string;
  text: string;
  callback?: CallableFunction;
  type?: DialogType;
  buttons?: any;

  rules?: CallableFunction[];
  placeholder?: string;
  value?: string;
}

export interface DialogState {
  config: DialogConfig | null;
}

export interface SnackBarConfig {
  text: string;
  btnText?: string;
  callback?: CallableFunction;
}

export interface SnackBarState {
  config: SnackBarConfig | null;
}
