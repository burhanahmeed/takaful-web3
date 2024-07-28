export const formatAddress = (address: string) => {
  return `${address.slice(0, 11)} . . . ${address.slice(-4)}`;
};