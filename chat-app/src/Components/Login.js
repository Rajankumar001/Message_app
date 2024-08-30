import React, { useState } from 'react';
import client from '../Components/feathers';

const Login = () => {
    const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState();

  function login() {
    return client
      .authenticate({
        strategy: 'local',
        email,
        password,
      })
      .catch();
  }

  function signup() {
    return client
      .service('users')
      .create({ email, password,userName})
      .then(() => login());
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
          <form className=" h-1/3 w-1/3 border rounded-lg  flex flex-col gap-4 ">
          <fieldset>
              <input
                className=" border px-3 py-2 w-full  rounded-lg"
                type="text"
                name="text"
                value={userName}
                placeholder="Enter your name"
                onChange={e=>setPassword(e.target.value)}
              />
            </fieldset>
            <fieldset>
              <input
                className=" border px-3 py-2 w-full rounded-lg"
                type="email"
                name="email"
                value={email}
                placeholder="email"
                onChange={e=>setEmail(e.target.value)}
              />
            </fieldset>

            <fieldset>
              <input
                className=" border px-3 py-2 w-full  rounded-lg"
                type="password"
                name="password"
                value={password}
                placeholder="password"
                onChange={e=>setPassword(e.target.value)}
              />
            </fieldset>

            <button
              type="button"
              className="rounded px-3 py-3 border bg-sky-500"
              onClick={() => login()}
            >
              Log in
            </button>

            <button
              type="button"
              className="rounded px-3 py-3 border bg-green-500"
              onClick={() => signup()}
            >
              Signup
            </button>
          </form>
    </div>
  );
};

export default Login;