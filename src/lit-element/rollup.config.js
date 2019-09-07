import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import minifyHTML from 'rollup-plugin-minify-html-literals';
export default {
    entry: 'main.js',
    dest: 'bundle.js',
    format: 'iife',
    plugins: [
        minifyHTML(),
        resolve(),
        terser()
    ]
};