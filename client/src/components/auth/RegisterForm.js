import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import {Link} from 'react-router-dom'
import {useState, useContext} from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import AlertMessage from '../layout/AlertMessage'

const RegisterForm = () => {
    const {registerUser} = useContext(AuthContext)

    //const history = useHistory()

    const [registerForm, setRegisterForm] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    })

    const [alert, setAlert] = useState(null)

    const {username, password, confirmPassword} = registerForm

    const onChangeRegisterForm = event => setRegisterForm({...registerForm, [event.target.name]: event.target.value})
    const register = async event => {
        event.preventDefault()

        if(password !== confirmPassword) {
            setAlert({type: 'danger', message: 'Passwords do not match'})
            setTimeout(() => setAlert(null), 5000)
            return
        }

        try{
            const registerData = await registerUser(registerForm)
            if(!registerData.success) {
                //history.push('/dashboard')
                setAlert({type: 'danger', message: registerData.message})
                setTimeout(() => setAlert(null), 5000)
            }
        }catch(error) {
            console.log(error)
        }
    }    
    return (
    <>
    <Form className='my-4' onSubmit={register}>
        <AlertMessage info={alert} />
        <Form.Group>
            <Form.Control type='text' placeholder='Username' name='username' required value={username} onChange={onChangeRegisterForm}/>
        </Form.Group>
        <Form.Group>
            <Form.Control type='password' placeholder='Password' name='password' required value={password} onChange={onChangeRegisterForm}/>
        </Form.Group>
        <Form.Group>
            <Form.Control type='password' placeholder='ConfirmPassword' name='confirmPassword' required value={confirmPassword} onChange={onChangeRegisterForm}/>
        </Form.Group>
        <Button variant='success' type='submit'>Register</Button>
    </Form>
    <p>Already have an acount?
        <Link to='/login'>
            <Button variant='info' size='sm' className='ml-2'>Login</Button>
        </Link>
    </p>
    </>
    )
}

export default RegisterForm