const fs = require('fs');
const AWS = require('aws-sdk');
const ffmpeg = require('fluent-ffmpeg');

const s3 = new AWS.S3({
    accessKeyId: 'AKIAX4PAJC2HA3OXCVNE',
    secretAccessKey: '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'
});




const uploadAudio = async (fileData) => {
    const blob = fs.readFileSync(fileData.path)
    const params = {
        Bucket: 'audio-bucket-dev-nikit', // pass your bucket name
        Key: 'audio/' + fileData.filename, // file will be saved as testBucket/contacts.csv
        Body: blob
    };
    const data = await s3.upload(params).promise();
    fs.unlinkSync(fileData.path)
    return data
};

const uploadImage = async (fileData) => {
    const blob = fs.readFileSync(fileData.path)
    const params = {
        Bucket: 'audio-bucket-dev-nikit', // pass your bucket name
        Key: 'image/' + fileData.filename, // file will be saved as testBucket/contacts.csv
        Body: blob
    };
    const data = await s3.upload(params).promise();
    fs.unlinkSync(fileData.path)
    return data
};

const mergeAudio = async (defaultAudioData, fileData) => {
    console.log(__dirname);
    return new Promise((resolve, reject) => {
        let Fname = fileData.filename.split(".")[0]
        let FPath = fileData.path.split(".")[0]
        console.log(fileData.filename.split(".")[0]);
        ffmpeg.setFfprobePath('/snap/bin/ffmpeg/ffmpeg.ffprobe')
        ffmpeg(defaultAudioData.audio)
            .input(fileData.path)
            .on('end', async function () {
                console.log('Merging finished !');
                fs.unlinkSync(fileData.path)
                let newFileData = {
                    filename: Fname + ".mp3",
                    path: FPath + ".mp3"
                }
                resolve(newFileData)
            })
            .on('error', function (err) {
                console.log('An error occurred: ' + err.message);
                reject(false)
            })
            .mergeToFile(`/home/nikit/capoouch/audio/output.mp3`, '/home/nikit/capoouch/audio')
    })
};
module.exports = { uploadAudio, uploadImage, mergeAudio };