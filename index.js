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
        const interactionsCollection = LinkHiveDB.collection('Interactions');
        const commentsCollection = LinkHiveDB.collection('Comments');


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
            newPost.upVotes = 0;
            newPost.downVotes = 0;
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

        app.get('/post', async (req, res) => {
            const { userId, pid } = req.query;
            const pipeline = [
                {
                    $addFields: {
                        authorId: { $toObjectId: "$authorId" },
                    },
                },
                {
                    $lookup: {
                        from: "Users",
                        localField: "authorId",
                        foreignField: "_id",
                        as: "authorData",
                    },
                },
                {
                    $unwind: "$authorData",
                },
                {
                    $project: {
                        "authorData.badges": 0,
                        "authorData.postsCount": 0,
                        "authorData.commentCount": 0,
                    },
                },
            ];
            if (pid) {
                pipeline.unshift({
                    $match: {
                        _id: new ObjectId(pid)
                    }
                })
            }
            const allPosts = await postsCollection.aggregate(pipeline).toArray();
            const postIds = [...new Set(allPosts.map(post => post._id.toString()))]

            const userInteractions = await interactionsCollection
                .find({
                    $and: [
                        { userId: userId ? userId : "" },
                        { postId: { $in: postIds } }
                    ]
                })
                .toArray();

            const postsWithInteractions = allPosts.map((post) => {
                const interaction = userInteractions.find(
                    (int) => int.postId.toString() === post._id.toString()
                );
                return {
                    ...post,
                    userInteraction: interaction || { vote: "" },
                };
            });
            res.send([...postsWithInteractions]);
        })

        app.post('/vote', verifyToken, async (req, res) => {
            const { postId, userId, vote } = req.body;
            const existingInteraction = await interactionsCollection.findOne({ postId, userId });
            const newVote = existingInteraction?.vote === vote ? '' : vote;
            await interactionsCollection.updateOne(
                { postId, userId },
                { $set: { vote: newVote } },
                { upsert: true }
            );

            const [upVoteCount, downVoteCount] = await Promise.all([
                interactionsCollection.countDocuments({ postId, vote: 'upVote' }),
                interactionsCollection.countDocuments({ postId, vote: 'downVote' })
            ]);
            await postsCollection.updateOne(
                { _id: new ObjectId(postId) },
                { $set: { upVotes: upVoteCount, downVotes: downVoteCount } },
            );
            res.send({ message: "Vote updated", postId, userId, vote: newVote, upVoteCount, downVoteCount });
        })

        app.post('/comment', verifyToken, async (req, res) => {
            try {
                const { postId, userId, content, parentId = null } = req.body;

                if (!postId || !userId || !content) {
                    return res.status(400).json({ error: "postId, userId, and content are required." });
                }

                const newComment = {
                    postId: postId, // Ensure postId is an ObjectId
                    userId: userId, // Ensure userId is an ObjectId
                    content,
                    parentId: parentId ? parentId : null, // Set parentId if provided
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    replies: 0, // Optional, for optimization
                };

                const result = await commentsCollection.insertOne(newComment);

                if(result?.insertedId){    
                    const commentsCount = await commentsCollection.countDocuments({ postId: postId });
                    await postsCollection.updateOne({_id: new ObjectId(postId)},{
                        $set: {
                            commentCount: commentsCount
                        }
                    })
                    await interactionsCollection.updateOne({ postId: postId, userId: userId },{
                        $set: {
                            commented: true
                        }
                    })
                }

                res.status(201).json({
                    message: "Comment added successfully.",
                    commentId: result.insertedId,
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "An error occurred while adding the comment." });
            }
        });

        // Fetch comments for a specific post
        app.get('/comments/:postId', async (req, res) => {
            try {
                const { postId } = req.params;
                const { includeReplies = false } = req.query; // Optional query parameter

                const pipeline = [
                    {
                        $match: { postId, parentId: null }
                    },
                    {
                        $addFields: {
                            userId: { $toObjectId: "$userId" }
                        }
                    },
                    {
                        $lookup: {
                            from: 'Users',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'userDetails',
                        },
                    },
                    {
                        $unwind: "$userDetails"
                    },
                    {
                        $project: {
                            "userDetails._id" : 0,
                            "userDetails.badges" : 0,
                            "userDetails.postsCount" : 0,
                            "userDetails.commentCount" : 0
                        }
                    },
                    { $sort: { createdAt: -1 } }
                ]

                // Validate input
                if (!postId) {
                    return res.status(400).json({ error: "postId is required." });
                }

                if (includeReplies === 'true') {
                    // Fetch top-level comments and their replies in a single query
                    const comments = await commentsCollection.aggregate([
                        { $match: { postId, parentId: null } },
                        {
                            $lookup: {
                                from: 'Comments',
                                localField: '_id',
                                foreignField: 'parentId',
                                as: 'replies',
                            },
                        },
                        { $sort: { createdAt: -1 } }, // Sort by newest first
                    ]).toArray();

                    return res.status(200).json(comments);
                } else {
                    // Fetch only top-level comments
                    const comments = await commentsCollection
                        .aggregate(pipeline)
                        .toArray();

                    return res.status(200).json(comments);
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "An error occurred while fetching comments." });
            }
        });



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir)





app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
})
