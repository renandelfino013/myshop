import { exec } from "node:child_process";

 function waitforpostgres(){

  exec("docker exec my_database pg_isready --host localhost", handlereturn);
  function handlereturn (error,stdout) {
    let up =stdout.search("accepting connections")
    if(up !== -1){
            console.log("\n\n🟢 postgres aceitando conexões!!\n\n");
            return
    }
    else{
        process.stdout.write(".");
        waitforpostgres()
    }

  }
}
  console.log("Up Database 🐳")

waitforpostgres()