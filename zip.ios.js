"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("file-system");
var Zip = (function () {
    function Zip() {
    }
    Zip.zip = function () { };
    Zip.unzipWithProgress = function (archive, destination, progressCallback, overwrite, password) {
        return new Promise(function (resolve, reject) {
            if (!fs.File.exists(archive)) {
                return reject("File does not exist, invalid archive path: " + archive);
            }
            var worker = new Worker('./zip-worker-ios');
            worker.postMessage({ action: 'unzip', archive: archive, destination: destination, overwrite: overwrite, password: password });
            worker.onmessage = function (msg) {
                if (typeof msg.data.progress === 'number' && !isNaN(msg.data.progress)) {
                    progressCallback(msg.data.progress);
                }
                else if (msg.data.result === true) {
                    resolve();
                }
                else {
                    reject('zip-worker-ios failed');
                }
            };
            worker.onerror = function (err) {
                console.log("An unhandled error occurred in worker: " + err.filename + ", line: " + err.lineno);
                reject(err.message);
            };
        });
    };
    Zip.unzip = function (archive, destination, overwrite, password) {
        try {
            if (password || overwrite) {
                SSZipArchive.unzipFileAtPathToDestinationOverwritePasswordError(archive, destination, overwrite, password);
            }
            else {
                SSZipArchive.unzipFileAtPathToDestination(archive, destination);
            }
        }
        catch (ex) {
            console.log(ex);
        }
        finally {
            console.log("done");
        }
    };
    return Zip;
}());
exports.Zip = Zip;
//# sourceMappingURL=zip.ios.js.map