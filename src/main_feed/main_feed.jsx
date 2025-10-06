import React from 'react';

export function MainFeed() {
  return (
    <main>
        <div id="user-input-element" class="bg-white px-10 py-6 border-2 mb-16 rounded-lg w-full sm:w-[90%] md:w-[80%] lg:w-[55%] drop-shadow-[10px_10px_0.5px_rgba(0,0,0,0.3)]">
            <form class="flex flex-col gap-5">
                <div class="flex items-center gap-3">
                    <img class="rounded-[100%] border-2 border-black" src="/profile_1.svg" width="50" />
                    <div class="font-semibold text-lg">Joonhee Shin</div>
                </div>
                <textarea class="bg-white w-full h-full rounded-md px-4 py-2 border-solid border-2" placeholder="what's your controversial hot take?"></textarea>
                <button class="bg-[#4dffbc] border-2 border-black text-black w-full rounded-lg p-2 font-medium" type="submit">Let the debates begin...</button>
            </form>
        </div>
        <div id="feed-container" class="flex flex-col w-full sm:w-[90%] md:w-[80%] lg:w-[55%] gap-10">
            <div class="bg-white border-2 rounded-lg drop-shadow-[10px_10px_0.5px_rgba(0,0,0,0.3)]">
                <div class="flex flex-col gap-3 p-7">
                    <div class="flex gap-3">
                        <img class="rounded-[100%] border-2 border-black" src="/profile_2.svg" width="50" />
                        <div>
                            <div class="font-semibold">James Bond</div>
                            <div class="text-sm font-semibold text-[#898989]">09.09.25</div>
                        </div>
                    </div>
                    <div class="flex flex-col italic items-center my-6 mx-10 py-16 border-y-2">
                        <h3 class="text-2xl  text-center w-[80%]">"The 'reply all' button on emails is a menace to society and should only be accessible via a three-factor authentication system."</h3>
                    </div>
                </div>
                
                <div id="vote-button" class="border-t-2 rounded-b-lg">
                    <div class="flex h-52 rounded-b-lg">
                        <div class="flex flex-col justify-between items-center w-full border-r-2 p-3 rounded-bl-md bg-[#4dffbc]">
                            
                            <div class="flex justify-between gap-5 w-full">
                                <div class="w-1 p-3"></div>
                                <div class="text-2xl font-semibold">Bet.</div>
                                <div class="flex items-center justify-center bg-white h-1 w-1 p-3 border-2 rounded-[100%]">
                                    <div class="text-sm font-bold">24</div>
                                </div>
                            </div>
                            <img class="h-[65%] border-2 rounded-2xl" src="/agree_1.gif" />
                            
                            <div></div>
                        </div>
                        
                        <div class="flex flex-col justify-between items-center w-full p-3 rounded-br-md bg-[#ff4d4d]">
                            <div class="flex justify-between gap-5 w-full">
                                <div class="w-1 p-3"></div>
                                <div class="text-2xl font-semibold text-white drop-shadow-[2px_3px_0px_rgba(0,0,0,5)]">Naw</div>
                                <div class="flex items-center justify-center bg-white h-1 w-1 p-3 border-2 rounded-[100%]">
                                    <div class="text-sm font-bold">11</div>
                                </div>
                            </div>
                        
                            <img class="h-[65%] border-2 rounded-2xl" src="/disagree_1.gif" />
                            <div></div>
                        </div>
                    </div>                        
                </div>
            </div>
            <div class="bg-white border-2 rounded-lg drop-shadow-[10px_10px_0.5px_rgba(0,0,0,0.3)]">
                <div class="flex flex-col gap-3 p-7">
                    <div class="flex gap-3">
                        <img class="rounded-[100%] border-2 border-black" src="/profile_3.svg" width="50" />
                        <div>
                            <div class="font-semibold">Luke Skywalker</div>
                            <div class="text-sm font-semibold text-[#898989]">09.08.25</div>
                        </div>
                    </div>
                    <div class="flex flex-col italic items-center my-6 mx-10 py-16 border-y-2">
                        <h3 class="text-2xl  text-center w-[80%]">"Pineapple on pizza is actually fine."</h3>
                    </div>
                </div>
                
                <div id="vote-button" class="border-t-2 rounded-b-lg">
                    <div class="flex h-52 rounded-b-lg">
                        <div class="flex flex-col justify-between items-center w-full border-r-2 p-3 rounded-bl-md bg-[#4dffbc]">
                            
                            <div class="flex justify-between gap-5 w-full">
                                <div class="w-1 p-3"></div>
                                <div class="text-2xl font-semibold">Bet.</div>
                                <div class="flex items-center justify-center bg-white h-1 w-1 p-3 border-2 rounded-[100%]">
                                    <div class="text-sm font-bold">4</div>
                                </div>
                            </div>
                            <img class="h-[65%] border-2 rounded-2xl" src="/agree_2.gif" />
                            
                            <div></div>
                        </div>
                        
                        <div class="flex flex-col justify-between items-center w-full p-3 rounded-br-md bg-[#ff4d4d]">
                            <div class="flex justify-between gap-5 w-full">
                                <div class="w-1 p-3"></div>
                                <div class="text-2xl font-semibold text-white drop-shadow-[2px_3px_0px_rgba(0,0,0,5)]">Naw</div>
                                <div class="flex items-center justify-center bg-white h-1 w-1 p-3 border-2 rounded-[100%]">
                                    <div class="text-sm font-bold">17</div>
                                </div>
                            </div>
                        
                            <img class="h-[65%] border-2 rounded-2xl" src="/disagree_2.gif" />
                            <div></div>
                        </div>
                    </div>                        
                </div>
            </div>
            <div class="bg-white border-2 rounded-lg drop-shadow-[10px_10px_0.5px_rgba(0,0,0,0.3)]">
                <div class="flex flex-col gap-3 p-7">
                    <div class="flex gap-3">
                        <img class="rounded-[100%] border-2 border-black" src="/profile_1.svg" width="50" />
                        <div>
                            <div class="font-semibold">Joonhee Shin</div>
                            <div class="text-sm font-semibold text-[#898989]">09.08.25</div>
                        </div>
                    </div>
                    <div class="flex flex-col italic items-center my-6 mx-10 py-16 border-y-2">
                        <h3 class="text-2xl  text-center w-[80%]">"Eating cereal with a fork is actually superior because it lets you save all the milk for a glorious final sip."</h3>
                    </div>
                </div>
                
                <div id="vote-button" class="border-t-2 rounded-b-lg">
                    <div class="flex h-52 rounded-b-lg">
                        <div class="flex flex-col justify-between items-center w-full border-r-2 p-3 rounded-bl-md bg-[#4dffbc]">
                            
                            <div class="flex justify-between gap-5 w-full">
                                <div class="w-1 p-3"></div>
                                <div class="text-2xl font-semibold">Bet.</div>
                                <div class="flex items-center justify-center bg-white h-1 w-1 p-3 border-2 rounded-[100%]">
                                    <div class="text-sm font-bold">2</div>
                                </div>
                            </div>
                            <img class="h-[65%] border-2 rounded-2xl" src="/agree_3.gif" />
                            
                            <div></div>
                        </div>
                        
                        <div class="flex flex-col justify-between items-center w-full p-3 rounded-br-md bg-[#ff4d4d]">
                            <div class="flex justify-between gap-5 w-full">
                                <div class="w-1 p-3"></div>
                                <div class="text-2xl font-semibold text-white drop-shadow-[2px_3px_0px_rgba(0,0,0,5)]">Naw</div>
                                <div class="flex items-center justify-center bg-white h-1 w-1 p-3 border-2 rounded-[100%]">
                                    <div class="text-sm font-bold">17</div>
                                </div>
                            </div>
                        
                            <img class="h-[65%] border-2 rounded-2xl" src="/disagree_3.gif" />
                            <div></div>
                        </div>
                    </div>                        
                </div>
            </div>
        </div>
    </main>
  );
}