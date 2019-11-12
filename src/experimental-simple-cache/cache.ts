// This follows the old API for react-cache. It is a HIGHLY EXPERIMENTAL API.
// Do not rely on this staying stable - and please, PLEASE do not copy and
// paste this into your own code-base. THIS IS NOT PRODUCTION SAFE CODE.
//
// This code will usually be supplied by your chosen data-fetching library.

const resourceCache = new Map();

export function createResource(fetchKey: string, fetch: any): any {
  const accessData = (key, input) => {
    if (!resourceCache.has(key)) {
      const resource = {
        promise: fetch(input),
        status: "pending",
        value: null
      };
      resource.promise.then(
        value => {
          resource.status = "resolved";
          resource.value = value;
        },
        error => {
          resource.status = "error";
          resource.value = error;
        }
      );
      resourceCache.set(key, resource);
    }
  };

  const resource = {
    read(input: any): any {
      const key = `${fetchKey}:${input}`;

      accessData(key, input);
      const result = resourceCache.get(key);

      switch (result.status) {
        case "pending": {
          const suspender = result.promise;
          throw suspender;
        }
        case "resolved": {
          const value = result.value;
          return value;
        }
        case "rejected": {
          const error = result.value;
          throw error;
        }
        default:
          // Should be unreachable
          return undefined as any;
      }
    },
    preload(input: any): void {
      const key = `${fetchKey}:${input}`;
      accessData(key, input);
    }
  };
  return resource;
}
