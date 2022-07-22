import * as esbuild from 'esbuild-wasm'
import axios from 'axios';
import localforage from 'localforage'; // used for storage data in the browser by using indexedDB

const fileCache = localforage.createInstance({
    name: 'filecache' // name of the database
});

// use example:
// (async () => {
//     await fileCache.setItem('color', 'red')

//     const color = await fileCache.getItem('color')

//     console.log(color)
// })()

export const fetchPlugin = (inputCode: string) => {
    return {
        name: 'fetch-plugin',
        setup(build: esbuild.PluginBuild) {

            // onLoad event listener:
            // to Attempt to load up the index.js file
            // attempt to load all the import/require/exports files up

            // Handle root entry file name exactly 'index.js'
            build.onLoad({ filter: /(^index\.js$)/ }, () => {
                return {
                    loader: 'jsx',
                    contents: inputCode,
                };
            });


            // Handle every other files which is not index.js
            build.onLoad({ filter: /.*/ }, async (args: any) => {
                // check to see if we have already fetched the file and if it is in the cache
                const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

                // if it is fetched & in the cache, return it immediately
                if (cachedResult) {
                    return cachedResult
                }
            });


            // Handle file end up with .css
            build.onLoad({ filter: /.css$/ }, async (args: any) => {
                const { data, request } = await axios.get(args.path);

                // Make the .css file can be read by the loader:'jsx'
                const escaped = data
                    .replace(/\n/g, '')
                    .replace(/"/g, '\\"')
                    .replace(/'/g, "\\'");
                const contents = `
                  const style = document.createElement('style');
                  style.innerText = '${escaped}';
                  document.head.appendChild(style);
                `;

                const result: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    contents: contents,
                    resolveDir: new URL('./', request.responseURL).pathname,
                };
                await fileCache.setItem(args.path, result);

                return result;
            });


            build.onLoad({ filter: /.*/ }, async (args: any) => {
                const { data, request } = await axios.get(args.path);

                const result: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    contents: data,

                    // resolveDir: 
                    // provided to the next file that we tried to require
                    // describe where we found this original file
                    resolveDir: new URL('./', request.responseURL).pathname,
                };

                // if not yet fetched the file, then store response in cache
                await fileCache.setItem(args.path, result);

                return result;
            });
        }
    }
}