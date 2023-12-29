import * as SecureStore from 'expo-secure-store'

const token = {
	save: async (key: string, value: string) => {
		console.log('guardando token', value)
		await SecureStore.setItemAsync(key, value)
	},

	get: async (key: string) => {
		const result = await SecureStore.getItemAsync(key)
		if (result) {
			return result
		} else {
			return null
		}
	}
}

export default token
