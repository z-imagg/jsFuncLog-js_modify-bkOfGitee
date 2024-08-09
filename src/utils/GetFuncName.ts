import { FunctionExpression, SyntaxKind } from "ts-morph";

//以行号 给 匿名函数取名
function getFuncStartLineNumAsFuncName(funcDecl:FunctionExpression):string{
  const startLnNum:number=funcDecl.getStartLineNumber();
  // const endLnNum:number=funcDecl.getEndLineNumber();
  const funcName=`匿名函数@行号${startLnNum}`;
  return funcName;
}

/*
给以下匿名函数取名为varXxx
let varXxx=function (){}
 */
export function getFuncNameOfFuncExpr(funcDecl:FunctionExpression):string{
  //若形如 'let varXxx=function (){}' , 则返回 'varXxx'
  // if(funcDecl.getParentIfKind(SyntaxKind.VariableDeclaration)){
    const parent=funcDecl.getParent()
    const varDecl=parent.asKind(SyntaxKind.VariableDeclaration)
    if(varDecl){
      const varName=varDecl.getChildAtIndex(0).asKind(SyntaxKind.Identifier)
      if(varName){
        console.log(`匿名函数取名,发现形式匿名函数赋值给变量,行号${funcDecl.getStartLineNumber()}:${funcDecl.getEndLineNumber()}`)
        return varName.getText()
      }
    }
  // }
  
  //否则 返回 '匿名函数@行号yyy'
  return getFuncStartLineNumAsFuncName(funcDecl);

}