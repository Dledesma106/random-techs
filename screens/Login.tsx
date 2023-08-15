import { useState } from 'react'
import { Text, View } from 'react-native'
import Button from '../components/Forms/Button'
import { useUser } from '../hooks/useUser'
import Input from '../components/Forms/Input'
import * as apiEndpoints from '../lib/apiEndpoints'
import fetcher from '../lib/fetcher'
import { useDB } from '../hooks/useDB'

interface ILoginForm {
	email: string
	password: string
}

const SignIn = ({ navigation }: any) => {
	const [errors, setErrors] = useState({})
	const [message, setMessage] = useState('')
	const { loginUser, loginOffline } = useUser()
	const [form, setForm] = useState({
		email: '',
		password: ''
	})
	const [disabled, setDisabled] = useState<boolean>(false)
	const { saveLocalUser } = useDB()

	const formValidate = () => {
		const err: ILoginForm = { email: '', password: '' }
		if (!form.email) err.email = 'email is required'
		if (!form.password) err.password = 'password is required'
		setMessage(Object.values(err).join(', '))
		return err
	}

	const postData = async (form: ILoginForm) => {
		try {
			const data /* :Promise<LoginResponseJson>  */ = await fetcher.post(apiEndpoints.authUrl, form)

			await loginUser(data)
			console.log('usuario logeado')
			saveLocalUser(data.user, form.password)
			console.log('logged in with server')
			navigation.navigate('Drawer')
		} catch (error) {
			console.log(error)
			try {
				console.log('trying offline login')
				await loginOffline(form.email, form.password)
				console.log('logged in offline')
				navigation.navigate('Drawer')
			} catch (error) {
				alert('Email o contraseña incorrectos')
			}
		}
	}

	const submit = async () => {
		const errs = formValidate()

		if (errs.email === '' && errs.email === '') {
			setDisabled(true)
			await postData(form)
			setDisabled(false)
		} else {
			setErrors({ errs })
		}
	}

	return (
		<View className="bg-gray-300 h-screen items-center">
			<View className="bg-gray-100 w-11/12 m-1 flex flex-col rounded-md mt-10">
				<Input
					title="Email"
					value={form.email}
					custom={{
						onChangeText: (email) => setForm((prev) => ({ ...prev, email }))
					}}
				/>
				<Input
					title="Contraseña"
					value={form.password}
					custom={{
						onChangeText: (password) => setForm((prev) => ({ ...prev, password }))
					}}
				/>
				<Button title="Login" action={submit} disabled={disabled} />

				<Text>{message}</Text>
				<View>
					{Object.keys(errors).map((err, index) => (
						<Text key={index}>{err}</Text>
					))}
				</View>
			</View>
		</View>
	)
}

export default SignIn
