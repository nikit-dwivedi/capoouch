const fs = require('fs');
const AWS = require('aws-sdk');
const ffmpeg = require('fluent-ffmpeg');
const { exec } = require("child_process");



const s3 = new AWS.S3({
    accessKeyId: '',
    secretAccessKey: ''
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
    if (fileData.originPath) {
        fs.unlinkSync(fileData.originPath)
    }
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

// const mergeAudio = async (defaultAudioData, fileData) => {
//     exec(`ls -la audio/`, (error, stdout, stderr) => {
//         if (error) {
//             console.log(`error: ${error.message}`);
//             return;
//         }
//         if (stderr) {
//             console.log(`stderr: ${stderr}`);
//             return;
//         }
//         console.log(`stdout: ${stdout}`);
//     });
//     return new Promise((resolve, reject) => {
//         console.log("default audio =>", defaultAudioData.audio);
//         console.log("recorded audio =>", fileData.path);
//         let Fname = fileData.filename.split(".")[0]
//         let FPath = fileData.path.split(".")[0]
//         console.log(fileData.filename.split(".")[0]);
//         ffmpeg.setFfprobePath('/snap/bin/ffmpeg/ffmpeg')
//         ffmpeg("./"+defaultAudioData.audio)
//             .input("./",fileData.path)
//             .on('end', async function () {
//                 console.log('Merging finished !');
//                 fs.unlinkSync(fileData.path)
//                 let newFileData = {
//                     filename: Fname + ".mp3",
//                     path: FPath + ".mp3"
//                 }
//                 resolve(newFileData)
//             })
//             .on('error', function (err) {
//                 console.log('An error occurred: ' + err.message);
//                 reject(false)
//             })
//             .mergeToFile(`audio`,"audio")
//     })
// };
const mergeAudio = async (defaultAudioData, fileData) => {
    try {
        console.log(defaultAudioData, fileData);
        let Fname = fileData.filename.split(".")[0]
        let FPath = fileData.path.split(".")[0]
        ffmpeg.setFfprobePath('/snap/bin/ffmpeg/ffmpeg.ffprobe')
        const proc = new ffmpeg({ source: fileData.path })
        proc.mergeAdd(defaultAudioData.audio)
        proc.mergeToFile(`${FPath}.mp3`, "audio/");
        let newFileData = {
            filename: Fname + ".mp3",
            path: FPath + ".mp3",
            originPath: fileData.path
        }
        return newFileData
    } catch (error) {
        console.log("====",error);
        return error
    }
};

module.exports = { uploadAudio, uploadImage, mergeAudio };