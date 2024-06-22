const express = require("express");
const { Queue, Worker } = require("bullmq");

const app = express();
const port = 5001;

app.use(express.json());

const worker = new Worker(
    "email-notify",
    async (job) => {
        console.log("Message received");
        console.log(`Sending mail to ${job.data.email}`);
        console.log(`User ID: ${job.data.userId}`);
        const send = await sendMail();
        console.log({ send });
    },
    {
        connection: {
            host: "127.0.0.1",
            port: 6379
        }
    }
);

const sendMail = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Mail sent!!!");
            resolve({ mailSent: true });
        }, 3000);
    });
};

app.listen(port, () => {
    console.log(`Server connected at port: ${port}`);
});
