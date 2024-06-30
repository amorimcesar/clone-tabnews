const { exec } = require("node:child_process");

function checkPostegres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostegres();
      return;
    }

    console.log("\n🟢 Postgre esta pronto e aceitando conexòes!\n");
  }
}

process.stdout.write("\n\n🔴 Aguardando Postgress aceitar conexões");

checkPostegres();
