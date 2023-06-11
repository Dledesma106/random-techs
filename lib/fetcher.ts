import Token from './token'

import {isReachable } from './utils';

const contentType = 'application/json'

async function getRequestInnit(method:string, data:any){
  const auth = await Token.get('access_token') 
  const requestInit:RequestInit =  method == 'GET'? {
    method,
    mode:'no-cors',
    headers: {
      Accept: contentType,
      'Content-Type': contentType,
      'Authorization': auth? auth:''
    }
  } :
  {
    method,
    mode:'no-cors',
      headers: {
        Accept: contentType,
        'Content-Type': contentType,
        'Authorization': auth? auth:''
      },
      body: JSON.stringify({...data, appRequest:true}),
  }
  return requestInit
}

async function fetchOut(url:string, data:any, method:string){
  console.log('checking reachability');
  
  if(!(await isReachable(url))) throw new Error('Server offline')
  console.log(`it's reachable`)
  const requestInit = await getRequestInnit(method, data)
  const res: Response = await fetch(url, requestInit)
  console.log(url, method);

  if (!res.ok) {
    console.log('FAILED FETCH:', res)
    throw new Error('failed fetch')
  }
  const json/* :Promise<LoginResponseJson>  */= await res.json()
  console.log(json)
  return await json.data
}

const fetcher = {
  get: async function(url:string){
    return await fetchOut(url, {}, 'GET')
  },
  post: async function(url:string, data:any){
    return await fetchOut(url, data, 'POST')
  },
  put: async function(url:string, data:any){
    return await fetchOut(url, data, 'PUT')
  },
  delete: async function(url:string, data:any){
    return await fetchOut(url, data, 'DELETE')
  },
}

  export default fetcher