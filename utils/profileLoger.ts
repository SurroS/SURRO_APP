export const logProfileFlow = (
  label: string,
  payload: any
) => {
  console.log(`🟣 [PROFILE:${label}]`, JSON.stringify(payload, null, 2));
};
