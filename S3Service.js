const AWS = require('aws-sdk');
const app = require('./main');
const configService = require('./ConfigurationService');

class S3Service {
  constructor(accessKey, secretKey) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;

    AWS.config.update({
      credentials: new AWS.Credentials({
        accessKeyId: accessKey,
        secretAccessKey: secretKey
      })
    });

    this.s3 = new AWS.S3();
  };

  getBuckets() {
    return new Promise((resolve, reject) => {
      this.s3.listBuckets((err, data) => {
        if (err) {
          return reject(err);
        } else {
          app.setS3Context(this.s3);
          return resolve(data);
        }
      });
    });
  }

  uploadFile(fileName, data) {
    const request = this.s3.upload({
      Body: data,
      ACL: configService.getItem('ACL'),
      Key: fileName,
      StorageClass: configService.getItem('storageClass'),
      Bucket: configService.getItem('bucket'),
    }, (err, data) => {
      if (err) console.error(err);
      else console.log(data);
    });

    request.on('httpUploadProgress', (data) => {
      console.log(data);
    });
  }
}

module.exports = S3Service;