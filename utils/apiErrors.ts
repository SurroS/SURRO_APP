export function explainAxiosError(err: any) {
  if (err.response) {
    return {
      status: err.response.status,
      message: err.response.data?.message ?? err.response.data,
      url: err.config?.url,
      method: err.config?.method,
    };
  }

  return { message: err.message };
}
