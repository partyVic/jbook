import * as esbuild from 'esbuild-wasm';

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

            // Handle root entry file name exactly 'index.js'
            build.onResolve({ filter: /(^index\.js$)/ }, () => {
                return { path: 'index.js', namespace: 'a' };
            });

            // Handle relative paths in a module
            // same as: if (args.path.includes('./') || args.path.includes('../'))
            build.onResolve({ filter: /^\.+\// }, (args: any) => {
                console.log('onResolve', args);
                return {
                    namespace: 'a',
                    path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/')
                        .href,
                };
            });

            // Handle main file of a module
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                console.log('onResolve', args);
                return {
                    namespace: 'a',
                    path: `https://unpkg.com/${args.path}`,
                };
            });
        },
    };
};