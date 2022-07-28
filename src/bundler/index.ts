import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import { fetchPlugin } from './plugins/fetch-plugin'



let service: esbuild.Service

const bundle = async (rawCode: string) => {

    if (!service) {
        service = await esbuild.startService({
            worker: true,
            wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
        });
    }


    // bundle all the import linked files into one file
    const result = await service.build({
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        plugins: [
            unpkgPathPlugin(),
            fetchPlugin(rawCode)
        ],
        define: {
            'process.env.NODE_ENV': '"production"',  // use '"production" means replace the string of production, not the variable of prodection
            global: 'window'
        }
    })


    return result.outputFiles[0].text
}

export default bundle