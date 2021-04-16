const { ipcMain } = require("electron");
const QueryString = require("querystring");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const readline = require("readline");
const db = new sqlite3.Database(":memory:");
class App {
  constructor(mainWindow) {
    ipcMain.on("queryAll", this.queryAll.bind(this));
    ipcMain.on("getAllMaterial", this.getAllMaterial.bind(this));
    ipcMain.on("getCreatePath", this.getCreatePath.bind(this));
    ipcMain.on("minimize", () => {
      mainWindow.minimize();
    });
    ipcMain.on("close", () => {
      mainWindow.close();
    });

    mainWindow.on("maximize", () => {
      mainWindow.webContents.send("resize");
    });
    mainWindow.on("unmaximize", () => {
      mainWindow.webContents.send("resize");
    });
    db.run(
      `create table IF NOT EXISTS equipment(id int(8) ,grid int(8),level int(8),name varchar (63),madeUp varchar (63),recommend varchar (255), material varchar (7),canMade varchar(2),ATK int(10),MATK int(10),DEF int(10),MDEF int(10),SPD int(10),MAXHP int(10),MAXSP int(10),ANTISEAL int(10))`,
      (error) => {
        if (error) {
          ///
        } else {
          const rl = readline.createInterface({
            input: fs.createReadStream(path.join(__dirname, "./sql.sql")),
            terminal: false,
          });
          rl.on("line", function (chunk) {
            db.run(chunk.toString());
          });
          rl.on("close", function () {
            console.log("finished");
          });
        }
      }
    );
  }

  queryAll(event, arg) {
    const query = QueryString.decode(arg);
    let sql = "from equipment ";
    const queries = []
    Object.keys(query).forEach((t) => {
      if (query[t]) {
        switch (t) {
          case "sort":
            void 0;
            break;
          case "orderBy":
            void 0;
            break;
          case "page":
            void 0;
            break;
          case "name":
            queries.push( " name like '%" + query.name + "%' ");
            break;
          case "material":
            queries.push(" material = '" + query.material + "' ");
            break;
          case "canMade":
            queries.push(" canMade = '" + query.canMade + "' ");
            break;
          default:
            queries.push(` ${t}=${query[t]} `);
        }
      }
    });
    if (queries.length>0) {
      sql += " where " + queries.join(" and ")
    }
    let temp = [];
    temp.push(
      new Promise((resolve) => {
        db.get("select count(*) as count  " + sql, (error, data) => {
          resolve(data);
        });
      })
    );
    if (query.orderBy) {
      sql += " ORDER BY " + query.orderBy + " " + (query.sort || "DESC");
    } else {
      sql += " ORDER BY level desc";
    }
    sql += " limit 10 offset " + ((query.page || 1) - 1) * 10;
    temp.push(
      new Promise((resolve) => {
        db.all("select * " + sql, (error, data) => {
          resolve(data);
        });
      })
    );
    Promise.all(temp).then(([{ count = 0 }, data = []]) => {
      data = data.map((t) => ({
        ...t,
        recommend: JSON.parse(t.recommend),
        madeUp: t.madeUp.split(","),
      }));
      event.reply("queryAllReply", {
        count,
        data,
      });
    });
  }

  getAllMaterial(event) {
    db.all(
      "select distinct material from equipment",
      {},
      (error, data = []) => {
        event.reply("getAllMaterialReply", {
          count: data.length,
          data: data,
        });
      }
    );
  }

  getCreatePath(event, id) {
    db.get(
      `select id, name, recommend, canMade from equipment where id = ${id}`,
      (error, data) => {
        if (data && data.canMade === "是") {
          const total = {};
          this.getCreate(data.name, total).then((resolve) => {
            event.reply("gotCreatePath", { ...resolve, total: total });
          });
        } else {
          event.reply("gotCreatePath", {
            id: "-",
            name: data.name,
          });
        }
      }
    );
  }

  getCreate(name, total) {
    return new Promise((resolve) => {
      db.get(
        `select id, name, recommend, canMade from equipment where name = '${name}'`,
        (error, data) => {
          if (data) {
            const value = {
              id: data.id,
              name: data.name,
            };
            if (/购买/.test(data.recommend)) {
              value.children = [{ name: JSON.parse(data.recommend) }];
              !total[data.name] ? (total[data.name] = 1) : total[data.name]++;
              resolve(value);
            } else if (data.canMade === "是") {
              let recommend = JSON.parse(data.recommend);
              let children = [];
              value.children = [];
              if (Array.isArray(recommend) && recommend.length === 1) {
                recommend = recommend[0];
              }
              recommend.forEach((t) => {
                if (typeof t === "string") {
                  children.push(
                    this.getCreate(t, total).then((p) => {
                      value.children.push(p);
                    })
                  );
                } else {
                  let alternate = [];
                  t.forEach((u) => {
                    children.push(
                      this.getCreate(u, total).then((p) => {
                        alternate.push(p);
                      })
                    );
                  });
                  value.children.push({
                    name: "自行选择其中之一",
                    children: alternate,
                  });
                }
              });
              Promise.all(children).then(() => {
                resolve(value);
              });
            } else {
              !total[data.name] ? (total[data.name] = 1) : total[data.name]++;
              value.children = { name: JSON.parse(data.recommend) };
              resolve(value);
            }
          } else {
            !total[name] ? (total[name] = 1) : total[name]++;
            resolve({
              id: "-",
              name: name,
            });
          }
        }
      );
    });
  }
}
module.exports = App;
