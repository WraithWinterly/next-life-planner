interface APIResolver {
  post: (apiPoint: string, postData: any) => Promise<any>;
  get: (apiPoint: string) => Promise<any>;
}

const apiResolver: APIResolver = {
  post: async (apiPoint: string, postData: any) => {
    try {
      const response = await fetch(apiPoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      return { data };
    } catch (error) {
      console.log(error);
    }
  },
  get: async (apiPoint: string) => {
    const response = await fetch(apiPoint);
    const data = await response.json();

    return { data };
  },
};

export default apiResolver;
