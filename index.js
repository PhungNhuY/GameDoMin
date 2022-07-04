let row = 9;
let col = 9;
let boom = 10;
let size = 30;
let flag = 0;
let arr = new Array();


function changeLevel(obj) {
    let value = obj.value;
    if (value == 1) {
        row = 9;
        col = 9;
        boom = 10;
        size = 30;
    } else if (value == 2) {
        row = 16;
        col = 16;
        boom = 40;
        size = 30;
    } else {
        row = 16;
        col = 30;
        boom = 99;
        size = 30;
    }
    arr = new Array();
    for (let i = 0; i < row; i++) {
        let temp = new Array();
        for (let j = 0; j < col; j++) {
            temp.push(1);
        }
        arr.push(temp);
    }
    genGame(row, col, boom, size);
}


//return an integer number from min to max
function ranInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showAllBooms(){
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            if(arr[i][j].isBoom==true)
                document.getElementById("sq_" + i + "_" + j).style.backgroundColor = "red";
        }
    }
}

function checkWin(){
    let check = true;
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            if(arr[i][j].isBoom==true && arr[i][j].flagged!=true)
                check = false;
            if(arr[i][j].isBoom==false && arr[i][j].opened==false)
                check = false;
        }
    }
    if(check==true){
        setTimeout(function(){
            alert("you win!!!");
            genGame(row, col, boom, size);
        },50);
    }
}

function openSquare(i, j) {
    if (arr[i][j].opened == false) {
        let square = document.getElementById("sq_" + i + "_" + j);
        square.style.backgroundColor = "#999";
        arr[i][j].opened = true;
        checkWin();
        if (arr[i][j].isBoom) {
            showAllBooms();
            setTimeout(function(){
                alert("loserrrrrrr!!!!!!!!!!!!!");
                genGame(row, col, boom, size);
            },50);
        } else {
            if (arr[i][j].numBoom == 0) {
                //DFS
                //top
                if (i - 1 >= 0) {
                    //left
                    if (j - 1 >= 0)
                        openSquare(i-1, j-1);
                    //center
                    openSquare(i-1, j);
                    //right
                    if (j + 1 < col)
                        openSquare(i-1, j+1);
                }
                //middle
                if (j - 1 >= 0)
                    openSquare(i, j-1);
                if (j + 1 < col)
                    openSquare(i, j+1);
                //bottom
                if (i + 1 < row) {
                    //left
                    if (j - 1 >= 0)
                        openSquare(i+1, j-1);
                    //center
                        openSquare(i+1, j);
                    //right
                    if (j + 1 < col)
                        openSquare(i+1, j+1);
                }
            } else {
                square.innerText = arr[i][j].numBoom;
            }
        }
    }
}

function changeFlag(i, j) {
    if (arr[i][j].opened == false) {
        let square = document.getElementById("sq_" + i + "_" + j);
        if (arr[i][j].flagged == false) {
            square.style.backgroundColor = "green";
            arr[i][j].flagged = true;
            flag++;
        } else {
            square.style.backgroundColor = "black";
            arr[i][j].flagged = false;
            flag--;
        }
        document.getElementById('flag').innerText = flag;
        checkWin();
    }
}



//--------------main function--------------------
function genGame(row, col, boom, size) {
    let inGame = document.getElementById("inGame");

    //delete old game
    inGame.innerHTML = "";
    flag = 0;

    //gen new arr
    arr = new Array();
    for (let i = 0; i < row; i++) {
        let temp = new Array();
        for (let j = 0; j < col; j++) {
            let this_square = new Object();
            this_square.flagged = false;
            this_square.opened = false;
            this_square.numBoom = 0;
            this_square.isBoom = false;
            temp.push(this_square);
        }
        arr.push(temp);
    }

    // random boom
    for (let num = 0; num < boom; num++) {
        let i;
        let j;
        do {
            i = ranInt(0, row - 1);
            j = ranInt(0, col - 1);
        } while (arr[i][j].isBoom == true);
        arr[i][j].isBoom = true;
    }

    //count boom
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            //top
            if (i - 1 >= 0) {
                //left
                if (j - 1 >= 0)
                    if (arr[i - 1][j - 1].isBoom == true)
                        arr[i][j].numBoom++;
                //center
                if (arr[i - 1][j].isBoom == true)
                    arr[i][j].numBoom++;
                //right
                if (j + 1 < col)
                    if (arr[i - 1][j + 1].isBoom == true)
                        arr[i][j].numBoom++;
            }
            //middle
            if (j - 1 >= 0)
                if (arr[i][j - 1].isBoom == true)
                    arr[i][j].numBoom++;
            if (j + 1 < col)
                if (arr[i][j + 1].isBoom == true)
                    arr[i][j].numBoom++;
            //bottom
            if (i + 1 < row) {
                //left
                if (j - 1 >= 0)
                    if (arr[i + 1][j - 1].isBoom == true)
                        arr[i][j].numBoom++;
                //center
                if (arr[i + 1][j].isBoom == true)
                    arr[i][j].numBoom++;
                //right
                if (j + 1 < col)
                    if (arr[i + 1][j + 1].isBoom == true)
                        arr[i][j].numBoom++;
            }
        }
    }

    //gen new squares
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            let square = document.createElement('div');
            square.setAttribute("class", "square");
            square.setAttribute("id", "sq_" + i + "_" + j);
            square.setAttribute("onclick", "openSquare(" + i + ", " + j + ")");
            square.setAttribute("oncontextmenu", "changeFlag(" + i + ", " + j + ")");
            square.style.width = size + "px";
            square.style.height = size + "px";
            square.style.lineHeight = size + "px";
            inGame.appendChild(square);
        }
        let br = document.createElement('br');
        inGame.appendChild(br);
    }
    document.getElementById("flag").innerText = 0;
    document.getElementById("boom").innerText = boom;
}


//main
genGame(row, col, boom, size);