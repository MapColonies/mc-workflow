"use strict";

const DataHandler = require("./dataHandler");
const bluebird = require("bluebird");
const fs = bluebird.promisifyAll(require("graceful-fs"));
const path = require("path");

module.exports = class DataHandlerFileSystem extends DataHandler {
  constructor(logger) {
    super();
    this._logger = logger;
  }

  readStream(filePath, streamChunkSize) {
    const readStream = fs.createReadStream(filePath, {
      bufferSize: streamChunkSize,
    });
    readStream
      .on("end", () => {
        if (readStream) {
          readStream.destroy();
        }
      })
      .on("close", (err) => {
        this._logger.info(
          `FileSystem read stream was failed and file is closed : ${filePath}`
        );
      });

    return Promise.resolve(readStream);
  }

  writeFile(filePath, fileName, data, fileExtension) {
    fs.writeFile(`${filePath}/${fileName}.${fileExtension}`, data, (err) => {
      if (err) {
        throw err;
      }
    });
  }

  async removeFile(rootPath, filesName, fileExtension) {
    const file = `${rootPath}/${filesName}.${fileExtension}`;

    await fs.unlinkSync(file);
  }

  async getFilesFromRootPath(rootPath) {
    const rootpath = path.resolve(rootPath);
    await fs.statSync(rootpath);

    const files = await fs.readdirAsync(rootpath);
    return files;
  }

  async fileExists(rootPath, fileName, fileExtension) {
    const files = await this.getFilesFromRootPath(rootPath);
    return files.includes(`${fileName}.${fileExtension}`);
  }
};

