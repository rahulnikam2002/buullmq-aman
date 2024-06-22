const express = require("express");
const { Queue, Worker } = require("bullmq");

const app = express();
const port = 5002;

const userVerificationRes = new Queue("user-verification-responder");

app.use(express.json());

const userDB = [{ id: 1, name: "Rahul Nikam", password: "#4I*VYVAS*(^R" }];

const verificationWorker = new Worker(
    "user-verification",
    async (job) => {
        const userId = job.data.userId;
        console.log("Received verification job with id =>", job.id);
        const isValidUser = userDB.some((item) => item.id === userId);
        console.log("Is user valid? =>", isValidUser);

        // Complete the job by returning the result
        return { isValidUser };
    },
    {
        connection: {
            host: "127.0.0.1",
            port: 6379
        }
    }
);

app.listen(port, () => {
    console.log(`Server connected at port: ${port}`);
});
