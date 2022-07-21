import * as esbuild from 'esbuild-wasm';
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



export const unpkgPathPlugin = () => {
    return {
        name: 'unpkg-path-plugin',

        // interact or override certain parts of the bundling process by working with the build argument
        setup(build: esbuild.PluginBuild) {

            // onResolve event listener:
            // to Figure out where the index.js file is stored
            // if there are any import/require/exports, figure out where the requested file is

            // filter: 
            // use regular expression to filter file names to work with the onResole/onLoad event handler

            // namespace:
            // similar to filter, apply specific files to onResole/onLoad funtions
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                console.log('onResolve', args);
                if (args.path === 'index.js') {
                    return { path: args.path, namespace: 'a' };
                }

                if (args.path.includes('./') || args.path.includes('../')) {
                    return {
                        namespace: 'a',
                        path: new URL(
                            args.path,
                            'https://unpkg.com' + args.resolveDir + '/'
                        ).href,
                    };
                }

                return {
                    namespace: 'a',
                    path: `https://unpkg.com/${args.path}`,
                };
            });



            // onLoad event listener:
            // to Attempt to load up the index.js file
            // attempt to load all the import/require/exports files up
            build.onLoad({ filter: /.*/ }, async (args: any) => {
                console.log('onLoad', args);

                if (args.path === 'index.js') {
                    return {
                        loader: 'jsx',
                        contents: `
                            const message = require('react');
                            console.log(message);
                        `,
                    };
                }


                // check to see if we have already fetched the file and if it is in the cache
                const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path)

                // if it is fetched & in the cache, return it immediately
                if (cachedResult) {
                    return cachedResult
                }

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
                await fileCache.setItem(args.path, result)

                return result

            });
        },
    };
};