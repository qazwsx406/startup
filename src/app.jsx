import React from 'react';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { MainFeed } from './main_feed/main_feed';
import { MyTakes } from './my_takes/my_takes';
import { AuthState } from './login/authState';
import { ProtectedRoute } from './login/protected_route';
import { getCurrentUser, logout } from './api';

export default function App() {
    const [userInfo, setUserInfo] = React.useState(null);
    const [authState, setAuthState] = React.useState(AuthState.Unknown);
    const [userCount, setUserCount] = React.useState(0);

    React.useEffect(() => {
        (async function checkUser() {
            try {
                const user = await getCurrentUser();
                setUserInfo(user);
                setAuthState(AuthState.Authenticated);
            } catch {
                setAuthState(AuthState.Unauthenticated);
            }
        })();
    }, []);

    React.useEffect(() => {
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

        socket.onopen = () => {
            console.log('App WebSocket connected');
        };

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === 'userCount') {
                setUserCount(msg.value);
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    async function handleLogout() {
        await logout();
        setUserInfo(null);
        setAuthState(AuthState.Unauthenticated);
    }

    if (authState === AuthState.Unknown) {
        return null;
    }

    return (
        <BrowserRouter>
            <div className='main_container'>
                <header className="flex justify-between items-center px-5 h-16 border-y-2 bg-[#ff4d4d]">
                    <div className="flex items-center gap-10">
                        <NavLink
                            className="font-bold text-2xl text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,5)]"
                            to={authState === AuthState.Authenticated ? "/main_feed" : "/"}
                        >
                            HotTakes
                        </NavLink>
                        <nav>
                            {authState === AuthState.Authenticated && (
                                <menu className="flex gap-2">
                                    <li>
                                        <NavLink
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "text-white underline font-medium"
                                                    : "text-white font-medium"
                                            }
                                            to="main_feed"
                                        >
                                            Home
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "text-white underline font-medium"
                                                    : "text-white font-medium"
                                            }
                                            to="my_takes"
                                        >
                                            My Takes
                                        </NavLink>
                                    </li>
                                </menu>
                            )}
                        </nav>
                    </div>

                    <div>
                        {authState === AuthState.Authenticated && (
                            <NavLink className="bg-[#D9D9D9] border-2 text-black w-full rounded-lg px-4 py-0.5 font-medium" to="/" onClick={handleLogout}>Logout</NavLink>
                        )}
                    </div>
                </header>

                <Routes>
                    <Route
                        path='/'
                        element={<Login
                            setAuthState={setAuthState}
                            setUserInfo={setUserInfo}
                        />}
                        exact
                    />

                    <Route
                        path='/main_feed'
                        element={
                            <ProtectedRoute authState={authState}>
                                <MainFeed userInfo={userInfo} />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path='/my_takes'
                        element={
                            <ProtectedRoute authState={authState}>
                                <MyTakes userInfo={userInfo} />
                            </ProtectedRoute>
                        }
                    />

                    <Route path='*' element={<NotFound />} />
                </Routes>

                <footer className="flex justify-between border-y-2 px-5 py-3 bg-[#FF4D4D]">
                    <div className="footer-left">
                        <a className="text-white drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,5)]">Joonhee Shin</a>
                    </div>
                    <div className="text-white font-medium drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,5)]">
                        Active Users: {userCount}
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