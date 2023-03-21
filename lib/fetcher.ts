import Token from './token'

import {isReachable } from './utils';


export default async function fetcher(url:string, data:any, method:string){
    const contentType = 'application/json'
    const auth = await Token.get('access_token') 
    /* configureNetInfo()
    const state = await NetInfo.fetch() */
    
    
    const requestInit:RequestInit = method == 'GET'? {
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
    //console.log(state);
    //console.log(state.isInternetReachable)
    //if(!state.isInternetReachable) throw new Error("No internet connection");
    //console.log(await isReachable(url))
    console.log('checking reachability');
    
    if(!(await isReachable(url))) throw new Error('Server offline')
    console.log(`it's reachable`)
    const res: Response = await fetch(url, requestInit)
    console.log(url, method);
      // Throw error with status code in case Fetch API req failed

    if (!res.ok) {
        console.log('FAILED FETCH:', res)
        throw new Error('failed fetch')
    }
    const json/* :Promise<LoginResponseJson>  */= await res.json()
    console.log(json)
    return await json.data
}