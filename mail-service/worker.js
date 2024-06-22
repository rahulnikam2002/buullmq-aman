exports.sendMail = async (userId) =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Mail sent!!!");
            resolve({
                mailSent: true
            });
        }, 3000);
    });
