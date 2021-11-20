var checkers= [
  { row: 1, cell: 2, color: "white", king: false },
  { row: 1, cell: 4, color: "white", king: false },
  { row: 1, cell: 6, color: "white", king: false },
  { row: 1, cell: 8, color: "white", king: false },
  { row: 2, cell: 1, color: "white", king: false },
  { row: 2, cell: 3, color: "white", king: false },
  { row: 2, cell: 5, color: "white", king: false },
  { row: 2, cell: 7, color: "white", king: false },
  { row: 3, cell: 2, color: "white", king: false },
  { row: 3, cell: 4, color: "white", king: false },
  { row: 3, cell: 6, color: "white", king: false },
  { row: 3, cell: 8, color: "white", king: false },
  { row: 4, cell: 1, color: "", king: false },
  { row: 4, cell: 3, color: "", king: false },
  { row: 4, cell: 5, color: "", king: false },
  { row: 4, cell: 7, color: "", king: false },
  { row: 5, cell: 2, color: "", king: false },
  { row: 5, cell: 4, color: "", king: false },
  { row: 5, cell: 6, color: "", king: false },
  { row: 5, cell: 8, color: "", king: false },
  { row: 6, cell: 1, color: "black", king: false },
  { row: 6, cell: 3, color: "black", king: false },
  { row: 6, cell: 5, color: "black", king: false },
  { row: 6, cell: 7, color: "black", king: false },
  { row: 7, cell: 2, color: "black", king: false },
  { row: 7, cell: 4, color: "black", king: false },
  { row: 7, cell: 6, color: "black", king: false },
  { row: 7, cell: 8, color: "black", king: false },
  { row: 8, cell: 1, color: "black", king: false },
  { row: 8, cell: 3, color: "black", king: false },
  { row: 8, cell: 5, color: "black", king: false },
  { row: 8, cell: 7, color: "black", king: false },
];

var current;
var activplayer = 0;
var selectedChecker;
var target;
var blackDeadCheckerIndex = 0;
var whiteDeadCheckerIndex = 12;
var ischekerattak = false;
var haveToEat;
var beginPlay = checkers.slice();
initCheckers();
$(".checker").click(selectChecker);
$(".turn-" + activplayer).addClass("active");



function initCheckers() {
  for (var i = 0; i < checkers.length; i++) {
    var checker = checkers[i];
    if(checker.color===''&&checker.king)
    {checker.king=false;}
    if (checker.king) {
      $(`#cell-${checker.row}-${checker.cell}`).html(
        initKing(i, checker.color)
      );
    } else {
      $(`#cell-${checker.row}-${checker.cell}`).html(
        makeChecker(i, checker.color)
      );
    }
    console.log(checker);
  }
}

function clearBorad(){
  for(var i=0;i<24;i++){
    $('#'+i).html( `<div class="dead"></div>`)
  }
   var emptyspace='';
  for (var i = 0; i < beginPlay.length; i++) {
    var checker = beginPlay[i];
    $(`#cell-${checker.row}-${checker.cell}`).html(
      makeChecker(i,emptyspace)
    );}
}
function endGame(){
  if(isWhitePlyerWin()&&isblackPlyerWin()){alert("the game is tie");clearBorad();}
  if( isWhitePlyerWin()){ alert("white win"); clearBorad();}
  if( isblackPlyerWin()){alert("black win");clearBorad();}
}


function makeChecker(i, color) {
  return `<div class="checker ${color}-checker" id=${i}"></div>`;
}
function initKing(i, color) {
  return `<div class="checker ${color}" id=${i}"></div>`;
}
function isKing(targetId) {
  if (checkers[targetId].row === 1 && checkers[targetId].color === "black") {
    checkers[targetId].color = "black-king";
    checkers[targetId].king = true;
    return true;
  }
  if (checkers[targetId].row === 8 && checkers[targetId].color === "white") {
    checkers[targetId].color = "white-king";
    checkers[targetId].king = true;
    return true;
  } else return false;
}

