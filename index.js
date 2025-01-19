require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster-crud1.0ugo3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-CRUD1`;



const app = express();

const port = process.env.PORT || 5000;


app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost:5173'],
    credentials: true

}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});



const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const verifyToken = (req, res, next) => {
    if (!req.cookies.token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    })
}




async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const LinkHiveDB = client.db("LinkHiveDB");
        const usersCollection = LinkHiveDB.collection("Users");
        const postsCollection = LinkHiveDB.collection("Posts");


        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '5h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            })
                .send({ success: true });
        });

        app.delete('/jwt', async (req, res) => {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            }).send({ success: true });
        });

        app.post('/user', verifyToken, async (req, res) => {
            const bodyData = req.body;
            const newUser = {
                email: bodyData.email,
                name: bodyData.name,
                profileImage: bodyData.photo,
                role: "user",
                badges: ["bronze"],
                membership: false,
                postsCount: 0,
                commentCount: 0
            }

            const query = { email: req.user.email }
            const userData = await usersCollection.findOne(query)
            if (userData) {
                return res.send(userData)
            }
            const insertResp = await usersCollection.insertOne(newUser)
            res.send({ ...newUser, _id: insertResp.insertedId })
        })

        app.get('/user', verifyToken, async (req, res) => {
            const query = { email: req.user.email }
            const userData = await usersCollection.findOne(query);
            if (userData) {
                return res.send(userData)
            }
        })

        app.post('/post', verifyToken, async (req, res) => {
            const newPost = req.body;
            newPost.upVote = 0;
            newPost.downVote = 0;
            newPost.commentCount = 0;
            newPost.isReported = false;
            newPost.createdAt = new Date();

            if (req?.user.email !== newPost.authorEmail) {
                return res.status(403).json({ message: 'Forbidden' })
            }
            const query = { authorId: newPost.authorId };
            const userPostCount = await postsCollection.countDocuments(query);
            if (userPostCount >= 5) {
                return res.send({ message: "maximum 5 posts for bronze member" })
            }
            
            const insertResponse = await postsCollection.insertOne(newPost);
            const updatedDoc = {
                $set: {
                    postsCount: userPostCount + 1
                }
            }
            const userUpdateResponse = await usersCollection.updateOne({ _id: new ObjectId(newPost.authorId) }, updatedDoc, { upsert: false })
            res.send({ userPostCount, cookieuser: req?.user.email, userUpdateResponse, insertResponse });
        })

        app.get('/post', async (req, res)=>{
            const allPosts = await postsCollection.aggregate([
                {
                    $addFields: {
                      authorId: { $toObjectId: "$authorId" } 
                    }
                  },
                  {
                    $lookup: {
                      from: "Users",
                      localField: "authorId",
                      foreignField: "_id",
                      as: "authorData"
                    }
                  },
                  {
                    $unwind:  "$authorData"
                  },
                  {
                    $project:{
                        "authorData.badges": 0,
                        "authorData.postsCount":0,
                        "authorData.commentCount":0
                    }
                  }
            ]).toArray();

            res.send(allPosts)
        })


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir)





app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
})
