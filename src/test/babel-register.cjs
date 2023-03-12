const register = require('@babel/register').default;

register({ extensions: ['.ts', '.mts', '.js', '.cjs', '.jsx'],
envName: 'test',});