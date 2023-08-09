import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { loadUsers, signup, logout, login } from '../store/user.actions.js'
import { userService } from '../services/user.service.js'
import { showSuccessMsg, showErrorMsg, } from '../services/event-bus.service.js'
import { useNavigate } from 'react-router-dom'


export function Login() {
    // console.log('Hello')

    // const user = useSelector(() => userService.getRandomUser())
    const user = useSelector((storeState) => storeState.userModule.user)
    const [credentials, setCredentials] = useState(
        userService.getEmptyCredentials()
    )

    const navigate = useNavigate();

    // console.log(user)

    // useEffect(() => {
    //     loadUsers()
    // }, [])

    function handleChange({ target }) {
        let { value, name: field } = target
        setCredentials((prevCreds) => ({ ...prevCreds, [field]: value }))
    }

    function onSubmit(ev) {
        ev.preventDefault()
        // console.log(user)
        // console.log(user.username)
        // const username = user.username
        login(credentials)
        navigate('/stay')
    }

    const { fullname, username, password } = credentials

    return (


        <div className="login-main">
            <header>
                <div>Log in</div>
            </header>
            <div className="form-container">

                <form onSubmit={onSubmit}>
                    <div>
                        <label className='login-main-label'>UserName</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            // placeholder='Username'
                            value={username}
                            onChange={handleChange} />
                    </div>
                    <div>
                        <label className='login-main-label'>Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            // placeholder="Password"
                            value={password}
                            onChange={handleChange} />

                    </div>

                    <button>Log in</button>

                </form>

            </div>
        </div>



    )





}