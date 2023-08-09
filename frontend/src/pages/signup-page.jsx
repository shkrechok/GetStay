import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { loadUsers, signup, logout, login } from '../store/user.actions.js'
import { userService } from '../services/user.service.local.js'
import { showSuccessMsg, showErrorMsg, } from '../services/event-bus.service.js'
import { useNavigate } from 'react-router-dom'



export function Signup() {
    // console.log('Hello')

    const [credentials, setCredentials] = useState(
        userService.getEmptyCredentials()
    )

    const navigate = useNavigate();



    function handleChange({ target }) {
        let { value, name: field } = target
        setCredentials((prevCreds) => ({ ...prevCreds, [field]: value }))
    }

    function onSubmit(ev) {
        console.log('Hello')
        ev.preventDefault()

        signup(credentials)
        navigate('/stay')
    }

    const { fullname, username, password } = credentials

    return (


        <div className="login-main">
            <header>
                <div>Sign Up</div>
            </header>
            <div className="form-container">

                <form onSubmit={onSubmit}>
                    <div>
                        <label htmlFor="">Full Name</label>
                        <input
                            type="text"
                            id="fullname"
                            name="fullname"
                            // placeholder='Fullname'
                            value={fullname}
                            onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="">UserName</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            // placeholder='Username'
                            value={username}
                            onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            // placeholder="Password"
                            value={password}
                            onChange={handleChange} />

                    </div>

                    <button>Sign Up</button>

                </form>

            </div>

        </div>






    )





}
