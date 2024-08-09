import { FunctionExpression, Identifier, SyntaxKind } from "ts-morph";
import {getFuncStartLineNumAsFuncName} from './Basic'

export function calcFuncName_of_FuncExpr(funcDecl:FunctionExpression):string{
  let funcName:string=undefined;

  //若形如 'let varXxx=function (){}' , 则返回 'varXxx'
  if(funcName=calcFuncName_of_FuncExpr_under_VarDecl(funcDecl)){
    return funcName;
  }

  //若形如 '{ fieldXxx=function (){} , field2, ... }' , 则返回 'fieldXxx'
  if(funcName=calcFuncName_of_FuncExpr_under_PropertyDecl(funcDecl)){
    return funcName;
  }

  //否则 返回 '匿名函数@行号yyy'
  return getFuncStartLineNumAsFuncName(funcDecl);
}//end_func calcFuncName_of_FuncExpr


/*
给匿名函数取名为varXxx, 形如 'let varXxx=function (){}'
 */
function calcFuncName_of_FuncExpr_under_VarDecl(funcDecl:FunctionExpression):string{
  //若形如 'let varXxx=function (){}' , 则返回 'varXxx'
  // if(funcDecl.getParentIfKind(SyntaxKind.VariableDeclaration)){
    const parent=funcDecl.getParent()
    const varDecl=parent.asKind(SyntaxKind.VariableDeclaration)
    if(varDecl){
      // const varName=varDecl.getChildAtIndex(0).asKind(SyntaxKind.Identifier)//第一个 子节点 可能是注释、 可能是标识符, 因此 这个写法不严谨(有错误) 
      const varName:Identifier=varDecl.getFirstChildByKind(SyntaxKind.Identifier)
      if(varName){
        console.log(`匿名函数取名,发现形式匿名函数赋值给变量,行号${funcDecl.getStartLineNumber()}:${funcDecl.getEndLineNumber()}`)
        return varName.getText()
      }
    }
  // }
  
  //否则 返回 空
  return undefined;

}//end_func calcFuncName_of_FuncExpr_under_VarDecl


/*
给匿名函数取名为fieldXxx, 形如 '{ fieldXxx=function (){} , field2, ... }'
 */
function calcFuncName_of_FuncExpr_under_PropertyDecl(funcDecl:FunctionExpression):string{
  //若形如 '{ fieldXxx=function (){} , field2, ... }' , 则返回 'fieldXxx'
  // if(funcDecl.getParentIfKind(SyntaxKind.VariableDeclaration)){
    const parent=funcDecl.getParent()
    const propertyDecl=parent.asKind(SyntaxKind.PropertyDeclaration)
    if(propertyDecl){
      // const varName=propertyDecl.getChildAtIndex(0).asKind(SyntaxKind.Identifier)//第一个 子节点 可能是注释、 可能是标识符, 因此 这个写法不严谨(有错误) 
      //获取第一个是标识符的子节点 作为 函数名
      const varName:Identifier=propertyDecl.getFirstChildByKind(SyntaxKind.Identifier)
      if(varName){
        console.log(`匿名函数取名,发现形式匿名函数作为字段值,行号${funcDecl.getStartLineNumber()}:${funcDecl.getEndLineNumber()}`)
        return varName.getText()
      }
    }
  // }
  
  //否则 返回 空
  return undefined;

}//end_func calcFuncName_of_FuncExpr_under_PropertyDecl

