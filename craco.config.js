// const CracoLessPlugin = require('craco-less');

// module.exports = {
//   plugins: [
//     {
//       plugin: CracoLessPlugin,
//       options: {
//         lessLoaderOptions: {
//           lessOptions: {
//             modifyVars: { '@primary-color': '#1DA57A' },
//             javascriptEnabled: true,
//           },
//         },
//       },
//     },
//   ],
// };


const CracoAntDesignPlugin = require('craco-antd');

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          '@primary-color': "rgb(0, 82, 204)",
          '@font-size': '16px'
        },
      },
    },
  ],
};