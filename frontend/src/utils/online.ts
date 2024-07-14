export const isUserOnline = (users: any, id: number) => {
  return users.some((u: any) => u.user.id === id);
};
