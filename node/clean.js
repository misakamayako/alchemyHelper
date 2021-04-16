const source = require("./source/source.json");
const fs = require("fs");
let result = [];
source.forEach((t, index) => {
  const canMade =
    typeof t.recommend === "string" && !/购买/.test(t.recommend) ? "否" : "是";
  result.push(
    `INSERT INTO equipment(\`id\`,\`grid\`, \`level\`, \`name\`, \`madeUp\`, \`recommend\`, \`material\`, \`canMade\`, \`ATK\`,` +
      ` \`MATK\`, \`DEF\`, \`MDEF\`, \`SPD\`, \`MAXHP\`, \`MAXSP\`, \`ANTISEAL\`) VALUES (${index},'${t.grid}', '${t.level}', '${t.name}',` +
      `'${t.madeUp.join(",")}', ` +
      `'${JSON.stringify(t.recommend)}',` +
      `'${t.material}','${canMade}',` +
      `${t.attribute.ATK || 0}, ${t.attribute.MATK || 0},` +
      `${t.attribute.DEF || 0}, ${t.attribute.MDEF || 0},` +
      `${t.attribute.SPD || 0}, ${t.attribute.MAXHP || 0},` +
      `${t.attribute.MAXSP || 0}, ${t.attribute.ANTISEAL || 0});`
  );
});
fs.writeFile("./sql.sql", Buffer.from(result.join("\r\n")), () => void 0);
