"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("file-system");
var ProgressMonitor = net.lingala.zip4j.progress.ProgressMonitor;
var Zip = (function () {
    function Zip() {
    }
    Zip.zip = function () {
    };
    Zip.unzipWithProgress = function (archive, destination, progressCallback, overwrite, password) {
        if (!fs.File.exists(archive)) {
            return Promise.reject("File does not exist, invalid archive path: " + archive);
        }
        return new Promise(function (resolve, reject) {
            try {
                var zipFile = new net.lingala.zip4j.core.ZipFile(archive);
                zipFile.setRunInThread(true);
                if (zipFile.isEncrypted() && password) {
                    zipFile.setPassword(password);
                }
                zipFile.extractAll(destination);
                var monitor_1 = zipFile.getProgressMonitor();
                var progressInterval_1 = setInterval(function () {
                    if (monitor_1.getState() === ProgressMonitor.STATE_BUSY) {
                        if (progressCallback)
                            progressCallback(monitor_1.getPercentDone());
                    }
                    else {
                        var result = monitor_1.getResult();
                        if (result === ProgressMonitor.RESULT_SUCCESS) {
                            resolve();
                        }
                        else if (result === ProgressMonitor.RESULT_ERROR) {
                            reject(monitor_1.getException() ? monitor_1.getException().getMessage() : 'error');
                        }
                        else {
                            reject('cancelled');
                        }
                        clearInterval(progressInterval_1);
                    }
                }, Zip.ProgressUpdateRate);
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    Zip.unzip = function (archive, destination, overwrite, password) {
        try {
            var zipFile = new net.lingala.zip4j.core.ZipFile(archive);
            zipFile.setRunInThread(true);
            if (zipFile.isEncrypted() && password) {
                zipFile.setPassword(password);
            }
            zipFile.extractAll(destination);
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
Zip.ProgressUpdateRate = 100;
exports.Zip = Zip;
//# sourceMappingURL=zip.android.js.map