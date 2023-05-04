import { useRef, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./register.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { registerSchema } from "../../schemas/register";
import { useFormik } from "formik";

export default function Register() {
  const [checked, setChecked] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [err, setErr] = useState(false);

  const registerFormik = useFormik({
    initialValues: {
      registerNickname: "",
      registerEmail: "",
      registerPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      handleClick();
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", {
        nickname: registerFormik.values.registerNickname,
        email: registerFormik.values.registerEmail,
        password: registerFormik.values.registerPassword,
      });
      setRegistered(true);
    } catch (err) {
      console.log(err);
      setErr(true);
    }
  };

  console.log(err);

  return (
    <div className="register">
      <Helmet>
        <title>register</title>
      </Helmet>
      <Sidebar />
      <div className="registerWrapper">
        {registered ? (
          <>
            <h2 className="registerTitle">
              register complete. now you can sign in.
            </h2>
            <Link className="link" to="/login">
              <button
                className="redirectSignIn"
                style={{
                  padding: "10px 15px",
                  background: "rgb(0, 195, 255)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                Sign in
              </button>
            </Link>
          </>
        ) : (
          <>
            <h2 className="registerTitle">new user registration</h2>
            <form className="registerForm" onSubmit={handleClick}>
              <label>
                nickname
                <input
                  type="text"
                  className="registerInput"
                  id="registerNickname"
                  onChange={registerFormik.handleChange}
                  value={registerFormik.values.registerNickname}
                />
              </label>
              <div className="registerError">
                {registerFormik.errors.registerNickname}
              </div>
              <label>
                email
                <input
                  type="email"
                  className="registerInput"
                  style={{ marginLeft: "26px" }}
                  id="registerEmail"
                  onChange={registerFormik.handleChange}
                  value={registerFormik.values.registerEmail}
                />
              </label>
              <div className="registerError">
                {registerFormik.errors.registerEmail}
              </div>
              <label>
                password
                <input
                  type="password"
                  className="registerInput"
                  id="registerPassword"
                  onChange={registerFormik.handleChange}
                  value={registerFormik.values.registerPassword}
                />
              </label>
              <div className="registerError">
                {registerFormik.errors.registerPassword}
              </div>
              <label>
                <input type="checkbox" onClick={() => setChecked(!checked)} />
                <span>I read paw dictionary terms and I accepted</span>
              </label>
              {checked ? (
                <button className="formSubmit" type="submit">
                  Register
                </button>
              ) : (
                <button className="formSubmit" disabled>
                  Register
                </button>
              )}
              {err && (
                <div className="submitErr">Please enter valid credentials</div>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
