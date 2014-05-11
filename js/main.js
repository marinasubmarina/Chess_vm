/**
 * Created by Victor on 10.05.2014.
 */
$(document).ready(function(){
    CreateBoard(8);
    CreateChess();

    $('.block').on('click',function(){
        if ($(this).attr('color')==currentTeam.current){
            SelectCell($(this));
            if ($selectedCell.attr('type')=='pawn'){
                PawnStep();
            }
        }
        else{
            if ($selectedCell != null){
                console.log($(this));
                MakeMove($(this));
            }

        }
    })
})
function CreateBoard(_boardCount){
    var board = $('#board');
    for (var i = 0; i < _boardCount; i++) {
        for (var j = 0; j < _boardCount; j++) {
            if ((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0)) {
                board.append ($('<div class="lightsquare block"> </div>').attr("x",i).attr("y",j));
            } else {
                board.append ($('<div class="darksquare block"> </div>').attr("x",i).attr("y",j));
            }
        }
    }
}
//создаем шахматы
function CreateChess(){
    var cell = $('.block');
    //нумеруем ячейки
    for (var i=0; i<cell.length; i++){
        cell.eq(i).attr('id',i);
    }
    //добавляем шахматы на доску
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            //пешки
            if (i == 1) {
                AddFugure(i,j, '♟','black','pawn');

            } else if (i == 6) {
                AddFugure (i,j, '♙','white','pawn');
            }
            //первый ряд черных
            if (i == 0){
                if (j == 0 || j == 7)  {
                    AddFugure(i,j, '♜','black','Rook');
                }
                else if (j == 1 || j == 6) {
                    AddFugure(i,j,'♞','black','Knight');
                }
                else if (j == 2 || j == 5) {
                    AddFugure (i, j, '♝','black','Bishop');
                }
                else if (j == 3) {
                    AddFugure (i, j, '♛','black','Queen');
                } else if (j == 4) {
                    AddFugure(i,j,'♚','black','King');
                }
            }
            //ряд белых
            if (i == 7){
                if (j == 0 || j == 7)  {
                    AddFugure(i,j, '♖','white','Rook');
                }
                else if (j == 1 || j == 6) {
                    AddFugure(i,j,'♘','white','Knight');
                }
                else if (j == 2 || j == 5) {
                    AddFugure (i, j, '♗','white','Bishop');
                }
                else if (j == 3) {
                    AddFugure (i, j, '♕','white','Queen');
                } else if (j == 4) {
                    AddFugure(i,j,'♔','white','King');
                }
            }
        }
    }
}
//вставка по координатам рисунка(ну вообще чего угодно)
function AddFugure (x,y,_figureType,_color,_type) {
    $('[x='+x+']'+'[y='+y+']').append(_figureType);
    $('[x='+x+']'+'[y='+y+']').attr('type',_type).attr('color',_color);


}

function IsCellEmpty(cell){
    if ($(cell)[0].innerText =='') {
        return true;
    }
    else{
        return false;
    }
}

function DrawMap(){
    for (var i = 0; i < 8; i++) {
        var line = [];
        for (var j = 0; j < 8; j++) {

            if (IsCellEmpty(($('[x='+i+']'+'[y='+j+']'))) == true){
                line[j]=0;
            }
            else{
                line[j]=1;
            }
        }
        PrintMassive(line);
    }
}

function PrintMassive(_array){
    var result='';
    for (var  i=0; i<_array.length; i++){
      result += _array[i] + ' ';
    }
    console.log(result);
}


var currentTeam = {
    white : 'white',
    black : 'black',
    current : 'white',
    enemy:  'black'
}
function ChangeTeam(){
    if (currentTeam.current == 'white') {
        currentTeam.current='black';
        currentTeam.enemy='white';
    }
    else   {
        currentTeam.current='white';
        currentTeam.enemy='black';
    }
}

var $selectedCell;
var is_selected=false;

