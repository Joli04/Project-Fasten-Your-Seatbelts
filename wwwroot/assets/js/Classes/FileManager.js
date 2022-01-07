import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
export default class FileManager {
    constructor(file) {
        this.file = file;
    }
    getExtension() {

        if(this.file.extension){
            return this.file.extension;
        }else{
            return null;
        }
    }
    isImage() {
        var ext = this.getExtension()
        console.log(ext);
        switch (ext.toLowerCase()) {
            case 'jpeg':
            case 'jpg':
            case 'gif':
            case 'bmp':
            case 'png':
                //etc
                return true;
        }
        return false;
    }
    isVideo() {
        var ext = this.getExtension();
        switch (ext.toLowerCase()) {
            case 'm4v':
            case 'avi':
            case 'mpg':
            case 'mp4':
                return true;
        }
        return false;
    }
    isDocument() {
        var ext = this.getExtension();
        switch (ext.toLowerCase()) {
            case 'docx':
            case 'xls':
            case 'pdf':
            case 'ppt':
            case 'csv':
                return true;
        }
        return false;
    }
    async uplaud(filename, url) {
        return await FYSCloud.API.uploadFile(filename, url, true);
    }
}