const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 3000;
const cookie = 'authToken';
const {
  getUser,
  getUserByToken,
  createUser,
  addPost,
  getPosts,
  getPost,
  updatePost,
  updateUser,
  deletePost,
} = require('./database.js');

app.use(express.json());

app.use(cors());

app.use(cookieParser());

app.use(express.static('public'));

let apiRouter = express.Router();
app.use(`/api`, apiRouter);

const verifyAuth = async (req, res, next) => {
  const user = await getUserByToken(req.cookies[cookie]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

apiRouter.post('/auth/create', async (req, res) => {
  const existingUser = await getUser(req.body.email);
  if (existingUser) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = await getUser(req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const newToken = uuid.v4();
      const updatedUser = { ...user, token: newToken };
      updatedUser._id = user._id;
      await updateUser(updatedUser);
      setAuthCookie(res, newToken);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await getUserByToken(req.cookies[cookie]);
  if (user) {
    const updatedUser = { ...user, token: undefined };
    updatedUser._id = user._id;
    await updateUser(updatedUser);
  }
  res.clearCookie(cookie, {
    secure: false,
    httpOnly: true,
    sameSite: 'strict',
  });
  res.status(204).end();
});

apiRouter.get('/user/me', verifyAuth, async (req, res) => {
    const user = await getUserByToken(req.cookies[cookie]);
    if (user) {
        res.send({ email: user.email });
    } else {
        res.status(404).send({ msg: 'User not found' });
    }
});

apiRouter.post('/posts', verifyAuth, async (req, res) => {
  const agreeGifUrl = await getRandomGiphyGif('agree');
  const disagreeGifUrl = await getRandomGiphyGif('disagree');

  const newPost = {
    id: uuid.v4(),
    email: req.body.email,
    post: req.body.post,
    agree: [],
    disagree: [],
    agreeGifUrl: agreeGifUrl || "agree_1.gif",
    disagreeGifUrl: disagreeGifUrl || "disagree_1.gif"
  }

  await addPost(newPost);
  broadcastMessage({ type: 'newPost', value: newPost });
  res.send(newPost);
})

apiRouter.get('/posts', verifyAuth, async (req, res) => {
  const posts = await getPosts();
  res.send(posts.reverse());
})

apiRouter.get('/posts/:id', verifyAuth, async (req, res) => {
  const post = await getPost(req.params.id);
  if (post) {
    res.send(post)
  } else {
    res.status(404).send({ msg: 'Failed to Get Post'})
  }
})

apiRouter.post('/posts/:id/vote', verifyAuth, async (req, res) => {
    const post = await getPost(req.params.id);
    if (!post) {
        return res.status(404).send({ msg: 'Post not found' });
    }

    const user = await getUserByToken(req.cookies[cookie]);
    const userEmail = user.email;
    const { voteType } = req.body;

    if (voteType === 'agree') {
        if (post.agree.includes(userEmail)) {
            post.agree = post.agree.filter(email => email !== userEmail);
        } else {
            post.agree.push(userEmail);
            post.disagree = post.disagree.filter(email => email !== userEmail);
        }
    } else if (voteType === 'disagree') {
        if (post.disagree.includes(userEmail)) {
            post.disagree = post.disagree.filter(email => email !== userEmail);
        } else {
            post.disagree.push(userEmail);
            post.agree = post.agree.filter(email => email !== userEmail);
        }
    } else {
        return res.status(400).send({ msg: 'Invalid vote type' });
    }

    await updatePost(post);
    broadcastMessage({ type: 'voteUpdate', value: post });
    res.send(post);
});

apiRouter.delete('/posts/:id', verifyAuth, async (req, res) => {
    const post = await getPost(req.params.id);
    if (!post) {
        return res.status(404).send({ msg: 'Post not found' });
    }

    const user = await getUserByToken(req.cookies[cookie]);
    if (post.email !== user.email) {
        return res.status(403).send({ msg: 'Forbidden' });
    }

    await deletePost(req.params.id);
    broadcastMessage({ type: 'postDeleted', value: req.params.id });
    res.status(204).end();
});

apiRouter.get('/gifs/random', async (req, res) => {
  try {
    const { type } = req.query;
    const gifUrl = await getRandomGiphyGif(type);
    if (gifUrl) {
      res.send({ gifUrl });
    } else {
      res.status(404).send({ msg: 'No GIFs found for the given type.' });
    }
  } catch (error) {
    res.status(500).send({ msg: 'Failed to fetch GIF.', error: error.message });
  }
});

const giphyConfig = require('./giphyConfig.json');

async function getRandomGiphyGif(type) {
  const giphyApiKey = giphyConfig.apiKey;
  const searchTerm = type === 'agree' ? 'agree' : 'disagree';
  const giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${searchTerm}&limit=50&rating=g`;

  try {
    const response = await fetch(giphyUrl);
    if (!response.ok) {
      throw new Error(`Giphy API returned status ${response.status}`);
    }
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.data.length);
      return data.data[randomIndex].images.fixed_height.url;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

function setAuthCookie(res, authToken) {
  res.cookie(cookie, authToken, {
    secure: false,
    httpOnly: true,
    sameSite: 'strict',
  });
}

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const wss = new WebSocketServer({ server: httpService });

wss.on('connection', async (ws, req) => {
  const cookieString = req.headers.cookie;
  let user = null;

  if (cookieString) {
    const cookies = cookieString.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});

    if (cookies[cookie]) {
      user = await getUserByToken(cookies[cookie]);
    }
  }

  if (user) {
    ws.user = user;
    broadcastUserCount();
  } else {
    console.log('WebSocket connection attempt without valid user/cookie');
  }

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
  });

  ws.on('close', () => {
    if (ws.user) {
      broadcastUserCount();
    }
  });
});

function broadcastUserCount() {
  const activeUsers = new Set();
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocketServer.OPEN && client.user) {
      activeUsers.add(client.user.email);
    }
  });
  broadcastMessage({ type: 'userCount', value: activeUsers.size });
}

function broadcastMessage(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocketServer.OPEN || client.readyState === 1) { // 1 is OPEN
      client.send(JSON.stringify(data));
    }
  });
}