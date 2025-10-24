import React from 'react';
import { Post } from './post';
import { UserInfo } from '../login/userInfo';

export function MainFeed({userInfo, userPost, setUserInfo, setUserPost, dataList, setDataList}) {
    const [oldData, setOldData] = React.useState([]);
    const [userInput, setUserInput] = React.useState("");
    const [buttonImg, setButtonImg] = React.useState("");
    const createPost = (() => {
        const newPost = new Post(userInfo.name, userInput, getAgreeDisagree("agree"), getAgreeDisagree("disagree"));
        setUserPost((prevPosts) => {
            const updatedPostList =  [newPost, ...prevPosts];
            const newUserData = new UserInfo(userInfo.name, userInfo.pwd);
            newUserData.posts = updatedPostList;
            setUserInfo(newUserData)
            setUserInput("");
            localStorage.setItem('user', JSON.stringify(newUserData))
            return updatedPostList
        })
    })
    const getProfilePic = (userInfo) => {
        if (userInfo == "James Bond") {
            return "/profile_2.svg"
        } else if (userInfo == "Luke Skywalker") {
            return "/profile_3.svg"
        } else if (userInfo == "Joonhee Shin") {
            return "/profile_4.svg"
        } else {
            return "/profile_1.svg"
        }
    }
    const getAgreeDisagree = (agreeDisagree) => {
        const rand = Math.floor(Math.random() * 3) + 1;
        if (agreeDisagree === "agree") {
            return "/agree_" + rand + ".gif";
        } else {
            return "/disagree_" + rand + ".gif";
        }
    }
async function agreeDisagree(clickedPost, voteType) {
        const userName = userInfo.name;

        const newDataList = dataList.map(post => {
            if (post !== clickedPost) {
                return post;
            }
            const selectPost = JSON.parse(JSON.stringify(post));

            const agreeList = selectPost.agree;
            const disagreeList = selectPost.disagree;

            if (voteType === 'agree') {
                if (agreeList.includes(userName)) {
                    selectPost.agree = agreeList.filter(name => name !== userName);
                } else {
                    selectPost.agree.push(userName);
                    selectPost.disagree = disagreeList.filter(name => name !== userName);
                }
            } else {
                if (disagreeList.includes(userName)) {
                    selectPost.disagree = disagreeList.filter(name => name !== userName);
                } else {
                    selectPost.disagree.push(userName);
                    selectPost.agree = agreeList.filter(name => name !== userName);
                }
            }
            
            return selectPost;
        });

        setDataList(newDataList);
    }
    React.useEffect(() => {
        const newDataList = [...userPost, ...oldData];
        setDataList(newDataList);
    }, [oldData, userPost])

    React.useEffect(() => {
        fetch('./oldData.json')
        .then(response => response.json())
        .then(jsonData => setOldData(jsonData));
    }, []);

    return (
        <main>
            <div id="user-input-element" className="bg-white px-10 py-6 border-2 mb-16 rounded-lg w-full sm:w-[90%] md:w-[80%] lg:w-[55%] drop-shadow-[10px_10px_0.5px_rgba(0,0,0,0.3)]">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <img className="rounded-[100%] border-2 border-black" src={getProfilePic(userInfo)} width="50" />
                        <div className="font-semibold text-lg">{userInfo.name}</div>
                    </div>
                    <textarea className="bg-white w-full h-full rounded-md px-4 py-2 border-solid border-2" placeholder="what's your controversial hot take?" onChange={(e) => setUserInput(e.target.value)} value={userInput}></textarea>
                    <button className="bg-[#4dffbc] border-2 border-black text-black w-full rounded-lg p-2 font-medium" type="button" onClick={() => userInput !== "" && createPost() }>Let the debates begin...</button>
                </div>
            </div>

            <div id="feed-container" className="flex flex-col w-full sm:w-[90%] md:w-[80%] lg:w-[55%] gap-10">
                
                {dataList.map((post) => {
                    console.log(post)
                    return(
                        <div className="bg-white border-2 rounded-lg drop-shadow-[10px_10px_0.5px_rgba(0,0,0,0.3)]">
                                <div className="flex flex-col gap-3 p-7">
                                    <div className="flex gap-3">
                                        <img className="rounded-[100%] border-2 border-black" src={getProfilePic(post.name)} width="50" />
                                        <div>
                                            <div className="font-semibold">{post.name}</div>
                                            <div className="text-sm font-semibold text-[#898989]">{post.date}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col italic items-center my-6 mx-10 py-16 border-y-2">
                                        <h3 className="text-2xl  text-center w-[80%]">{post.field}</h3>
                                    </div>
                                </div>
                                
                                <div id="vote-button" className="border-t-2 rounded-b-lg">
                                    <div className="flex h-52 rounded-b-lg">
                                        <div className="flex flex-col justify-between items-center w-full border-r-2 p-3 rounded-bl-md bg-[#4dffbc]" onClick={() => agreeDisagree(post, "agree")}>
                                            
                                            <div className="flex justify-between gap-5 w-full">
                                                <div className="w-1 p-3"></div>
                                                <div className="text-2xl font-semibold">Bet.</div>
                                                <div className="flex items-center justify-center bg-white h-1 w-1 p-3 border-2 rounded-[100%]">
                                                    <div className="text-sm font-bold">{post.agree.length}</div>
                                                </div>
                                            </div>
                                            <img className="h-[65%] border-2 rounded-2xl" src={post.agreeImg} />
                                            
                                            <div></div>
                                        </div>
                                        
                                        <div className="flex flex-col justify-between items-center w-full p-3 rounded-br-md bg-[#ff4d4d]"onClick={() => agreeDisagree(post, "disagree")}>
                                            <div className="flex justify-between gap-5 w-full">
                                                <div className="w-1 p-3"></div>
                                                <div className="text-2xl font-semibold text-white drop-shadow-[2px_3px_0px_rgba(0,0,0,5)]">Naw</div>
                                                <div className="flex items-center justify-center bg-white h-1 w-1 p-3 border-2 rounded-[100%]">
                                                    <div className="text-sm font-bold">{post.disagree.length}</div>
                                                </div>
                                            </div>
                                        
                                            <img className="h-[65%] border-2 rounded-2xl" src={post.disagreeImg} />
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