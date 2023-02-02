
import { useState } from "react"
import {Text, View} from "react-native"
import Button from "../components/Forms/Button"
import { useUser } from "../hooks/useUser"
import Input from '../components/Forms/Input'
import * as apiEndpoints from '../lib/apiEndpoints'
import fetcher from "../lib/fetcher"

interface ILoginForm{
    email:string,
    password:string
}

const SignIn = ({navigation}:any) => {
    const [errors, setErrors] = useState({})
    const [message, setMessage] = useState('')
    const {loginUser} = useUser()
    const [form, setForm] = useState({
      email:'',
      password:''
    })
  
    
    const formValidate = () => {
      let err : ILoginForm = {email:'', password:''}
      if (!form.email) err.email = 'email is required'
      if (!form.password) err.password = 'password is required'
      
      return err
    }
    
    const postData = async (form:ILoginForm) => {
      try {
        const data/* :Promise<LoginResponseJson>  */= await fetcher(apiEndpoints.authUrl, form, 'POST')
        
        await loginUser(data)
        
        
        navigation.navigate('Drawer')
      } 
      catch (error) {
        console.log(error)
        alert('wrong email/password')
      }
    }
  
    const submit = () => {
      const errs = formValidate()
      if (errs.email == '' && errs.email == '') {
        postData(form)
      } else {
        setErrors({ errs })
      }
    }
  
    return (
      <View>
        <Input
          title='Email'
          value={form.email}
          custom={{
            onChangeText:email => setForm(prev => ({...prev, email}))
          }}
        />
        <Input
          title='Password'
          value={form.password}
          custom={{
            onChangeText:password => setForm(prev=>({...prev, password}))
          }}
        />
        <Button title='Login' action={submit}/>
        
        <Text>{message}</Text>
        <View>
          {Object.keys(errors).map((err, index) => (
            <Text key={index}>{err}</Text>
          ))}
        </View>
  
      </View>
    )
  }
  
  export default SignIn