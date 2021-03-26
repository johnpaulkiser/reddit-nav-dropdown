const dummyServer = {
    feeds: [
        {name: "Home", icon: './img/home.svg'},
        {name: "Popular", icon: './img/popular.svg'},
        {name: "All", icon: './img/all.svg'},
        {name: "Top Communities", icon: "./img/top.svg"},
        {name: "Reddit Live", icon: "./img/live.svg"}
    ],
    communities: [
        {name: "r/AskReddit",icon: './img/askreddit.png', isFavorite: true},
        {name: "r/Funny", icon: './img/funny.png', isFavorite: true},
        {name: "r/pics", icon: './img/pics.png', isFavorite: false},
        {name: "r/wallstreetbets", icon: './img/wsb.png', isFavorite: false},
        {name: "r/oculus", icon: './img/oculus.png', isFavorite: false}
    ],
    other: [
        {name: "User Settings", icon: './img/snoo.svg'},
        {name: "Messages", icon: './img/snoo.svg'},
        {name: "Create Post", icon: './img/create.svg'},
        {name: "Create Community", icon: './img/create.svg'},
        {name: "Coins", icon: './img/coins.svg'},
    ]
}

export default dummyServer;