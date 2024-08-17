const axios = require('axios');
const fs = require('fs');
const schedule = require('node-schedule');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// Your Twilio phone number and the phone number you want to send SMS to
const twilioPhoneNumber = '+12089871396';
const yourPhoneNumber = '+48533843683';

// State to track if a notification has been sent
let notificationSent = false;

// Function to send SMS notification
const sendNotification = () => {
    client.messages.create({
        body: 'The content of https://8auto.pl/ has changed.',
        from: twilioPhoneNumber,
        to: yourPhoneNumber
    })
    .then((message) => {
        console.log(`Notification sent: ${message.sid}`);
        notificationSent = true; // Set the flag to true after sending the notification
    })
    .catch((error) => console.error(`Failed to send notification: ${error}`));
};

// Function to check the website for changes
const checkWebsite = async () => {
    try {
        const url = 'https://8auto.pl/';
        const response = await axios.get(url);
        const currentContent = response.data;

        // Read the previous content from the file
        let previousContent = '';
        try {
            previousContent = fs.readFileSync('page_content.txt', 'utf8');
        } catch (err) {
            console.log('No previous content found, saving current content.');
        }

        // Compare the current content with the previous content
        if (currentContent !== previousContent) {
            console.log('Content has changed!');
            if (!notificationSent) {
                sendNotification();
            }
            // Save the current content to the file
            fs.writeFileSync('page_content.txt', currentContent);
        } else {
            console.log('No change detected.');
            notificationSent = false; // Reset the flag if no change is detected
        }
    } catch (error) {
        console.error('Error fetching the website:', error);
    }
};

// Schedule the check every 10 seconds
schedule.scheduleJob('*/10 * * * *', () => {
    checkWebsite();
});
