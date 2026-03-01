import { test as base } from "@playwright/test";
import APIClient from "../utils/api-client";
import config from "../../../playwright.config";

type MyFixtures = {
  commonApiFixture: APIClient;
  authApiFixture: APIClient;
};

const fixtures = base.extend<MyFixtures>({
  authApiFixture: async ({ request }, use) => {
    const API = new APIClient(request, process.env.API_BASE_URL || config.baseApiUrl);
    await use(API);
  },
  commonApiFixture: async ({ request }, use) => {
    const API = new APIClient(request, process.env.API_BASE_URL || config.baseApiUrl);
    await use(API);
  },
});

export { fixtures };
