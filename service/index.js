const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const express = require('express');
const cors = require('cors');
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

// create user
apiRouter.post('/auth/create', async (req, res) => {
  console.log('Signup attempt for email:', req.body.email);
  const existingUser = await getUser(req.body.email);
  console.log('Existing user found:', existingUser);

  if (existingUser) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    console.log('New user created:', user);
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await getUser(req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const newToken = uuid.v4();
      const updatedUser = { ...user, token: newToken };
      updatedUser._id = user._id; // Explicitly preserve _id
      await updateUser(updatedUser);
      setAuthCookie(res, newToken);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// deleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await getUserByToken(req.cookies[cookie]);
  if (user) {
    const updatedUser = { ...user, token: undefined };
    updatedUser._id = user._id; // Explicitly preserve _id
    await updateUser(updatedUser);
  }
  res.clearCookie(cookie);
  res.status(204).end();
});

// GetUser returns information about the authenticated user
apiRouter.get('/user/me', verifyAuth, async (req, res) => {
    const user = await getUserByToken(req.cookies[cookie]);
    if (user) {
        res.send({ email: user.email });
    } else {
        res.status(404).send({ msg: 'User not found' });
    }
});

// create new post
apiRouter.post('/posts', verifyAuth, async (req, res) => {
  const agreeGifUrl = await getRandomGiphyGif('agree');
  const disagreeGifUrl = await getRandomGiphyGif('disagree');

  const newPost = {
    id: uuid.v4(),
    email: req.body.email,
    post: req.body.post,
    agree: [],
    disagree: [],
    agreeGifUrl: agreeGifUrl || "agree_1.gif", // Fallback to static GIF
    disagreeGifUrl: disagreeGifUrl || "disagree_1.gif" // Fallback to static GIF
  }

  await addPost(newPost);
  res.send(newPost);
})

// get all posts
apiRouter.get('/posts', verifyAuth, async (req, res) => {
  const posts = await getPosts();
  res.send(posts.reverse());
})

// get post
apiRouter.get('/posts/:id', verifyAuth, async (req, res) => {
  const post = await getPost(req.params.id);
  if (post) {
    res.send(post)
  } else {
    res.status(404).send({ msg: 'Failed to Get Post'})
  }
})

// Vote on a post
apiRouter.post('/posts/:id/vote', verifyAuth, async (req, res) => {
    const post = await getPost(req.params.id);
    if (!post) {
        return res.status(404).send({ msg: 'Post not found' });
    }

    const user = await getUserByToken(req.cookies[cookie]);
    const userEmail = user.email;
    const { voteType } = req.body; // 'agree' or 'disagree'

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
        }
    } else {
        return res.status(400).send({ msg: 'Invalid vote type' });
    }

    await updatePost(post);
    res.send(post);
});

// Delete a post
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

    res.status(204).end();
});

// Giphy API endpoint
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
    console.error('Error fetching GIF from Giphy:', error);
    res.status(500).send({ msg: 'Failed to fetch GIF.', error: error.message });
  }
});

const giphyConfig = require('./giphyConfig.json');

// Helper function to get a random Giphy GIF
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
    console.error(`Error in getRandomGiphyGif for type ${type}:`, error);
    return null;
  }
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(cookie, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});