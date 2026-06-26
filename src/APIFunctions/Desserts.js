import { ApiResponse } from './ApiResponses';

// if you are running the website with `sce run c`
// change the below string to:
// http://localhost:8080/api
const DESSERT_API_URL = 'http://localhost:8080/api/Dessert/';

export async function getDesserts() {
  let status = new ApiResponse();
  try {
    const res = await fetch(DESSERT_API_URL + 'getDesserts')
    if (res.ok) {
      status.responseData = await res.json();
    } else {
      status.error = true;
    }
  } catch (err) {
    status.responseData = err;
    status.error = true;
  }
  return status;
}

export async function createDessert(newDessert, token) {
  let status = new ApiResponse();

  try {
    const response = await fetch(DESSERT_API_URL + 'createDessert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newDessert),
    });

    if (!response.ok) {
      status.error = true;
      status.responseData = await response.text();
      return status;
    }

    status.responseData = await response.json();
  } catch (err) {
    status.error = true;
    status.responseData = err;
  }

  return status;
}

export async function deleteDessert(dessert, token) {
  let status = new ApiResponse();
    console.log(dessert);
  try {
    const response = await fetch(DESSERT_API_URL + 'deleteDessert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dessert),
    });

    if (!response.ok) {
      status.error = true;
      status.responseData = await response.text();
      return status;
    }

    status.responseData = await response.json();
  } catch (err) {
    status.error = true;
    status.responseData = err;
  }

  return status;
}