function SelectCell(cell){
    is_selected = true;
    DropAllowedStep();
    if( $selectedCell !=null){
        $selectedCell.toggleClass('selected');
    }
    $selectedCell = cell;
    cell.toggleClass('selected');
}
function MakeMove(_targetcCell){
    if (_targetcCell.hasClass('allowedStep')) {
        _targetcCell.attr('color', $selectedCell.attr('color')).attr('type', $selectedCell.attr('type'))
        _targetcCell[0].innerText = $selectedCell[0].innerText;
        $selectedCell.removeAttr('color').removeAttr('type');
        $selectedCell[0].innerText = '';
        $selectedCell.toggleClass('selected');
        $selectedCell = null;
        if (_targetcCell.hasClass('attack')){
           console.log('tadadadada'); //  НЕЕЕ ОСТАВЛЯЯЯТЬ В ПРОГЕ, А ТО СТРАННО
        }
        else {
            ChangeTeam();
        }
        DropAllowedStep();
    }
}
function DropAllowedStep(){
    $('div').removeClass('allowedStep').removeClass('attack');
}
//Ходы шахмат:

//пешки
function PawnStep(){
    if ($selectedCell.attr('color') == 'white') {
        if ($selectedCell.attr('x') == 6) {
            $('[x=' + ($selectedCell.attr('x') - 2) + ']' + '[y=' + $selectedCell.attr('y') + ']').addClass('allowedStep');
        }
        // проверка. чтобы не выделял занятые клетки как возможность хода.
        if ($('[x=' + ($selectedCell.attr('x') - 1) + ']' + '[y=' + $selectedCell.attr('y') + ']')[0].innerText == ''){
            $('[x=' + ($selectedCell.attr('x') - 1) + ']' + '[y=' + $selectedCell.attr('y') + ']').addClass('allowedStep');
        }

        //левая диагональ   \.
        if ( $('[x=' + ($selectedCell.attr('x') - 1) + ']' + '[y=' + ($selectedCell.attr('y')-1) + ']').attr('color')=='black') {
            $('[x=' + ($selectedCell.attr('x') - 1) + ']' + '[y=' + ($selectedCell.attr('y') - 1) + ']').addClass('allowedStep').addClass('attack');
        }
        //правая диагональ ./
        if ( $('[x=' + ($selectedCell.attr('x') - 1) + ']' + '[y=' + ($selectedCell.attr('y')-(-1)) + ']').attr('color')=='black') {
            $('[x=' + ($selectedCell.attr('x') - 1) + ']' + '[y=' + ($selectedCell.attr('y') - (-1)) + ']').addClass('allowedStep').addClass('attack');
        }
    }
    if($selectedCell.attr('color') == 'black') {
        console.log($selectedCell); // ТОЖЕ УДАЛИТЬ ПОТОООООООМММ!!!!!!1
        if ($selectedCell.attr('x') == 1) {
            $('[x=' +($selectedCell.attr('x')-(-2))+ ']' + '[y=' + $selectedCell.attr('y') + ']').addClass('allowedStep');
        }
        // проверка. чтобы не выделял занятые клетки как возможность хода.
        if ($('[x=' + ($selectedCell.attr('x') - (-1)) + ']' + '[y=' + $selectedCell.attr('y') + ']')[0].innerText == '') {
            $('[x=' + ($selectedCell.attr('x') - (-1)) + ']' + '[y=' + $selectedCell.attr('y') + ']').addClass('allowedStep');
        }
        // влево вниз  /'
        if ( $('[x=' + ($selectedCell.attr('x') - (-1)) + ']' + '[y=' + ($selectedCell.attr('y')-1) + ']').attr('color')=='white') {
            $('[x=' + ($selectedCell.attr('x') - (-1)) + ']' + '[y=' + ($selectedCell.attr('y') - 1) + ']').addClass('allowedStep').addClass('attack');
        }

        // вправо вниз '\
        if ( $('[x=' + ($selectedCell.attr('x') - (- 1)) + ']' + '[y=' + ($selectedCell.attr('y')-(-1)) + ']').attr('color')=='white') {
            $('[x=' + ($selectedCell.attr('x') - (-1)) + ']' + '[y=' + ($selectedCell.attr('y') - (-1)) + ']').addClass('allowedStep').addClass('attack');
        }
    }
}