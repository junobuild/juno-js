import esbuild from 'esbuild';

export const PluginInlineWebWorker = (opt = {}) => {
  return {
    name: 'esbuild-plugin-inline-web-worker',
    setup(build) {
      build.onLoad({filter: /\.worker\.(js|jsx|ts|tsx)$/}, async ({path}) => {
        const {outputFiles} = await esbuild.build({
          entryPoints: [path],
          bundle: true,
          write: false,
          format: opt.format || 'iife',
          minify: true,
          target: ['node18']
        });

        if (outputFiles.length !== 1) {
          throw new Error('Too many files built for worker bundle.');
        }

        const {contents} = outputFiles[0];

        const base64 = Buffer.from(contents).toString('base64');

        return {
          loader: 'js',
          contents: `export default "data:application/javascript;base64,${base64}";`
        };
      });
    }
  };
};
