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
            if ($selectedCell.attr('type')=='Rook'){
                RookStep();
            }
            if ($selectedCell.attr('type')=='Bishop'){
                BishopStep();
            }
            if ($selectedCell.attr('type')=='Queen'){
                BishopStep();
                RookStep();
            }
            if ($selectedCell.attr('type')=='Knight'){
                KnightStep();
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
            if ($('[x=' + ($selectedCell.attr('x') - 2) + ']' + '[y=' + $selectedCell.attr('y') + ']')[0].innerText == ''){
            $('[x=' + ($selectedCell.attr('x') - 2) + ']' + '[y=' + $selectedCell.attr('y') + ']').addClass('allowedStep');
            }
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
        if ($selectedCell.attr('x') == 1) {
            if ($('[x=' +($selectedCell.attr('x')-(-2))+ ']' + '[y=' + $selectedCell.attr('y') + ']')[0].innerText == '') {
            $('[x=' +($selectedCell.attr('x')-(-2))+ ']' + '[y=' + $selectedCell.attr('y') + ']').addClass('allowedStep');
            }
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
//ладьи
function RookStep(){
    // по вертикали
    // вверх (for white)
    var i =1;
    if ($selectedCell.attr('x') !=0) {
        while ((($selectedCell.attr('x') - i)!=-1)&&(IsCellEmpty(('[x=' + ($selectedCell.attr('x') - i) + ']' + '[y=' + $selectedCell.attr('y') + ']')))) {
            $('[x=' + ($selectedCell.attr('x') - i) + ']' + '[y=' + $selectedCell.attr('y') + ']').addClass('allowedStep');
            i++;
        }
        // attack (not end of board + not empty + enemy)
        if ((($selectedCell.attr('x') - i)!=-1)&&(IsCellEmpty(('[x=' + ($selectedCell.attr('x') - i) + ']' + '[y=' + $selectedCell.attr('y') + ']'))==false)&&(($('[x=' + ($selectedCell.attr('x') - i) + ']' + '[y=' + $selectedCell.attr('y') + ']')).attr('color')==currentTeam.enemy)){
            $('[x=' + ($selectedCell.attr('x') - i) + ']' + '[y=' + $selectedCell.attr('y') + ']').addClass('attack').addClass('allowedStep');
        }
    }

    //вниз
    var i =1;
    if ($selectedCell.attr('x') !=7){
        while ((($selectedCell.attr('x') - (-i))!=8)&&(IsCellEmpty(('[x=' + ($selectedCell.attr('x') - (-i)) + ']' + '[y=' + $selectedCell.attr('y') + ']')))) {
            $('[x=' + ($selectedCell.attr('x') - (-i)) + ']' + '[y=' + $selectedCell.attr('y') + ']').addClass('allowedStep');
            i++;
        }
        //attack
        if ((($selectedCell.attr('x') - (-i))!=8)&&(IsCellEmpty(('[x=' + ($selectedCell.attr('x') - (-i)) + ']' + '[y=' + $selectedCell.attr('y') + ']'))==false)&&(($('[x=' + ($selectedCell.attr('x') - (-i)) + ']' + '[y=' + $selectedCell.attr('y') + ']')).attr('color')==currentTeam.enemy)){
            $('[x=' + ($selectedCell.attr('x') - (-i)) + ']' + '[y=' + $selectedCell.attr('y') + ']').addClass('attack').addClass('allowedStep');
        }
    }

    // по горизонтали
    // вправо (for white)
    var i = 1;
    if ($selectedCell.attr('y') !=7){
        while ((($selectedCell.attr('y') - (-i))!=8)&&(IsCellEmpty(('[x=' + $selectedCell.attr('x') + ']' + '[y=' + ($selectedCell.attr('y') -(-i))+ ']')))) {
            $('[x=' + $selectedCell.attr('x') + ']' + '[y=' + ($selectedCell.attr('y') - (-i))+ ']').addClass('allowedStep');
            i++;
        }
        //attack
        if ((($selectedCell.attr('y') - (-i))!=8)&&(IsCellEmpty(('[x=' + $selectedCell.attr('x') + ']' + '[y=' + $selectedCell.attr('y') + ']'))==false)&&(($('[x=' + $selectedCell.attr('x') + ']' + '[y=' + ($selectedCell.attr('y')-(-i))+ ']')).attr('color')==currentTeam.enemy)){
            $('[x=' + $selectedCell.attr('x') + ']' + '[y=' + ($selectedCell.attr('y') -(-i))+ ']').addClass('attack').addClass('allowedStep');
        }
    }

    // влево
    var i = 1;
    if ($selectedCell.attr('y') !=0) {
        while ((($selectedCell.attr('y') - i) != -1) && (IsCellEmpty(('[x=' + $selectedCell.attr('x') + ']' + '[y=' + ($selectedCell.attr('y') - i) + ']')))) {
            $('[x=' + $selectedCell.attr('x') + ']' + '[y=' + ($selectedCell.attr('y') - i) + ']').addClass('allowedStep');
            i++;
        }
        if ((($selectedCell.attr('y') - i) != -1) && (IsCellEmpty(('[x=' + $selectedCell.attr('x') + ']' + '[y=' + ($selectedCell.attr('y') - i) + ']')) == false) && (($('[x=' + $selectedCell.attr('x') + ']' + '[y=' + ($selectedCell.attr('y') - i) + ']')).attr('color') == currentTeam.enemy)) {
            $('[x=' + $selectedCell.attr('x') + ']' + '[y=' + ($selectedCell.attr('y') - i) + ']').addClass('attack').addClass('allowedStep');
        }
    }
}
//слоны
function BishopStep(){
    //up-right
    var i =1;
    if (($selectedCell.attr('x') !=0) && ($selectedCell.attr('y') !=7)) {
        while ((($selectedCell.attr('x') - i)!=-1)&&(($selectedCell.attr('y') - (-i))!=8)&&(IsCellEmpty(('[x=' + ($selectedCell.attr('x') - i) + ']' + '[y=' + ($selectedCell.attr('y')-(-i))+ ']')))) {
            console.log('up-right');
            $('[x=' + ($selectedCell.attr('x') - i) + ']' + '[y=' + ($selectedCell.attr('y') - (-i))+ ']').addClass('allowedStep');
            i++;
        }
        //attack
        if ((($selectedCell.attr('x') - i)!=-1)&&(($selectedCell.attr('y') - (-i))!=8)&&(IsCellEmpty(('[x=' + ($selectedCell.attr('x') - i) + ']' + '[y=' + ($selectedCell.attr('y')-(-i))+ ']'))==false)&&(($('[x=' + ($selectedCell.attr('x') - i) + ']' + '[y=' + ($selectedCell.attr('y')-(-i)) + ']')).attr('color')==currentTeam.enemy)){
            $('[x=' + ($selectedCell.attr('x') - i) + ']' + '[y=' + ($selectedCell.attr('y')-(-i)) + ']').addClass('attack').addClass('allowedStep');
        }
    }

    //up-left
    var i =1;
    if (($selectedCell.attr('x') !=0) && ($selectedCell.attr('y') !=0)) {
        while ((($selectedCell.attr('x') - i)!=-1)&&(($selectedCell.attr('y') - i)!=-1)&&(IsCellEmpty(('[x=' + ($selectedCell.attr('x') - i) + ']' + '[y=' + ($selectedCell.attr('y')-i)+ ']')))) {
            console.log('up-left');
            $('[x=' + ($selectedCell.attr('x') - i) + ']' + '[y=' + ($selectedCell.attr('y') - i)+ ']').addClass('allowedStep');
            i++;
        }
        //attack
        if ((($selectedCell.attr('x') - i)!=-1)&&(($selectedCell.attr('y') - i)!=-1)&&(IsCellEmpty(('[x=' + ($selectedCell.attr('x') - i) + ']' + '[y=' + ($selectedCell.attr('y')-i)+ ']'))==false)&&(($('[x=' + ($selectedCell.attr('x') - i) + ']' + '[y=' + ($selectedCell.attr('y')-i) + ']')).attr('color')==currentTeam.enemy)){
            $('[x=' + ($selectedCell.attr('x') - i) + ']' + '[y=' + ($selectedCell.attr('y')-i) + ']').addClass('attack').addClass('allowedStep');
        }
    }

    //down-right
    var i =1;
    if (($selectedCell.attr('x') !=7) && ($selectedCell.attr('y') !=7)) {
        while ((($selectedCell.attr('x')-(-i))!=8)&&(($selectedCell.attr('y')-(-i))!=8)&&(IsCellEmpty(('[x=' + ($selectedCell.attr('x')-(-i)) + ']' + '[y=' + ($selectedCell.attr('y')-(-i))+ ']')))) {
            console.log('down-right');
            $('[x=' + ($selectedCell.attr('x')-(-i)) + ']' + '[y=' + ($selectedCell.attr('y')-(-i))+ ']').addClass('allowedStep');
            i++;
        }
        //attack
        if ((($selectedCell.attr('x')-(-i))!=8)&&(($selectedCell.attr('y') -(-i))!=8)&&(IsCellEmpty(('[x=' + ($selectedCell.attr('x') -(-i)) + ']' + '[y=' + ($selectedCell.attr('y')-(-i))+ ']'))==false)&&(($('[x=' + ($selectedCell.attr('x') -(-i)) + ']' + '[y=' + ($selectedCell.attr('y')-(-i)) + ']')).attr('color')==currentTeam.enemy)){
            $('[x=' + ($selectedCell.attr('x')-(-i)) + ']' + '[y=' + ($selectedCell.attr('y')-(-i)) + ']').addClass('attack').addClass('allowedStep');
        }
    }

    //down-left
    var i =1;
    if (($selectedCell.attr('x') !=7) && ($selectedCell.attr('y') !=0)) {
        while ((($selectedCell.attr('x')-(-i))!=8)&&(($selectedCell.attr('y')-i)!=-1)&&(IsCellEmpty(('[x=' + ($selectedCell.attr('x')-(-i)) + ']' + '[y=' + ($selectedCell.attr('y')-i)+ ']')))) {
            console.log('down-left');
            $('[x=' + ($selectedCell.attr('x')-(-i)) + ']' + '[y=' + ($selectedCell.attr('y')-i)+ ']').addClass('allowedStep');
            i++;
        }
        //attack
        if ((($selectedCell.attr('x')-(-i))!=8)&&(($selectedCell.attr('y') -i)!=-1)&&(IsCellEmpty(('[x=' + ($selectedCell.attr('x') -(-i)) + ']' + '[y=' + ($selectedCell.attr('y')-i)+ ']'))==false)&&(($('[x=' + ($selectedCell.attr('x') -(-i)) + ']' + '[y=' + ($selectedCell.attr('y')-i) + ']')).attr('color')==currentTeam.enemy)){
            $('[x=' + ($selectedCell.attr('x')-(-i)) + ']' + '[y=' + ($selectedCell.attr('y')-i) + ']').addClass('attack').addClass('allowedStep');
        }
    }
}
//кони
function KnightStep(){
    var i= 2, j=1 // Г
    if ((($selectedCell.attr('x')-i)>0)&&(($selectedCell.attr('y')-(-j))<8)&&(IsCellEmpty('[x=' + ($selectedCell.attr('x')-i) + ']' + '[y=' + ($selectedCell.attr('y')-(-j))+ ']'))){
        $('[x=' + ($selectedCell.attr('x')-i) + ']' + '[y=' + ($selectedCell.attr('y')-(-j))+ ']').addClass('allowedStep');
    }else{
         if (($('[x=' + ($selectedCell.attr('x')-i) + ']' + '[y=' + ($selectedCell.attr('y')-(-j)) + ']')).attr('color')==currentTeam.enemy){
             $('[x=' + ($selectedCell.attr('x')-i) + ']' + '[y=' + ($selectedCell.attr('y')-(-j))+ ']').addClass('allowedStep').addClass('attack');
         }
    }

    var i= 2, j=-1 // обратное Г
    if ((($selectedCell.attr('x')-i)>0)&&(($selectedCell.attr('y')-(-j))>-1)&&(IsCellEmpty('[x=' + ($selectedCell.attr('x')-i) + ']' + '[y=' + ($selectedCell.attr('y')-(-j))+ ']'))){
        $('[x=' + ($selectedCell.attr('x')-i) + ']' + '[y=' + ($selectedCell.attr('y')-(-j))+ ']').addClass('allowedStep');
    }else{
        if (($('[x=' + ($selectedCell.attr('x')-i) + ']' + '[y=' + ($selectedCell.attr('y')-(-j)) + ']')).attr('color')==currentTeam.enemy){
            $('[x=' + ($selectedCell.attr('x')-i) + ']' + '[y=' + ($selectedCell.attr('y')-(-j))+ ']').addClass('allowedStep').addClass('attack');
        }
    }

}