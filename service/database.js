const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const postCollection = db.collection('post');

(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  if (!token) return null;
  return userCollection.findOne({ token: token });
}

async function createUser(email, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      email: email,
      password: passwordHash,
      token: uuid.v4(),
    };
    await userCollection.insertOne(user);
    return user;
}

async function addPost(post) {
  return postCollection.insertOne(post);
}

function getPosts() {
    const cursor = postCollection.find();
    return cursor.toArray();
}

function getPost(id) {
    return postCollection.findOne({ id: id });
}

async function updatePost(post) {
    await postCollection.updateOne({ id: post.id }, { $set: post });
}

async function updateUser(user) {
    if (user._id) {
        await userCollection.updateOne({ _id: user._id }, { $set: user });
    } else {
        await userCollection.updateOne({ email: user.email }, { $set: user });
    }
}

async function deletePost(id) {
    await postCollection.deleteOne({ id: id });
}

module.exports = {
  getUser,
  getUserByToken,
  createUser,
  addPost,
  getPosts,
  getPost,
  updatePost,
  updateUser,
  deletePost,
};
