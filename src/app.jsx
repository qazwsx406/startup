import React from 'react';
import './app.css';

export default function App() {
  return (
    <div className='main_container'>
        <header className="flex justify-between items-center px-5 h-16 border-y-2 bg-[#ff4d4d]">
            <div className="flex items-center gap-10">
                <a className="font-bold text-2xl text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,5)]" href="main_feed.html">HotTakes</a>
                <nav>
                    <menu className="flex gap-2">
                        <li><a className="text-white underline font-medium" href="main_feed.html">Home</a></li>
                        <li><a className="text-white font-medium" href="my_takes.html">My Takes</a></li>
                    </menu>
                </nav>
            </div>

            <div>
                <a className="bg-[#D9D9D9] border-2 text-black w-full rounded-lg px-4 py-0.5 font-medium" href="index.html">Logout</a>
            </div>
        </header>

        <main>App components go here</main>

        <footer className="flex justify-between border-y-2 px-5 py-3 bg-[#FF4D4D]">
            <div className="footer-left">
                <a className="text-white drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,5)]">Joonhee Shin</a>
            </div>
            <div className="footer-right">
                <a className="text-white font-semibold drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,5)]" href="https://github.com/qazwsx406/startup">GitHub</a>
            </div>            
        </footer>
    </div>
  );
}