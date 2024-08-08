//esm
import {Parser,Program} from 'acorn'

//commonjs
// const {Parser} = require("acorn")

const program:Program=Parser.parse(`function func1(arg1,arg2){}`,{ecmaVersion:'latest',sourceType:'script'})
console.log(`program=${JSON.stringify(program)}`)