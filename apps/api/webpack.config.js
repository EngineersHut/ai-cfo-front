const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
    clean: true,
<<<<<<< HEAD

=======
>>>>>>> 06855b28cb43ac230f32336c71b9fadf3707e625
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
<<<<<<< HEAD

  resolve: {
    alias: {
      'class-transformer/storage':
        require.resolve('class-transformer/cjs/storage'),
    },
  },

=======
>>>>>>> 06855b28cb43ac230f32336c71b9fadf3707e625
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
<<<<<<< HEAD
      assets: ['./src/assets'],
=======
      assets: ["./src/assets"],
>>>>>>> 06855b28cb43ac230f32336c71b9fadf3707e625
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      sourceMap: true,
<<<<<<< HEAD
    }),
  ],
};
=======
    })
  ],
};
>>>>>>> 06855b28cb43ac230f32336c71b9fadf3707e625
