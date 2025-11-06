import React from 'react';
import { createPost as apiCreatePost, getPosts, vote, deletePost } from '../api';

export function MainFeed({ userInfo }) {
    const [posts, setPosts] = React.useState([]);
    const [userInput, setUserInput] = React.useState("");

    // Fetch posts from the backend when the component mounts
    React.useEffect(() => {
        async function loadPosts() {
            try {
                const fetchedPosts = await getPosts();
                setPosts(fetchedPosts);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        }
        loadPosts();
    }, []);

    const handleCreatePost = async () => {
        if (userInput.trim() === "") return;

        try {
            const newPostData = { email: userInfo.email, post: userInput };
            await apiCreatePost(newPostData);
            setUserInput(""); // Clear input field

            // Refresh posts to show the new one
            const fetchedPosts = await getPosts();
            setPosts(fetchedPosts);
        } catch (error) {
            console.error("Failed to create post:", error);
        }
    };

    const handleVote = async (postId, voteType) => {
        try {
            const updatedPost = await vote(postId, voteType);
            // Replace the old post with the updated one in the state
            setPosts(posts.map(p => p.id === postId ? updatedPost : p));
        } catch (error) {
            console.error("Failed to vote:", error);
        }
    };

    const handleDelete = async (postId) => {
        try {
            await deletePost(postId);
            // Filter out the deleted post from the state
            setPosts(posts.filter(p => p.id !== postId));
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    };

    const getProfilePic = (postUserEmail) => {
        console.log("Generating avatar for email:", postUserEmail);
        // Generate DiceBear avatar URL using 'bots-neutral' style and user email as seed
        return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${postUserEmail}`;
    };

    return (
        <main>
            <div id="user-input-element" className="bg-white px-10 py-6 border-2 mb-16 rounded-lg w-full sm:w-[90%] md:w-[80%] lg:w-[55%] drop-shadow-[10px_10px_0.5px_rgba(0,0,0,0.3)]">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <img className="rounded-[100%] border-2 border-black" src={getProfilePic(userInfo.email)} width="50" />
                        <div className="font-semibold text-lg">{userInfo.email}</div>
                    </div>
                    <textarea className="bg-white w-full h-full rounded-md px-4 py-2 border-solid border-2" placeholder="what's your controversial hot take?" onChange={(e) => setUserInput(e.target.value)} value={userInput}></textarea>
                    <button className="bg-[#4dffbc] border-2 border-black text-black w-full rounded-lg p-2 font-medium" type="button" onClick={handleCreatePost}>Let the debates begin...</button>
                </div>
            </div>

            <div id="feed-container" className="flex flex-col w-full sm:w-[90%] md:w-[80%] lg:w-[55%] gap-10">
                {posts.map((post) => {
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
                                        <img className="h-[65%] border-2 rounded-2xl" src={post.disagreeGifUrl} />
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
