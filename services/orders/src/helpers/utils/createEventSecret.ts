export const createEventSecret = (uid: string) => {
  const eventSecret = `${uid}${process.env.SOCKET_EVENT_SECRET}`;

  return eventSecret;
};
