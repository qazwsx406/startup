import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, vote, deletePost } from '../api';

export function MyTakes({ userInfo }) {
    const [myPosts, setMyPosts] = React.useState([]);
    const navigate = useNavigate();

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

    React.useEffect(() => {
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

        socket.onopen = () => {
            console.log('WebSocket connected (My Takes)');
        };

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === 'voteUpdate') {
                setMyPosts(prevPosts => prevPosts.map(p => p.id === msg.value.id ? msg.value : p));
            } else if (msg.type === 'postDeleted') {
                setMyPosts(prevPosts => prevPosts.filter(p => p.id !== msg.value));
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    const handleVote = async (postId, voteType) => {
        try {
            const updatedPost = await vote(postId, voteType);
            setMyPosts(myPosts.map(p => p.id === postId ? updatedPost : p));
        } catch (error) {
            console.error("Failed to vote:", error);
        }
    };

    const handleDelete = async (postId) => {
        try {
            await deletePost(postId);
            setMyPosts(myPosts.filter(p => p.id !== postId));
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    };

    const getProfilePic = (postUserEmail) => {
        console.log("Generating avatar for email:", postUserEmail);
        return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${postUserEmail}`;
    };

    return (
        <main className="container-fluid bg-secondary text-center">
            {myPosts.length > 0 && (
                <div className="text-2xl mb-[60px] mt-[30px] font-semibold w-full sm:w-[90%] md:w-[80%] lg:w-[55%]">
                    <div className="bg-white p-3 border-2 border-black rounded-lg w-fit drop-shadow-[7px_7px_0.5px_rgba(0,0,0,0.3)] text-black mb-10">My Takes</div>
                </div>
            )}
            <div id="feed-container" className="flex flex-col w-full sm:w-[90%] md:w-[80%] lg:w-[55%] gap-10">
                {myPosts.length === 0 ? (
                    <div className="bg-white border-2 border-black rounded-lg drop-shadow-[10px_10px_0.5px_rgba(0,0,0,0.3)] p-7 text-center text-black font-medium cursor-pointer" onClick={() => navigate('/main_feed')}>
                        You haven't posted any takes yet. Go to Home to share your controversial opinions!
                    </div>
                ) : (
                    myPosts.map((post) => {
                        return (
                            <div key={post.id} className="bg-white border-2 rounded-lg drop-shadow-[10px_10px_0.5px_rgba(0,0,0,0.3)]">
                                <div className="flex flex-col gap-3 p-7">
                                    <div className="flex justify-between">
                                        <div className="flex gap-3">
                                            <img className="rounded-[100%] border-2 border-black" src={getProfilePic(post.email)} width="50" />
                                            <div>
                                                <div className="font-semibold">{post.email}</div>
                                                <div className="text-sm font-semibold text-[#898989]">{new Date().toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        {userInfo.email === post.email && (
                                            <button className="text-red-500 font-semibold text-sm w-8 h-8 rounded-full flex items-center justify-center border-2 border-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors duration-200" onClick={() => handleDelete(post.id)}>X</button>
                                        )}
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
                                            <img className="h-[65%] border-2 rounded-2xl" src={post.agreeGifUrl} />
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
                                            <img className="h-[65%] border-2 rounded-2xl" src={post.disagreeGifUrl} />                                            <div></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </main>
    );
}
