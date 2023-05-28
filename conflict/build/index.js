import { exec, file } from "../utils.js";

export class CoreBuilder {
    constructor (sourceDirectory, outputDirectory, configFile) {
        this.sourceDirectory = sourceDirectory;
        this.outputDirectory = outputDirectory;
        this.configFile = configFile;
    }

    async build () {
        const output = await exec(`swc ${this.sourceDirectory} --out-dir ${this.outputDirectory} --config-file ${this.configFile}`, { cwd: process.cwd() });
        
        const info = output.stdout;
        const errors = output.stderr;

        return { info, errors };
    }

    async vercel () {
        const { finish } = await import("../vercel.js");
        if (finish) await finish();
    }
}

export async function build ({ vercel } = { vercel: false }) {
    const builder = new CoreBuilder("bot", ".conflict/build", file(__dirname, "..", ".swcrc"));

    const { info, errors } = await builder.build();
    
    if (vercel) await builder.vercel();

    return { info, errors };
}