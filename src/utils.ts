export function promiseTimeout(time: number) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve(time);
    }, time);
  });
}

const extraTimeout = 0;
export const slowFetch = async (url, timeout = extraTimeout) => {
  const response = await fetch(url);
  const data = await response.json();
  await promiseTimeout(timeout + Math.random() * 1000);
  return data;
};