function selectChecker() {
  $(`.pressed`).removeClass(`pressed`);
  $(`.checker`).unbind("click");
  endGame();
  $(".turn-" + activplayer).addClass("active");
  checker = $(this);
  var checkerIndex = checker.attr("id");
  var num = parseInt(checkerIndex);
  console.log(`checkerIndex == `, num);
  haveToEat = false;

  selectedChecker = checkers[num];
  current = num;
  if (selectedChecker.color === "") {
    alert("choose again");
    $(".checker").click(selectChecker);
  } else if ((selectedChecker.color === "black"||selectedChecker.color === "black-king") && activplayer === 0) {
    console.log("white turn");
    $(".checker").click(selectChecker);
  } else if ((selectedChecker.color === "white"||selectedChecker.color === "white-king") && activplayer === 1) {
    console.log("black turn");
    $(".checker").click(selectChecker);
  } else {
    if (allCheckersInPoitionToEat(activplayer) === -1) {
      checker.addClass(`pressed`);
      $(".checker").click(moveSelectedCheckerHere);
    } else if (allCheckersInPoitionToEat(activplayer) !== -1) {
      for (var i = 0; i < allCheckersInPoitionToEat(activplayer).length; i++) {
        var num1 = allCheckersInPoitionToEat(activplayer)[i];
        if (current === num1) {
          haveToEat = true;
          checker.addClass(`pressed`);
          $(".checker").click(moveSelectedCheckerHere);
        }
      }
      $(".checker").click(selectChecker);
    }
  }
}

function moveSelectedCheckerHere() {

  target = $(this);
  var targetIndex = target.attr("id");
  var targetId = parseInt(targetIndex);
  console.log(targetId);
  if (checkers[targetId].color === checkers[current].color) {
   $(".turn-" + activplayer).addClass("active");
    $(`.pressed`).removeClass(`pressed`);
    target.addClass("pressed");
    current = targetId;
    $(".checker").click(moveSelectedCheckerHere);
  }
 
  else if (isLegitimatePlay(current, targetId) && !haveToEat) {
    hendelMove(current,targetId);
    isKing(targetId);
    initCheckers();
    changeTurn(targetId);

  } else if (killMove(current,targetId)!==current&&killMove(current,targetId)!==0) {
    hendelKill(killMove(current, targetId))
    hendelMove(current,targetId);
    var weHaveKing= isKing(targetId);
    initCheckers();
   
       if(weHaveKing){
       changeTurn(targetId);}
     else if (killMove(targetId)===targetId) {
      checkers[targetId].color === "black"||(checkers[targetId].color==="black-king")
        ? (activplayer = 1)
        : (activplayer = 0);
      $(".turn-" + activplayer).addClass("active");
      $(".checker").click(selectChecker);
       } else {
    changeTurn(targetId); }
  } else {
    $(".turn-" + activplayer).addClass("active");
    $(".checker").click(selectChecker);
  }
}



function hendelMove(current,targetId){
 if(checkers[current].king === true){
        checkers[current].king = false;
        checkers[targetId].king = true;
          }
    checkers[targetId].color = checkers[current].color;
    checkers[current].color = "";
}

function changeTurn(targetId){
  $(".turn-" + activplayer).removeClass("active");
  checkers[targetId].color === "black"||(checkers[targetId].color==="black-king")
  ? (activplayer = 0)
  : (activplayer = 1);
$(".turn-" + activplayer).addClass("active");
$(".checker").click(selectChecker);
}

