import React from 'react';
import { AuthState } from './authState';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../api';

export function Login({ setAuthState, setUserInfo }) {
    const [userName, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showError, setShowError] = React.useState(null);
    const navigate = useNavigate();

    async function loginUser(userName, password) {
        if (!userName || !password) {
            setShowError(<p className='text-sm font-semibold text-red-500 text-center'>Email and password fields cannot be empty</p>);
            return;
        }

        try {
            const user = await login(userName, password);
            setUserInfo({ email: user.email });
            setAuthState(AuthState.Authenticated);
            navigate('/main_feed');
        } catch (error) {
            setShowError(<p className='text-sm font-semibold text-red-500 text-center'>{error.message}</p>);
        }
    }

    async function createUser(userName, password) {
        if (!userName || !password) {
            setShowError(<p className='text-sm font-semibold text-red-500 text-center'>Email and password fields cannot be empty</p>);
            return;
        }

        try {
            const user = await signup(userName, password);
            setUserInfo({ email: user.email });
            setAuthState(AuthState.Authenticated);
            navigate('/main_feed');
        } catch (error) {
            setShowError(<p className='text-sm font-semibold text-red-500 text-center'>{error.message}</p>);
        }
    }

    return (
    <main>
        <div className="flex flex-col bg-white rounded-lg p-15 max-w-md border-solid border-3 drop-shadow-[10px_10px_0px_rgba(0,0,0,0.3)]">
            <p className="text-3xl font-bold text-center">Let the Debates Begin</p>
            <p className="text-center my-3 mt-8">Welcome to HotTakes! Login/Signup below to post your most controversial takes.</p>
            <form>
                <div className="flex flex-col gap-5 my-10">
                    {showError && (<>{showError}</>)}
                    <div>
                        <input className="bg-white w-full rounded-md px-4 py-2 border-solid border-2" type="text" placeholder="email here" onChange={(e) => setUserName(e.target.value)} value={userName} />
                    </div>
                    <div>
                        <input className="bg-white w-full rounded-md px-4 py-2 border-solid border-2" type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                    </div>
                </div>
                <div className="flex justify-between gap-3">
                    <button className="bg-[#ff4d4d] border-2 border-black text-white w-full rounded-lg p-2 font-medium" type="button" onClick={() => createUser(userName, password)}>Signup</button>
                    <button className="bg-[#4dffbc] border-2  text-black w-full rounded-lg p-2 font-medium" type="button" onClick={() => loginUser(userName, password)}>Login</button>
                </div>
            </form>
        </div>
    </main>
  );
}
