declare var api: {
  [key: string]: (
    params?: string
  ) => Promise<{ count: number; data: Array<any> }>;
};
declare var windowChange: () => void;
