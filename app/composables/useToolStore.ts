// A store to hold the header data to prevent unnecessary fetches

export const useToolStore = () =>
  useState('toolStore', () => ({
    headerData: null as ToolHeader | null,
    currentTool: undefined as string | string[] | undefined,
  }));
