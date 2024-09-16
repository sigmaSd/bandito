export interface AppConfigProps {
  name?: string;
  downloadLimit?: number;
  uploadLimit?: number;
  dlLimitActive?: boolean;
  upLimitActive?: boolean;
}

export interface AppProps {
  name: string;
  global?: boolean;
  downloadRate?: number;
  uploadRate?: number;
}

export type Unit = "bps" | "kbps" | "mbps";
