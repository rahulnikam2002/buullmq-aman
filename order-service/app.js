const express = require("express");
const { Queue, QueueEvents } = require("bullmq");

const app = express();
const port = 5000;

const emailNotification = new Queue("email-notify");
const verifyUser = new Queue("user-verification");
const verificationQueueEvents = new QueueEvents("user-verification");

const orderDB = [];

app.use(express.json());

const checkUserVerification = (jobId) => {
    return new Promise((resolve, reject) => {
        verificationQueueEvents.on("completed", ({ jobId: completedJobId, returnvalue }) => {
            if (jobId === completedJobId) {
                resolve(returnvalue.isValidUser);
            }
        });

        verificationQueueEvents.on("failed", ({ jobId: failedJobId, failedReason }) => {
            if (jobId === failedJobId) {
                reject(new Error(failedReason));
            }
        });
    });
};

app.post("/order", async (req, res) => {
    try {
        const { orderId, productName, price, userId } = req.body;

        const job = await verifyUser.add("verify user", { userId });
        console.log("Sent userId for verification, job id is =>", job.id);

        let isValidUser = await checkUserVerification(job.id);

        if (!isValidUser) {
            return res.status(401).send({ msg: "User is not valid!" });
        }

        const addOrderToDB = saveOrder({ orderId, productName, price, userId });

        emailNotification.add("send email", { email: "abc@gmail.com", userId });

        res.status(200).send({ orderDB, addOrderToDB: await addOrderToDB });
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
});

const saveOrder = async (orderDetails) =>
    new Promise((resolve) => {
        setTimeout(() => {
            orderDB.push(orderDetails);
            resolve(orderDetails);
        }, 2000);
    });

app.listen(port, () => {
    console.log(`Server connected at port: ${port}`);
});
