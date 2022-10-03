import {readdir, readFile, stat} from "fs";
import {promisify} from "util";
import {join} from "path";
import {Parser} from "xml2js";
import {flattenDeep} from "lodash";

// Convert sync functions into async
const fsReaddir = promisify(readdir);
const fsReadFile = promisify(readFile);
const fsStat = promisify(stat);
const xmlParser = new Parser();

export const parseFiles = async () => {
    const directoryPath = join(__dirname, "../reports");
    const allContents = await parseFolder(directoryPath);
    return flattenDeep(allContents);
};

export const parseFolder = async (baseDirectory: string): Promise<any[]> => {
    const files: any[] = await fsReaddir(baseDirectory);
    return Promise.all(files.map(async fileName => {
        const fullPath = join(baseDirectory, fileName);
        const stats = await fsStat(fullPath);
        if (stats.isDirectory()) {
            // recursive
            return parseFolder(fullPath);
        }
        if (stats.isFile()) {
            console.log(`parsing ${fullPath}`);
            return parseFile(fullPath);
        }
    }));
};

export const parseFile = async (fileName: string) => {
    const data: any = await fsReadFile(fileName);
    return xmlParser.parseStringPromise(data);
};