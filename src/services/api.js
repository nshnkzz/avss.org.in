const BASE_URL = import.meta.env.VITE_API_URL;

const api = {
  get: async (endpoint) => {
    const apiEP= `${BASE_URL}${endpoint}`;
    console.log(apiEP)
    const res = await fetch(apiEP);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },

  post: async (endpoint, body) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
};

export default api;