//esm
import * as esprima from 'esprima'
import * as escodegen from 'escodegen'
import * as ast_types from 'ast-types'
import * as estree from 'estree'

//commonjs
// const esprima = require('esprima');
// const escodegen = require('escodegen');
// const b = require('ast-types').builders;
const b = ast_types.builders;

const program = `export default [
  require('@/pages/page1/model').default,
]`;
const tree:esprima.Program = esprima.parseModule(program,{loc:true});

const body:estree.ExportDefaultDeclaration=tree.body[0]  as estree.ExportDefaultDeclaration

const elements:any[] =  (body.declaration as estree.ArrayExpression).elements

const newNode:ast_types.namedTypes.MemberExpression = b.memberExpression(
  b.callExpression(
    b.identifier('require'), [
      b.literal('@/pages/page2/model'),
    ],
  ),
  b.identifier('default'),
)
elements.push(newNode);

const newCode:string = escodegen.generate(tree);
console.log(newCode);