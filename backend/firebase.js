// const FIREBASE_URL = "https://change-risk-analyzer-default-rtdb.firebaseio.com/";

// export async function fetchData(path) {
//   const res = await fetch(`${FIREBASE_URL}/${path}.json`);
//   return res.json();
// }

export async function fetchData(path) {
  const url = `$https://change-risk-analyzer-default-rtdb.firebaseio.com/${path}.json`;
  const res = await fetch(url);

  const text = await res.text();
  console.log("Firebase raw response:", text);

  if (!res.ok) {
    throw new Error(`Firebase fetch failed: ${res.status}`);
  }

  return JSON.parse(text);
}
