import React from 'react';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { MainFeed } from './main_feed/main_feed';
import { MyTakes } from './my_takes/my_takes';
import { AuthState } from './login/authState';
import { ProtectedRoute } from './login/protected_route';
import { UserSession } from './login/userSession';

export default function App() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [userInfo, setUserInfo] = React.useState(user || {"name": null, "pwd": null, "posts": []})
    const [userPost, setUserPost] = React.useState(user ? user.posts : []);
    const userSessionOnPageLoad = JSON.parse(localStorage.getItem('userSession')) || {"user": null, "auth": false}
    const userSessionStatusOnLoad = userSessionOnPageLoad["auth"] ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(userSessionStatusOnLoad);
    const [dataList, setDataList] = React.useState([]);

    React.useEffect(() => {
        if (authState === AuthState.Authenticated) {
            const refreshUser = JSON.parse(localStorage.getItem('user'));
            setUserInfo(refreshUser || {"name": null, "pwd": null})
            setUserPost(refreshUser ? refreshUser.posts : [])
        }
    }, [authState])

    async function logOut() {
        const logout = new UserSession(null, false)
        localStorage.setItem("userSession", JSON.stringify(logout))
        setAuthState(AuthState.Unauthenticated)
    }
    
    return (
        <BrowserRouter>
            <div className='main_container'>
                <header className="flex justify-between items-center px-5 h-16 border-y-2 bg-[#ff4d4d]">
                    <div className="flex items-center gap-10">
                        <NavLink className="font-bold text-2xl text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,5)]" to="">HotTakes</NavLink>
                        <nav>
                            {authState === AuthState.Authenticated && (
                                <menu className="flex gap-2">
                                    <li><NavLink className="text-white underline font-medium" to="main_feed">Home</NavLink></li>
                                    <li><NavLink className="text-white font-medium" to="my_takes">My Takes</NavLink></li>
                                </menu>
                            )}
                        </nav>
                    </div>
                    
                    <div>
                        {authState === AuthState.Authenticated && (
                            <NavLink className="bg-[#D9D9D9] border-2 text-black w-full rounded-lg px-4 py-0.5 font-medium" onClick={() => logOut()}>Logout</NavLink>
                        )}
                    </div>
                </header>

                <Routes>
                    <Route path='/' element={<Login 
                        userInfo={userInfo}
                        setAuthState={setAuthState}
                        setUserInfo={setUserInfo}
                        />} exact />

                    <Route path='/main_feed' element={<ProtectedRoute
                        authState={authState}
                        children={<MainFeed userInfo={userInfo} userPost={userPost} setUserInfo={setUserInfo} setUserPost={setUserPost} dataList={dataList} setDataList={setDataList}/>}/>} />

                    <Route path='/my_takes' element={<ProtectedRoute
                        authState={authState}
                        children={<MyTakes userPost={userPost} setUserPost={setUserPost} dataList={dataList} setDataList={setDataList} userInfo={userInfo}/>}/>} />

                    <Route path='*' element={<NotFound />} />
                </Routes>

                <footer className="flex justify-between border-y-2 px-5 py-3 bg-[#FF4D4D]">
                    <div className="footer-left">
                        <a className="text-white drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,5)]">Joonhee Shin</a>
                    </div>
                    <div className="footer-right">
                        <a className="text-white font-semibold drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,5)]" href="https://github.com/qazwsx406/startup">GitHub</a>
                    </div>            
                </footer>
            </div>
        </BrowserRouter>
    );
}

function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}

