export const fetcher = async (url: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });

  if (!res.ok) {
    const errorInfo = await res.json().catch(() => ({}));
    const error: any = new Error(errorInfo.message || 'An error occurred while fetching the data.');
    error.info = errorInfo;
    error.status = res.status;
    throw error;
  }

  const data = await res.json();
  return data.data !== undefined ? data.data : data; 
};
