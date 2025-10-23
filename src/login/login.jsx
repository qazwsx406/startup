import React from 'react';
import { MainFeed } from '../main_feed/main_feed';

export function Login({userSession, authState, setAuthState, setUserSession}) {
    const [userName, setUserName] = React.useState();
    const [password, setPassword] = React.useState();
    const [showError, setShowError] = React.useState();
    
    async function loginUser(userName, password, userSession) {
        if (userSession["name"] === userName && userSession["pwd"] === password) {
            setUserSession((userName, password) => localStorage.setItem({
                "name": {userName},
                "pwd": {password},
                "auth": true
            }))
        } else if (userSession["name"] !== userName) {
            setShowError(<>Username: {userName} does not exist, Sign up if you are a new user!</>)
        } else if (userSession["pwd"] !== password) {
            setShowError(<>Incorrect password :( try again.</>)
        } else {
            setShowError(<>Unknown Error...</>)
        }
    }

    return (
    <main>
        <div className="flex flex-col bg-white rounded-lg p-15 max-w-md border-solid border-3 drop-shadow-[10px_10px_0px_rgba(0,0,0,0.3)]">
            <p className="text-3xl font-bold text-center">Let the Debates Begin</p>
            <p className="text-center my-3 mt-8">Welcome to HotTakes! Login/Signup below to post your most controversial takes.</p>
            <form method="get" action="main_feed">
                <div className="flex flex-col gap-5 my-10">
                    <div>
                        <input className="bg-white w-full rounded-md px-4 py-2 border-solid border-2" type="text" placeholder="email here" onChange={(e) => setUserName(e.target.value)} />
                    </div>
                    <div>
                        <input className="bg-white w-full rounded-md px-4 py-2 border-solid border-2" type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                <div className="flex justify-between gap-3">
                    <button className="bg-[#ff4d4d] border-2 border-black text-white w-full rounded-lg p-2 font-medium" type="submit" onClick>Signup</button>
                    <button className="bg-[#4dffbc] border-2  text-black w-full rounded-lg p-2 font-medium" type="submit">Login</button>
                </div>
            </form>                
        </div>
    </main>
  );
}