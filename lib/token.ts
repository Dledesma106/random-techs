import * as SecureStore from 'expo-secure-store'

const token = {
 save: async(key: string, value:any) => {
    await SecureStore.setItemAsync(key, value);
  },
  
 get: async(key:string) => {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      return result
    } else {
      return null
    }
  }
}

export default token