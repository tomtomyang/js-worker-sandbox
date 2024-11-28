const fetch = async (input: RequestInfo, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input.url;
  const method = init?.method || 'GET';

  const mockResponse = {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    json: async () => {
      return {
        success: true,
        data: {
          url,
          method,
          timestamp: Date.now(),
          message: 'This is a mocked response',
        },
      };
    },
    text: async () =>
      JSON.stringify({
        success: true,
        data: {
          url,
          method,
          timestamp: Date.now(),
          message: 'This is a mocked response',
        },
      }),
    blob: async () => new Blob(['mock data']),
    arrayBuffer: async () => new ArrayBuffer(0),
    clone: function () {
      return Object.assign({}, this);
    },
  };

  await new Promise((resolve) => setTimeout(resolve, 100));

  return mockResponse as Response;
};

export { fetch };
