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

export enum DialogType {
  Alert,
  YesNo,
  OkCancel,
  Input,
  Custom,
}

export interface DialogConfig {
  content: {
    title?: String,
    text: String,
    callback?: CallableFunction,
    type?: DialogType,
    buttons?: any,

    rules?: CallableFunction[],
    placeholder?: string,
  },
  width?: string,
}

export interface DialogState {
  config: DialogConfig | null,
}

export interface SnackBarConfig {
  text: string,
  btnText?: string,
  callback?: CallableFunction,
}

export interface SnackBarState {
  config: SnackBarConfig | null,
}
