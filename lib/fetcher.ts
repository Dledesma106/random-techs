import Token from './token'

export default async function fetcher(url:string, data:any, method:string){
    const contentType = 'application/json'
    const auth = await Token.get('access_token') 

    console.log(url, method);
    
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

    const res: Response = await fetch(url, requestInit)

      // Throw error with status code in case Fetch API req failed

    if (!res.ok) {
        console.log(res)
        throw new Error('failed fetch')
    }
    const json/* :Promise<LoginResponseJson>  */= await res.json()
    
    return await json.data
}