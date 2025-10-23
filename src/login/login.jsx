import React from 'react';
import { MainFeed } from '../main_feed/main_feed';
import { AuthState } from './authState';
import { useNavigate } from 'react-router-dom';

export function Login({userSession, authState, setAuthState, setUserSession}) {
    const [userName, setUserName] = React.useState();
    const [password, setPassword] = React.useState();
    const [showError, setShowError] = React.useState(null);
    const navigate = useNavigate();

    async function loginUser(userName, password) {
        if (userSession["name"] === userName && userSession["pwd"] === password) {
            console.log("success")
            const newUserSession = {
                "name": userName,
                "pwd": password,
                "auth": true
            }
            localStorage.setItem("userSession",JSON.stringify(newUserSession))
            setUserSession(newUserSession)
            setAuthState(AuthState.Authenticated)
            navigate('/main_feed')
        } else if (userSession["name"] !== userName) {
            setShowError(<p className='text-sm font-semibold text-red-500 text-center'>User <span className='text-sm font-normal text-black underline italic'>{userName}</span> does not exist, Sign up if you are new here!</p>)
        } else if (userSession["pwd"] !== password) {
            setShowError(<p className='text-sm font-semibold text-red-500 text-center'>Incorrect password :(</p>)
        } else {
            setShowError(<>Unknown Error...</>)
        }
    }

    async function createUser(userName, password) {
        const currentUserSession = {
            "name": userName,
            "pwd": password,
            "auth": true
        }
        localStorage.setItem("userSession", JSON.stringify(currentUserSession))
        setAuthState(AuthState.Authenticated)
        setUserSession(currentUserSession)
        navigate('/main_feed')
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
                        <input className="bg-white w-full rounded-md px-4 py-2 border-solid border-2" type="text" placeholder="email here" onChange={(e) => setUserName(e.target.value)} />
                    </div>
                    <div>
                        <input className="bg-white w-full rounded-md px-4 py-2 border-solid border-2" type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
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