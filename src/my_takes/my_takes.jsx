import React from 'react';

export function MyTakes() {
  return (
    <main className="container-fluid bg-secondary text-center">
        <main>
            <div className="text-2xl mb-[60px] mt-[30px] font-semibold w-full sm:w-[90%] md:w-[80%] lg:w-[55%]">
                <div className="bg-white p-3 border-2 rounded-lg w-fit drop-shadow-[7px_7px_0.5px_rgba(0,0,0,0.3)]">My Takes</div>
                <div></div>
            </div>

            <div id="feed-container" className="flex flex-col w-full sm:w-[90%] md:w-[80%] lg:w-[55%] gap-5">
                <div className="bg-white border-2 rounded-lg drop-shadow-[10px_10px_0.5px_rgba(0,0,0,0.3)]">
                    <div className="flex flex-col gap-3 p-7">
                        <div className="flex gap-3">
                            <img className="rounded-[100%] border-2 border-black" src="/profile_1.svg" width="50" />
                            <div>
                                <div className="font-semibold">Joonhee Shin</div>
                                <div className="text-sm font-semibold text-[#898989]">09.08.25</div>
                            </div>
                        </div>
                        <div className="flex flex-col italic items-center my-6 mx-10 py-16 border-y-2">
                            <h3 className="text-2xl  text-center w-[80%]">"Eating cereal with a fork is actually superior because it lets you save all the milk for a glorious final sip."</h3>
                        </div>
                    </div>
                    
                    <div id="vote-button" className="border-t-2 rounded-b-lg">
                        <div className="flex h-52 rounded-b-lg">
                            <div className="flex flex-col justify-between items-center w-full border-r-2 p-3 rounded-bl-md bg-[#4dffbc]">
                                
                                <div className="flex justify-between gap-5 w-full">
                                    <div className="w-1 p-3"></div>
                                    <div className="text-2xl font-semibold">Bet.</div>
                                    <div className="flex items-center justify-center bg-white h-1 w-1 p-3 border-2 rounded-[100%]">
                                        <div className="text-sm font-bold">2</div>
                                    </div>
                                </div>

                                <img className="h-[65%] border-2 rounded-2xl" src="/agree_3.gif" />
                                
                                <div></div>
                            </div>
                            
                            <div className="flex flex-col justify-between items-center w-full p-3 rounded-br-md bg-[#ff4d4d]">
                                <div className="flex justify-between gap-5 w-full">
                                    <div className="w-1 p-3"></div>
                                    <div className="text-2xl font-semibold text-white drop-shadow-[2px_3px_0px_rgba(0,0,0,5)]">Naw</div>
                                    <div className="flex items-center justify-center bg-white h-1 w-1 p-3 border-2 rounded-[100%]">
                                        <div className="text-sm font-bold">17</div>
                                    </div>
                                </div>
                            
                                <img className="h-[65%] border-2 rounded-2xl" src="/disagree_3.gif" />
                                <div></div>
                            </div>
                        </div>                        
                    </div>
                </div>
            
            </div>
        </main>
    </main>
  );
}