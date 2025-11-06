const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 3000;
const cookie = 'authToken';

let users = [];
let posts = [];

app.use(express.json());

app.use(cors());
app.use(cookieParser());

let apiRouter = express.Router();
app.use(`/api`, apiRouter);

const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[cookie]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// create user
apiRouter.post('/auth/create', async (req, res) => {
  console.log('Signup attempt for email:', req.body.email);
  const existingUser = await findUser('email', req.body.email);
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
  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// deleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[cookie]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(cookie);
  res.status(204).end();
});

// GetUser returns information about the authenticated user
apiRouter.get('/user/me', verifyAuth, async (req, res) => {
    const user = await findUser('token', req.cookies[cookie]);
    if (user) {
        res.send({ email: user.email });
    } else {
        res.status(404).send({ msg: 'User not found' });
    }
});

// create new post
apiRouter.post('/posts', verifyAuth, async (req, res) => {
  const newPost = await createPost(req.body.email, req.body.post);
  if (newPost) {
    res.send(newPost)
  } else {
    res.status(400).send({ msg: 'Failed to Create Post'})
  }

})

// get all posts
apiRouter.get('/posts', verifyAuth, async (req, res) => {
  res.send([...posts].reverse());
})

// get post
apiRouter.get('/posts/:id', verifyAuth, async (req, res) => {
  const post = await findPost(req.params.id);
  if (post) {
    res.send(post)
  } else {
    res.status(404).send({ msg: 'Failed to Get Post'})
  }
})

// Vote on a post
apiRouter.post('/posts/:id/vote', verifyAuth, async (req, res) => {
    const post = await findPost(req.params.id);
    if (!post) {
        return res.status(404).send({ msg: 'Post not found' });
    }

    const user = await findUser('token', req.cookies[cookie]);
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
        } else {
            post.disagree.push(userEmail);
            post.agree = post.agree.filter(email => email !== userEmail);
        }
    } else {
        return res.status(400).send({ msg: 'Invalid vote type' });
    }

    res.send(post);
});

// Delete a post
apiRouter.delete('/posts/:id', verifyAuth, async (req, res) => {
    const post = await findPost(req.params.id);
    if (!post) {
        return res.status(404).send({ msg: 'Post not found' });
    }

    const user = await findUser('token', req.cookies[cookie]);
    if (post.email !== user.email) {
        return res.status(403).send({ msg: 'Forbidden' });
    }

    posts = posts.filter(p => p.id !== req.params.id);

    res.status(204).end();
});

// function to find post by id
async function findPost(id_value) {
  if (!id_value) return null;
  
  return posts.find((p) => p['id'] === id_value)
}

// helper function to create new posts
async function createPost(email, post) {
  const newPost = {
    id: uuid.v4(),
    email: email,
    post: post,
    agree: [],
    disagree: []
  }

  posts.push(newPost);

  return newPost;
}

// function to find user
async function findUser(field, value) {
  if (!value) return null;

  return users.find((u) => u[field] === value);
}

// function to create new user
async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  users.push(user);

  return user;
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