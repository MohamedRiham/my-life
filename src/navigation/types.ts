export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type TaskStackParamList = {
  Tasks: undefined;
  AddTask: { taskId?: number } | undefined;
  TaskDetails: { taskId: number };
};

export type AppDrawerParamList = {
  Dashboard: undefined;
};

export type RootStackParamList = AuthStackParamList;
