import Sidebar from '../../components/sidebar/Sidebar';
import axios from 'axios';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { loginStart,loginFailure,loginSuccess } from '../../redux/userSlice';
import {useDispatch} from 'react-redux';
import {Helmet} from 'react-helmet';
import { useFormik } from 'formik';
import { loginSchema } from '../../schemas/login';
import { useState } from 'react';


export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [err,setErr] = useState(false)

    const loginFormik = useFormik({
        initialValues: {
            nickname: '',
            password: ''
        },
        validationSchema: loginSchema,
        onSubmit: values => {
            handleClick();
        },
    });

    const handleClick = async (e) => {
        dispatch(loginStart());
        e.preventDefault();
          try{
               const res = await axios.post("/auth/login",loginFormik.values);
                dispatch(loginSuccess(res.data));
                navigate("/");
          }catch(err){
            dispatch(loginFailure());
            console.log(err)
            setErr(true)
          }
      };
      
  return (
    <div className="login">
        <Helmet>
            <title>login</title>
        </Helmet>
        <Sidebar />
        <div className="loginWrapper">
            <h2 className="loginTitle">sign in</h2>
            <form className="loginForm" onSubmit={handleClick
            }>
                <label>
                    nickname
                    <input 
                    type="text" 
                    className='loginInput'
                    id='nickname'
                    onChange={loginFormik.handleChange}
                    value={loginFormik.values.nickname}
                    />
                </label>
                <div className="loginError">{loginFormik.errors.nickname}</div>
                <label>
                    password
                    <input 
                    type="password" 
                    className='loginInput' 
                    id='password'
                    onChange={loginFormik.handleChange}
                    value={loginFormik.values.password}
                    />
                </label>
                <div className="loginError">{loginFormik.errors.password}</div>
                <button className='formSubmit' type='submit'>Login</button>
                {err && <div className='submitErr'>Please enter valid credentials</div>}
            </form>
        </div>
    </div>
  )
}
