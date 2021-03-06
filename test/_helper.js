import fs from 'fs-extra';
import path from 'path';
import chai, { expect } from 'chai';
import chaiSubset from 'chai-subset';
import chaiAsPromised from 'chai-as-promised';
import { ENV_VARS } from 'apify-shared/consts';

chai.use(chaiSubset);
chai.use(chaiAsPromised);

export const LOCAL_STORAGE_DIR = path.join(__dirname, '..', 'tmp', 'local-emulation-dir');

// Log unhandled rejections.
process.on('unhandledRejection', (err) => {
    console.log('----------------------------------------------------------------');
    console.log('- ERROR: Exiting tests because of unhandled promise rejection! -');
    console.log('----------------------------------------------------------------');
    console.log(err);
    process.exit(1);
});

// Immediately ensure that local emulation dir exists.
fs.ensureDirSync(path.resolve(LOCAL_STORAGE_DIR));

export const emptyLocalStorageSubdir = (subdir) => {
    const fullPath = path.resolve(path.join(LOCAL_STORAGE_DIR, subdir));

    fs.emptyDirSync(fullPath);
};

export const expectNotUsingLocalStorage = () => expect(process.env[ENV_VARS.LOCAL_STORAGE_DIR]).to.be.a('undefined');

export const expectDirEmpty = (dirPath) => {
    const content = fs.readdirSync(dirPath);
    expect(content).to.have.lengthOf(0);
};

export const expectDirNonEmpty = (dirPath) => {
    const content = fs.readdirSync(dirPath);
    expect(content).to.have.lengthOf.above(0);
};

export const startExpressAppPromise = (app, port) => {
    return new Promise((resolve) => {
        const server = app.listen(port, () => resolve(server));
    });
};
