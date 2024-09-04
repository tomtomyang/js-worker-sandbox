class Headers {
  constructor(headers = {}) {
    this.headers = new Map(Object.entries(headers));
  }

  append(name, value) {
    this.headers.set(name, value);
  }

  get(name) {
    return this.headers.get(name);
  }

  has(name) {
    return this.headers.has(name);
  }
}

export class Request {
  constructor(url, { method = 'GET', headers = {}, body = null } = {}) {
    this.url = url;
    this.method = method.toUpperCase();
    this.headers = new Headers(headers);
    this.body = body;
  }
}

export class Response {
  constructor(body, { status = 200, statusText = 'OK', headers = {} } = {}) {
    this.body = body;
    this.status = status;
    this.statusText = statusText;
    this.headers = new Headers(headers);
  }

  text() {
    return Promise.resolve(this.body);
  }

  json() {
    try {
      return Promise.resolve(JSON.parse(this.body));
    } catch (error) {
      return Promise.reject(new Error("Failed to parse JSON"));
    }
  }

  blob() {
    return Promise.resolve(new Blob([this.body]));
  }
}

export function fetch(url, { method = 'GET', headers = {}, body = null } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url.startsWith("http")) {
        resolve(new Response(body, { status: 200, headers }));
      } else {
        reject(new Error("Network request failed"));
      }
    }, 1000);
  });
}