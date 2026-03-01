import { APIRequestContext } from "playwright-core";
import axios from 'axios';

export default class APIClient {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  async get(endpoint: string, token?: string) {
    return this.invokeAPI("get", endpoint, undefined, token);
  }

  async post(endpoint: string, requestBody?: object, token?: string) {
    return this.invokeAPI("post", endpoint, requestBody, token);
  }

  async put(endpoint: string, requestBody?: object, token?: string) {
    return this.invokeAPI("put", endpoint, requestBody, token);
  }

  async patch(endpoint: string, requestBody?: object, token?: string) {
    return this.invokeAPI("patch", endpoint, requestBody, token);
  }

  async delete(endpoint: string, token?: string) {
    return this.invokeAPI("delete", endpoint, undefined, token);
  }

  private async invokeAPI(
    method: string,
    endpoint: string,
    requestBody?: object,
    token?: string
  ) {
    const headers: Record<string, string> = token
      ? { Cookie: `token=${token}` }
      : {};

    const requestOptions = {
      headers,
      data: requestBody,
    };

    const requestUrl = endpoint ? this.baseUrl.concat(endpoint) : this.baseUrl;

    let response;
    switch (method) {
      case "get":
        response = await this.request.get(requestUrl, requestOptions);
        break;
      case "post":
        response = await this.request.post(requestUrl, requestOptions);
        break;
      case "put":
        response = await this.request.put(requestUrl, requestOptions);
        break;
      case "patch":
        response = await this.request.patch(requestUrl, requestOptions);
        break;
      case "delete":
        response = await this.request.delete(requestUrl, requestOptions);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    console.log(`Response: [${method.toUpperCase()}] ${response.url()}`);

    const contentType = response.headers()["content-type"];

    if (contentType && contentType.includes("application/json")) {
      console.log(JSON.stringify(await response.json(), null, 2));
    } else {
      console.log(await response.text());
    }

    return response;
  }
}

export async function getBookingList() {
  const response = await axios.get('https://your-api-url.com/bookings');
  return response.data;
}
