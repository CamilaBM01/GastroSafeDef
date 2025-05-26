module.exports = {
  apps: [
    {
      name: 'gastrosafe',
      script: 'dist/server/entry.mjs',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: '4321'
      }
    }
  ]
};
