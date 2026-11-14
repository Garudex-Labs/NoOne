/** Map native RSC requests to their exported payload on a plain static host. */
export function createStaticFetch(fetch, location) {
  return async (input, init) => {
    const existing = input instanceof Request;
    const url = new URL(existing ? input.url : input, location.href || location.origin);
    const method = init?.method || (existing ? input.method : 'GET');
    const headers = new Headers(init?.headers || (existing ? input.headers : undefined));
    const pageRequest = headers.get('RSC') === '1' || url.searchParams.has('_rsc');
    if (method.toUpperCase() !== 'GET' || url.origin !== location.origin ||
      !(url.pathname === '/docs' || url.pathname.startsWith('/docs/')) || !pageRequest) return fetch(input, init);
    const request = new Request(input, init);
    url.pathname = url.pathname.replace(/\/$/, '') + '/index.txt';
    url.searchParams.delete('_rsc');
    const response = await fetch(new Request(url, request));
    if (!response.ok) return response;
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Content-Type', 'text/x-component');
    return new Proxy(response, {
      get(target, key) {
        if (key === 'headers') return responseHeaders;
        if (key === 'url') return request.url;
        const value = Reflect.get(target, key, target);
        return typeof value === 'function' ? value.bind(target) : value;
      },
    });
  };
}

if (typeof window !== 'undefined') window.fetch = createStaticFetch(window.fetch.bind(window), window.location);
