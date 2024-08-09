// [描述] 获取  匿名函数FunctionExpression|方法声明MethodDeclaration 开头 的 第一条语句

// 参考: https://gist.github.com/banyudu/cf5a6c8ff4b6c8acec97a5517c0fa583
// ts-ast在线解析  https://ts-ast-viewer.com/

import { Statement,FunctionExpression,MethodDeclaration} from "ts-morph";


export function get_firstStmt_of_Func(funcDecl: FunctionExpression|MethodDeclaration):Statement|undefined{
  

      const startLnNum:number=funcDecl.getStartLineNumber();
      const endLnNum:number=funcDecl.getEndLineNumber();
      //忽略起止行号相同的函数
      if(endLnNum==startLnNum){ return undefined;}

      // const 函数进入语句文本:string=`  const _funcName/* :string */='${funcName}' ; _funcNoArgs_enter_log(_srcFilePath,_funcName ) ; `

      //忽略无函数体的函数
      if(!funcDecl.getBody()){ return undefined;}

      //获取函数的语句列表
      const stmts:Statement[]=funcDecl.getStatements()
      //忽略无语句的函数
      if(!stmts || stmts.length==0){ return undefined;}

      //取函数第一条语句
      const stmt0:Statement=stmts[0]
      //忽略第一条语句为空的函数
      if(!stmt0){ return undefined;}

      return stmt0;
// }//end_for
  
}