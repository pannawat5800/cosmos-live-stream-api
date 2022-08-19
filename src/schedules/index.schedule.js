const cron = require('node-cron');
const { CreateLiveSettingJob } = require('./jobs/live-setting.job')
const { CleanUpChatDataInFirebase } = require('./jobs/chat.job');


// // job for midnight
cron.schedule('0 0 0 * * *', () => {
    CreateLiveSettingJob()
    // CleanUpChatDataInFirebase()
},
{
    scheduled: true,
    timezone: "Asia/Bangkok"
});


// CreateLiveSettingJob()



