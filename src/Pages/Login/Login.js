import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import logo from '../../assets/icon2.png';
import { notify } from '../../helpers/notification';
import { connect } from 'react-redux';
import { login } from "../../store/actions";

const { loginRequest, checkAuth } = require('../../api/auth');

function Login(props) {
    const emailRef = React.useRef(null);
    const passwordRef = React.useRef(null);

    const [redirect, setRedirect] = useState(false);

    useEffect(()=> {
        console.log(props)
        if (localStorage.getItem('user')) {
            checkAuth().then(res => {
                if (res.success) {
                    localStorage.setItem('user', JSON.stringify(res.success.user));
                    //dispatch({ type: 'LOGIN', data: res.success.user});
                    props.login(res.success.user);
                    return setRedirect(true)
                }
                    else return;
            })
        }
    }, []);

    const onKeyUp = async (event) => {
        
        if (event.charCode === 13) {
            let email = emailRef.current.value;
            let password = passwordRef.current.value;

            if (!email || !password) return notify('Missing Fields', 'Please fill out all required fields.', 'danger');

            const response = await loginRequest(email, password);
            console.log(response)
            if (!response) return notify('Login Failed', 'Please try again or reset your password.', 'danger');

            localStorage.setItem('user', JSON.stringify(response.success.user));
            //dispatch({ type: 'LOGIN', data: response.success.user});
            props.login(response.success.user);
            setRedirect(true);
            return;
        }
    };

    if (redirect) return <Redirect push to="/home" />;

    return (
        <div id="LoginPage" className="text-primaryText overflow-hidden w-full h-full z-50">
            <div className="m-auto w-2/4 md:w-3/7 max-w-xl h-2xl bg-onPrimaryBg rounded-md px-10 py-8 fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <div className='flex w-full h-full'>
                    <div className="content-center grid grid-cols-1 space-y-5 w-full ml-auto mr-auto">
                        <img className="inline ml-auto mr-auto" src={logo} width="70" />
                        <input 
                            ref={emailRef}
                            type='email'
                            placeholder="Email"
                            spellCheck="false"
                            onKeyPress={onKeyUp} 
                            autoFocus 
                            className="pt-2 rounded-md bg-onPrimaryBg text-onPrimaryBgSofter focus:outline-none outline-none placeholder-onPrimaryBgSofter w-full border-none focus:ring-0" 
                            //onChange={(e)=> setEmail(e.target.value)}
                        />
                        <input 
                            ref={passwordRef}
                            type="password"
                            placeholder="Password"
                            onKeyPress={onKeyUp}
                            className="rounded-md bg-onPrimaryBg text-onPrimaryBgSofter focus:outline-none outline-none placeholder-onPrimaryBgSofter w-full border-none focus:ring-0" 
                            //onChange={(e)=> setPassword(e.target.value)}
                        />
                        <button onClick={()=> onKeyUp({charCode: 13})} className="font-medium p-1 bg-gradient-to-r from-primary to-secondary shadow-md rounded-md text-lg focus:outline-none outline-none hover:opacity-70 transition duration-300">
                        Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = state => {
    return { auth: state.auth }
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        login: (data) => dispatch(login(data))
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Login)