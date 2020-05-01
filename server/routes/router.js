var express = require("express");
var RoomManager = require("../game/roomManager.js");

function createRouter(io) {
  // Set up router
  var router = express.Router();
  router.use(express.json());

  // Set up room management
  var roomManager = new RoomManager(io);

  // Base route
  router.get("/", function (req, res) {
    res.json({ message: "You are able to ping the API!" });
  });

  //-----//
  // GET //
  //-----//

  // router.get('/path', function(req, res) {
  //     res.json({success: true})
  // });

  //------//
  // POST //
  //------//

  router.post("/createroom", function (req, res) {
    const newRoomInfo = roomManager.createNewRoom();
    console.log("Created", newRoomInfo.roomCode);
    res.json({
      success: true,
      code: newRoomInfo.roomCode,
      adminKey: newRoomInfo.adminKey,
    });
  });

  router.post("/checkroom", function (req, res) {
    let code = req.body.code.toUpperCase();
    console.debug("Checking existence/joinability of:", code);
    let exists = roomManager.checkRoomExists(code);
    let joinable = roomManager.checkRoomJoinability(code);
    res.json({
      exists: exists,
      code: code,
      joinable: joinable,
    });
  });

  router.post("/uploadprompts", (req, res) => {
    console.log(req.body.promptEntry);
    let submittedPrompts = req.body.promptEntry;
    let promptArray = submittedPrompts.replace(/ {2,}/g, " ").split("\n");
    promptArray = promptArray.filter((prompt) => {
      return prompt.length > 0;
    });
    if (promptArray.length === 0) {
      res.send("Empty submission!");
    }

    res.send({ success: true, id: "ABCD-EFGH-IJKL-MNOP" });
  });

  return router;
}

// Export
module.exports = createRouter;