function isLegitimatePlay(current, target) {
  var currentRow = checkers[current].row;
  var currentCell = checkers[current].cell;
  var currentColor = checkers[current].color;
  var targetRow = checkers[target].row;
  var targetCell = checkers[target].cell;
  var targetColor = checkers[target].color;
  if (
    (currentColor === "white" && targetColor === "") ||
    checkers[current].king === true
  ) {
    if (
      currentRow + 1 === targetRow &&
      (currentCell + 1 === targetCell || currentCell - 1 === targetCell)
    ) {
        
      return true;
    }
  }
  if (
    (currentColor === "black" && targetColor === "") ||
    checkers[current].king === true
  ) {
    if (
      currentRow - 1 === targetRow &&
      (currentCell + 1 === targetCell || currentCell - 1 === targetCell)
    ) {
        
      return true;
    }
  }
}
function killMove(current,target) {
 var king=checkers[current].king
  var currentRow = checkers[current].row;
  var currentCell = checkers[current].cell;
  var currentColor = checkers[current].color;
  if (checkers[current].color === "white"||currentColor==="white-king") {
    if (currentRow % 2 == 1 && currentRow < 7) {
      if (current % 4 === 0) {
          
        if (
          checkers[current + 9].color === "" &&(checkers[current + 5].color === "black"|| checkers[current + 5].color === "black-king")
        ) {
          if(target===current+9){
          return current+5;
          }
          return current;
        }
      } else if (current % 4 === 1 || current % 4 === 2) {
        if (
          (checkers[current + 7].color === "" && (checkers[current + 4].color === "black"|| checkers[current + 4].color === "black-king")) ||
          (checkers[current + 9].color === "" &&(checkers[current + 5].color === "black"|| checkers[current + 5].color === "black-king"))
        ) {
          if(target===current+9){
            return current+5;
            }
            else if(target===current+7){
             return current+4;
            }
            return current;
        }
      } else if (current % 4 === 3) {
        if (
          checkers[current + 7].color === "" && (checkers[current + 4].color === "black"|| checkers[current + 4].color === "black-king")
        ) {
          if(target===current+7){
            return current+4;
            }
            return current;
        }
      }
    } else if (currentRow % 2 == 0 && currentRow < 7) {
      if (current % 4 === 0) {
        if (
          checkers[current + 9].color === "" && (checkers[current + 4].color === "black"|| checkers[current + 4].color === "black-king")
        ) {
          if(target===current+9){
            return current+4;
            }
            return current;
        }
      } else if (current % 4 === 1 || current % 4 === 2) {
        if (
          (checkers[current + 7].color === "" &&(checkers[current + 3].color === "black"|| checkers[current + 3].color === "black-king")) ||
          (checkers[current + 9].color === "" && (checkers[current + 4].color === "black"|| checkers[current + 4].color === "black-king"))
        ) {
          if(target===current+7){
            return current+3;
            }
            else if(target===current+9){
              return current+4;
            }
            return current;
        }
      } else if (current % 4 === 3) {
        if (
          checkers[current + 7].color === "" && (checkers[current + 3].color === "black"|| checkers[current + 3].color === "black-king")
        ) {
          if(target===current+7){
            return current+3;
            }
            return current;
        }
      }
    }
  }
  else if(currentColor==="black-king"){
    if (currentRow % 2 == 1 && currentRow < 7) {
        if (current % 4 === 0) {
            
          if (
            checkers[current + 9].color === "" &&(checkers[current + 5].color === "white"|| checkers[current + 5].color === "white-king")
          ) {
            if(target===current+9){
              return current+5;
              }
              return current;
          }
        } else if (current % 4 === 1 || current % 4 === 2) {
          if (
            (checkers[current + 7].color === "" &&(checkers[current + 4].color === "white"|| checkers[current + 4].color === "white-king")) ||
            (checkers[current + 9].color === "" &&(checkers[current + 5].color === "white"|| checkers[current + 5].color === "white-king"))
          ) {
            if(target===current+7){
              return current+4;
              }
              else if(target===current+9){
                return current+5;
              }
              return current;
          }
        } else if (current % 4 === 3) {
          if (
            checkers[current + 7].color === "" &&(checkers[current + 4].color === "white"|| checkers[current + 4].color === "white-king")
          ) {
            if(target===current+7){
              return current+4;
              }
              return current;
          }
        }
      } else if (currentRow % 2 == 0 && currentRow < 7) {
        if (current % 4 === 0) {
          if (
            checkers[current + 9].color === "" &&(checkers[current + 4].color === "white"|| checkers[current + 4].color === "white-king")
          ) {
            if(target===current+9){
              return current+4;
              }
              return current;
          }
        } else if (current % 4 === 1 || current % 4 === 2) {
          if (
            (checkers[current + 7].color === "" &&(checkers[current + 3].color === "white"|| checkers[current + 3].color === "white-king")) ||
            (checkers[current + 9].color === "" &&(checkers[current + 4].color === "white"|| checkers[current + 4].color === "white-king"))
          ) {
            if(target===current+7){
              return current+3;
              }
              else if(target===current+9){ return current+4; }
              return current;
          }
        } else if (current % 4 === 3) {
          if (
            checkers[current + 7].color === "" &&(checkers[current + 3].color === "white"|| checkers[current + 3].color === "white-king")
          ) {
            if(target===current+7){
              return current+3;
              }
              return current;
          }
        }
      } 
  }
  if(currentColor==="white-king"){
    if (currentRow % 2 == 1 && currentRow > 2) {
        if (current % 4 === 0) {
          if (
            checkers[current - 7].color === "" &&(checkers[current - 3].color === "black"|| checkers[current - 3].color ==="black-king")
          ) {
            if(target===current-7){
              return current-3;
              }
              return current;
          }
        } else if (current % 4 === 1 || current % 4 === 2) {
          if (
            (checkers[current - 7].color === "" &&(checkers[current - 3].color === "black"|| checkers[current - 3].color ==="black-king")) ||
            (checkers[current - 9].color === "" &&(checkers[current - 4].color === "black"|| checkers[current - 4].color ==="black-king"))
          ) {
            if(target===current-7){
              return current-3;
              }
              else if(target===current-9){
                return current-4;
              }
              return current;
          }
        } else if (current % 4 === 3) {
          if (
            checkers[current - 9].color === "" &&(checkers[current - 4].color === "black"|| checkers[current - 4].color ==="black-king")
          ) {
            if(target===current-9){
              return current-4;
              }
              return current;
          }
        }
      } else if (currentRow % 2 == 0 && currentRow > 2) {
        if (current % 4 === 0) {
          if (
            checkers[current - 7].color === "" &&(checkers[current - 4].color === "black"|| checkers[current - 4].color ==="black-king")
          ) {
            if(target===current-7){
              return current-4;
              }
              return current;
          }
        } else if (current % 4 === 1 || current % 4 === 2) {
          if (
            (checkers[current - 7].color === "" &&(checkers[current - 4].color === "black"|| checkers[current - 4].color ==="black-king")) || 
            (checkers[current - 9].color === "" &&(checkers[current - 5].color === "black"|| checkers[current - 5].color ==="black-king"))
          ) {
            if(target===current-7){
              return current-4;
              }
              else if(target===current-9){
                return current-5;
              }
              return current;
          }
        } else if (current % 4 === 3) {
          if (
            checkers[current - 9].color === "" &&(checkers[current - 5].color === "black"|| checkers[current - 5].color ==="black-king")
          ) {
            if(target===current-9){
              return current-5;
              }
              return current;
          }
        }
      }
  }
 else if (checkers[current].color === "black"||checkers[current].color ==="black-king") {
    if (currentRow % 2 == 1 && currentRow > 2) {
      if (current % 4 === 0) {
        if (
          checkers[current - 7].color === "" &&(checkers[current - 3].color === "white"|| checkers[current - 3].color ==="white-king")
        ) {
          if(target===current-7){
            return current-3;
            }
            return current;
        }
      } else if (current % 4 === 1 || current % 4 === 2) {
        if (
          (checkers[current - 7].color === "" &&(checkers[current - 3].color === "white"|| checkers[current - 3].color ==="white-king")) ||
          (checkers[current - 9].color === "" &&(checkers[current - 4].color === "white"|| checkers[current - 4].color ==="white-king"))
        ) {
          if(target===current-7){
            return current-3;
            }
            else if(target===current-9){
              return current-4;
            }
            return current;
        }
      } else if (current % 4 === 3) {
        if (
          checkers[current - 9].color === "" &&(checkers[current - 4].color === "white"|| checkers[current - 4].color ==="white-king")
        ) {
          if(target===current-9){
            return current-4;
            }
            return current;
        }
      }
    } else if (currentRow % 2 == 0 && currentRow > 2) {
      if (current % 4 === 0) {
        if (
          checkers[current - 7].color === "" &&(checkers[current - 4].color === "white"|| checkers[current - 4].color ==="white-king")
        ) {
          if(target===current-7){
            return current-4;
            }
            return current;
        }
      } else if (current % 4 === 1 || current % 4 === 2) {
        if (
          (checkers[current - 7].color === "" &&(checkers[current - 4].color === "white"|| checkers[current - 4].color ==="white-king")) ||
          (checkers[current - 9].color === "" &&(checkers[current - 5].color === "white"|| checkers[current - 5].color ==="white-king"))
        ) {
          if(target===current-7){
            return current-4;
            }
            else if(target===current-9){
              return current-5;
            }
            return current;
        }
      } else if (current % 4 === 3) {
        if (
          checkers[current - 9].color === "" &&(checkers[current - 5].color === "white"|| checkers[current - 5].color ==="white-king")
        ) {
          if(target===current-9){
            return current-5;
            }
            return current;
        }
      }
      return 0;
    }
  }
 
}

