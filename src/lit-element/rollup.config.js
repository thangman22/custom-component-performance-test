import resolve from 'rollup-plugin-node-resolve';
export default {
    entry: 'main.js',
    dest: 'bundle.js',
    format: 'iife',
    plugins: [
        resolve()
    ]
};