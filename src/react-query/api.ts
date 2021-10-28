export const api = {
  async get<T>(url: string) {
    const response = await fetch(url);
    const data: T = await response.json();

    // network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (response.status >= 400) {
      throw new Error('network error');
    }

    return data;
  },
};