function hendelKill(deadChecker) {
 
 if(checkers[deadChecker].color === "black"||checkers[deadChecker].color ==="black-king")
  {
    $("#" + blackDeadCheckerIndex).html(
      `<div class="checker black-checker"></div>`
    );
    checkers[deadChecker].color = "";
    blackDeadCheckerIndex++;
    ischekerattak = true;
    return true;
  }
 else if(checkers[deadChecker].color === "white"||checkers[deadChecker].color ==="white-king")
  {
    $("#" + whiteDeadCheckerIndex).html(
      `<div class="checker white-checker"></div>`
    );
    checkers[deadChecker].color = "";
    whiteDeadCheckerIndex++;
    ischekerattak = true;
    return true;
  }
}

var allCheckersInPoitionToEat = function (activplayer) {
  var count = 0;
  var index = [];
  if (activplayer === 0) {
    for (var i = 0; i < checkers.length; i++) {
      if (checkers[i].color === "white"||checkers[i].color === "white-king") {
        if (killMove(i,i+1)) {
          index.push(i);
          count++;
        }
      }
    }
    if (count === 0) {
      return -1;
    } else {
      return index;
    }
  } else if (activplayer === 1) {
    for (var i = 0; i < checkers.length; i++) {
      if (checkers[i].color === "black"||checkers[i].color ==="black-king") {
        if (killMove(i)) {
          index.push(i);
          count++;
        }
      }
    }
    if (count === 0) {
      return -1;
    } else {
      return index;
    }
  }
};



function isWhitePlyerWin(){

  for(var i=0;i<checkers.length;i++){
    if (checkers[i].color === "black"||checkers[i].color ==="black-king"){
      var blackCheker=i;
      for(var j=0;j<checkers.length;j++){
        if(checkers[j].color===''){
          var blackTarget=j;
          if(isLegitimatePlay(blackCheker,blackTarget)){
            return false;
          }
          else if(killMove(blackCheker,blackTarget)===blackCheker){
            return false;
          }
        }
       
      }
    }
  }
  return true;
}
function isblackPlyerWin(){

  for(var i=0;i<checkers.length;i++){
    if (checkers[i].color === "white"||checkers[i].color ==="white-king"){
      var whiteCheker=i;
      for(var j=0;j<checkers.length;j++){
        if(checkers[j].color===''){
          var whiteTarget=j;
          if(isLegitimatePlay(whiteCheker,whiteTarget)){
            return false;
          }
          else if(killMove(whiteCheker,whiteTarget)===whiteCheker){
            return false;
          }
        }
       
      }
    }
  }
  return true;
}
