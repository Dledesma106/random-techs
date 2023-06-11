export const baseUrl =
  process.env.BASE_URL || "https://ransys-test.vercel.app/";
export const baseApiUrl = baseUrl + "api/";
export const authUrl = baseApiUrl + "auth/";
export const logoutUrl = authUrl + "logout/";
export const registerUrl = authUrl + "register/";
export const loggedInUser = authUrl + "user/";
const techBase = baseApiUrl + "tech/";

export const tech: any = {
  tasks: techBase + "tasks",
  expenses: techBase + "expenses",
  activities: techBase + "activities",
};
