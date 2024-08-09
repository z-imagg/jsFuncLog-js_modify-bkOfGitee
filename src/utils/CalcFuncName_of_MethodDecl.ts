//[描述] 获取方法声明 的 函数名
import { MethodDeclaration, SyntaxKind,Identifier } from "ts-morph";
import { getFuncStartLineNumAsFuncName } from "./Basic";

/** 
 
以下解析结果, 请参考此站点获得,  https://ts-ast-viewer.com 
    / **
      * iterate the layout.  Returns true when layout converged.
      * / 这块注释叫 JSDoc
    protected            tick          (                                     )                :             boolean            //这行依次叫
  //SyntaxList           Identifier    OpenParenToken   SyntaxList     CLoseParenToken    ColonToken        BooleanKeyword
  //  ProtectedKeyword
  { 
    //函数体
  }
*/
export function calcFuncName_of_MethodDecl(methodDecl:MethodDeclaration){
  if(!methodDecl){ throw new Error("此函数入参不应该为空,calcFuncName_of_MethodDecl")}

  const funcName_byLineNum:string=getFuncStartLineNumAsFuncName(methodDecl);
  //无可奈何时,返回用行号构造的函数名
  if(methodDecl.getChildCount()<=0){ return funcName_byLineNum;}

  // const field=funcDecl.getChildAtIndex(0); //方法声明 第一个节点 可能是注释块(JSDoc) 、也可能是protected、也可能是方法名, 原因此写法不严谨
  //获取 方法声明的第一个 标识符(即函数名) 作为 函数名
  const field:Identifier=methodDecl.getFirstChildByKind(SyntaxKind.Identifier)
  //以字段名为函数名
  return  field.getText();
}//end_func calcFuncName_of_FuncExpr

