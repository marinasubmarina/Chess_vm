$(document).ready(function(){
    CreateBoard(8);
    CreateChess();
    $('.block').on('click',function(){
        if ($(this).attr('color')==currentTeam.current){
            SelectCell($(this));
            if ($selectedCell.attr('type')=='pawn'){
                if (currentTeam.current == "white") {
                    PawnStep(-1, 1, 6 , -1);
                    PawnStep(-1, -1, 6, -1);
                }else{
                    PawnStep(1, 1 , 1 , 8);
                    PawnStep(1, -1, 1 , 8);
                    }
            }
            if ($selectedCell.attr('type')=='Rook'){
                RookBishopStep(-1,0,-1); //вверх В не важно
                RookBishopStep(1,0,8); //вниз В не важно
                RookBishopStep(0,1,8,8); //вправо А не важно
                RookBishopStep(0,-1,8,-1);//влево А не важно
            }
            if ($selectedCell.attr('type')=='Bishop'){
                RookBishopStep(-1,1,-1,8); //вверх-вправо
                RookBishopStep(-1,-1,-1,-1); //вверх-влево
                RookBishopStep(1,1,8,8); //вниз-вправо
                RookBishopStep(1,-1,8,-1);//вниз-влево
            }
            if ($selectedCell.attr('type')=='Queen'){
                RookBishopStep(-1,0,-1); //вверх В не важно
                RookBishopStep(1,0,8); //вниз В не важно
                RookBishopStep(0,1,8,8); //вправо А не важно
                RookBishopStep(0,-1,8,-1);//влево А не важно
                RookBishopStep(-1,1,-1,8); //вверх-вправо
                RookBishopStep(-1,-1,-1,-1); //вверх-влево
                RookBishopStep(1,1,8,8); //вниз-вправо
                RookBishopStep(1,-1,8,-1);//вниз-влево
            }
            if ($selectedCell.attr('type')=='Knight'){
                KnightKingStep(-2, -1);
                KnightKingStep(-2, 1);
                KnightKingStep(2, 1);
                KnightKingStep(2, -1);
                KnightKingStep(-1, 2);
                KnightKingStep(1, 2);
                KnightKingStep(-1, -2);
                KnightKingStep(1, -2);
            }
            if ($selectedCell.attr('type')=='King'){
                KnightKingStep(-1, -1);
                KnightKingStep(-1, 0);
                KnightKingStep(-1, 1);
                KnightKingStep(1, -1);
                KnightKingStep(1, 0);
                KnightKingStep(1, 1);
                KnightKingStep(0, -1);
                KnightKingStep(0, 1);
            }
        }
        else{
            if ($selectedCell != null){
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
var currentTeam = {
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
function MakeMove(_targetcCell) {
    if (_targetcCell.hasClass('allowedStep')) {
        // Превращение пешки
        if (($selectedCell.attr('type') == 'pawn')&&((_targetcCell.attr('x') == 7) || (_targetcCell.attr('x')) == 0)) {
            var cell = _targetcCell;
            $("#dialog").dialog({
                title: "Превращение пешки",
                modal: true,
                buttons: {
                    "Применить": function () {
                        $(this).dialog("close");
                        var newType = $('#dialog input:radio:checked').val();
                        cell.attr('color', $selectedCell.attr('color')).attr('type', newType );
                        if (cell.attr('color')== 'white') {
                            if (newType == 'Rook') {
                                cell[0].innerText = '♖';
                            }else if (newType == 'Bishop') {
                                cell[0].innerText = '♗';
                            }else if (newType == 'Queen') {
                                cell[0].innerText = '♕';
                            }else if (newType == 'Knight') {
                                cell[0].innerText = '♘';
                            }else if (newType == 'pawn'){
                                cell[0].innerText = $selectedCell[0].innerText;
                            }
                        }else{
                            if (newType == 'Rook') {
                                cell[0].innerText = '♜';
                            }else if (newType == 'Bishop') {
                                cell[0].innerText = '♝';
                            }else if (newType == 'Queen') {
                                cell[0].innerText = '♛';
                            }else if (newType == 'Knight') {
                                cell[0].innerText = '♞';
                            }else if (newType == 'pawn'){
                                cell[0].innerText = $selectedCell[0].innerText;
                            }
                        }
                        Move();
                    }
                }
            })
        }else {
            _targetсCell.attr('color', $selectedCell.attr('color')).attr('type', $selectedCell.attr('type'))
            _targetcCell[0].innerText = $selectedCell[0].innerText;
            Move();
        }
    }
}
function Move(){
    $selectedCell.removeAttr('color').removeAttr('type');
    $selectedCell[0].innerText = '';
    $selectedCell.toggleClass('selected');
    $selectedCell = null;
    ChangeTeam();
    DropAllowedStep();
}
function DropAllowedStep(){
    $('div').removeClass('allowedStep').removeClass('attack');
}
//Ходы шахмат:
//пешки
function PawnStep(i,j,a,b) {
    if ($selectedCell.attr('x') == a) {
        if (IsCellEmpty($('[x=' + ($selectedCell.attr('x') - (-2 * i)) + ']' + '[y=' + $selectedCell.attr('y') + ']'))) {
            $('[x=' + ($selectedCell.attr('x') -(- 2 * i)) + ']' + '[y=' + $selectedCell.attr('y') + ']').addClass('allowedStep');
        }
    }
    if ( ( ($selectedCell.attr('x') - (-i)) != b ) && (IsCellEmpty($('[x=' + ($selectedCell.attr('x') - (-i)) + ']' + '[y=' + $selectedCell.attr('y') + ']')))){
        $('[x=' + ($selectedCell.attr('x') - (-i)) + ']' + '[y=' + $selectedCell.attr('y') + ']').addClass('allowedStep');
    }
    if ( $('[x=' + ($selectedCell.attr('x') - (-i)) + ']' + '[y=' + ($selectedCell.attr('y')- (-j)) + ']').attr('color')==currentTeam.enemy) {
        $('[x=' + ($selectedCell.attr('x') - (-i)) + ']' + '[y=' + ($selectedCell.attr('y') - (-j)) + ']').addClass('allowedStep').addClass('attack');
    }
}
//ладьи и слоны
function RookBishopStep(i,j,a,b) {
    while ((($selectedCell.attr('x') - (-i)) != a)&& (($selectedCell.attr('y') - (-j)) != b) && (IsCellEmpty('[x=' + ($selectedCell.attr('x') - (-i)) + ']' + '[y=' + ($selectedCell.attr('y') - (-j)) + ']'))) {
        ($('[x=' + ($selectedCell.attr('x') - (-i)) + ']' + '[y=' + ($selectedCell.attr('y') - (-j)) + ']')).addClass('allowedStep');
        if (i < 0){ i--;}
        if (i > 0){ i++;}
        if (j < 0){ j--;}
        if (j > 0){ j++;}
    } //attack
    if ((($selectedCell.attr('x') - (-i))!=a)&&(($selectedCell.attr('y') - (-j))!=b)&&(IsCellEmpty(('[x=' + ($selectedCell.attr('x') - (-i)) + ']' + '[y=' + ($selectedCell.attr('y') - (-j)) + ']'))==false)&&(($('[x=' + ($selectedCell.attr('x') - (-i)) + ']' + '[y=' + ($selectedCell.attr('y') - (-j)) + ']')).attr('color')==currentTeam.enemy)){
        ($('[x=' + ($selectedCell.attr('x') - (-i)) + ']' + '[y=' + ($selectedCell.attr('y') - (-j)) + ']')).addClass('attack').addClass('allowedStep');
    }
 }
//кони и короли
function KnightKingStep(i,j){
    var X = ($selectedCell.attr('x') - (-i));
    var Y = ($selectedCell.attr('y') - (-j));
    var target = ($('[x=' + X + ']' + '[y=' + Y + ']'));

    if ((X > -1) && (X < 8) && (Y > -1) && (Y < 8) && (IsCellEmpty('[x=' + X + ']' + '[y=' + Y + ']'))) {
            target.addClass('allowedStep');
    } else { //attack
        if (target.attr('color') == currentTeam.enemy) {
            target.addClass('allowedStep').addClass('attack');
            }
    }
}