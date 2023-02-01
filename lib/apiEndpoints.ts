export const baseUrl = process.env.BASE_URL || 'http://192.168.0.42:3000/'
export const baseApiUrl = baseUrl + 'api/'
export const authUrl = baseApiUrl + 'auth/'
export const logoutUrl = authUrl + 'logout/'
export const registerUrl = authUrl + 'register/'
export const loggedInUser = authUrl + 'user/'
const techBase = baseApiUrl + 'tech/'

export const tech:any ={
    tasks: techBase + 'tasks/',
    expenses: techBase + 'expenses/'
}