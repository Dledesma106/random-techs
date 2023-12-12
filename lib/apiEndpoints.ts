import Constants from 'expo-constants'

export const baseUrl = Constants.expoConfig?.extra?.API_BASE_URL ?? 'https://ransys-test.vercel.app/'
export const baseApiUrl = baseUrl + 'api/'
export const authUrl = baseApiUrl + 'auth/'
export const logoutUrl = authUrl + 'logout/'
export const registerUrl = authUrl + 'register/'
export const loggedInUser = authUrl + 'user/'
export const images = baseUrl + 'images/'
const techBase = baseApiUrl + 'tech/'
export const tech: any = {
	tasks: techBase + 'tasks',
	expenses: techBase + 'expenses',
	activities: techBase + 'activities'
}
