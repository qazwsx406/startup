import React from 'react';
import { getPosts, vote } from '../api';

export function MyTakes({ userInfo }) {
    const [myPosts, setMyPosts] = React.useState([]);

    React.useEffect(() => {
        async function loadMyPosts() {
            try {
                const allPosts = await getPosts();
                const userPosts = allPosts.filter(post => post.email === userInfo.email);
                setMyPosts(userPosts);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        }

        if (userInfo) {
            loadMyPosts();
        }
    }, [userInfo]);

    const handleVote = async (postId, voteType) => {
        try {
            const updatedPost = await vote(postId, voteType);
            // Replace the old post with the updated one in the state
            setMyPosts(myPosts.map(p => p.id === postId ? updatedPost : p));
        } catch (error) {
            console.error("Failed to vote:", error);
        }
    };

    const getProfilePic = (postUserEmail) => {
        // This is placeholder logic.
        if (postUserEmail === "james@bond.com") {
            return "/profile_2.svg";
        } else if (postUserEmail === "luke@skywalker.com") {
            return "/profile_3.svg";
        } else {
            return "/profile_1.svg";
        }
    };

    return (
        <main className="container-fluid bg-secondary text-center">
            <div className="text-2xl mb-[60px] mt-[30px] font-semibold w-full sm:w-[90%] md:w-[80%] lg:w-[55%]">
                <div className="bg-white p-3 border-2 rounded-lg w-fit drop-shadow-[7px_7px_0.5px_rgba(0,0,0,0.3)]">My Takes</div>
                <div></div>
            </div>
            <div id="feed-container" className="flex flex-col w-full sm:w-[90%] md:w-[80%] lg:w-[55%] gap-10">
                
                {myPosts.map((post) => {
                    return(
                        <div key={post.id} className="bg-white border-2 rounded-lg drop-shadow-[10px_10px_0.5px_rgba(0,0,0,0.3)]">
                            <div className="flex flex-col gap-3 p-7">
                                <div className="flex gap-3">
                                    <img className="rounded-[100%] border-2 border-black" src={getProfilePic(post.email)} width="50" />
                                    <div>
                                        <div className="font-semibold">{post.email}</div>
                                        <div className="text-sm font-semibold text-[#898989]">{new Date().toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col italic items-center my-6 mx-10 py-16 border-y-2">
                                    <h3 className="text-2xl text-center w-[80%]">{post.post}</h3>
                                </div>
                            </div>
                            
                            <div id="vote-button" className="border-t-2 rounded-b-lg">
                                <div className="flex h-52 rounded-b-lg">
                                    <div className="flex flex-col justify-between items-center w-full border-r-2 p-3 rounded-bl-md bg-[#4dffbc]" onClick={() => handleVote(post.id, "agree")}>
                                        <div className="flex justify-between gap-5 w-full">
                                            <div className="w-1 p-3"></div>
                                            <div className="text-2xl font-semibold">Bet.</div>
                                            <div className="flex items-center justify-center bg-white h-1 w-1 p-3 border-2 rounded-[100%]">
                                                <div className="text-sm font-bold">{post.agree.length}</div>
                                            </div>
                                        </div>
                                        <img className="h-[65%] border-2 rounded-2xl" src={"/agree_1.gif"} />
                                        <div></div>
                                    </div>
                                    
                                    <div className="flex flex-col justify-between items-center w-full p-3 rounded-br-md bg-[#ff4d4d]" onClick={() => handleVote(post.id, "disagree")}>
                                        <div className="flex justify-between gap-5 w-full">
                                            <div className="w-1 p-3"></div>
                                            <div className="text-2xl font-semibold text-white drop-shadow-[2px_3px_0px_rgba(0,0,0,5)]">Naw</div>
                                            <div className="flex items-center justify-center bg-white h-1 w-1 p-3 border-2 rounded-[100%]">
                                                <div className="text-sm font-bold">{post.disagree.length}</div>
                                            </div>
                                        </div>
                                        <img className="h-[65%] border-2 rounded-2xl" src={"/disagree_1.gif"} />
                                        <div></div>
                                    </div>
                                </div>                        
                            </div>
                        </div>
                    )
                })}
            </div>
        </main>
    );
}