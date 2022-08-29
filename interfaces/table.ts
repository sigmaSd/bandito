export interface AppConfigProps {
  name?: string;
  downloadLimit?: number;
  uploadLimit?: number;
  dlLimitActive?: boolean;
  upLimitActive?: boolean;
}

export interface AppProps {
  name: string;
  uploadLimit?: number;
  downloadLimit?: number;
  downloadRate?: number;
  uploadRate?: number;
}
