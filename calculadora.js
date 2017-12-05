var Calculadora = angular.module("Calculadora", []);
Calculadora.controller("calculadoraController", ['$scope', function($scope){
    $scope.a = "sdsds";

}])

Calculadora.directive("calculadora", function(){
    return {
        restrict: 'E',
        scope: {},
        template: `
        <div class="calculadora"> 
            <div class = "display">
                <span class = "fullop"> {{fullOperation}} </span> 
                <span class = "disp">{{number | number:decimals}}</span> 
            </div> 
            <div class="botones"> 
                <div class="boton"
                ng-repeat="btn in botones"
                ng-click="processBtn(btn)"
                ng-class="{'action': isString(btn), 'number': !isString(btn), 'mem': isMem(btn)}"> {{btn}}</div>
            </div>
        </div>`,
        link: function(scope, element, attrs){
            op = false;
            opdone = false;
            decimals = 0;
            memory = 0;
            scope.number = "";
            scope.fullOperation = "";
            scope.botones = [
                'MC', 'MR', 'M+', 'M-', 'MS',
                'CE', 'C', '←', '÷',
                7,8,9,'x',
                4,5,6,'-',
                1,2,3,'+',
                '∓', 0, '.', '='];
            scope.isString = function(v){
                return angular.isString(v);
            }

            scope.isMem = function(v){                
                return scope.isString(v) &&  v.split("").indexOf("M") !== -1;
            }

            scope.processBtn = function(b){
                // console.log("Process:", b);
                if((scope.botones.concat(['*','/'])).indexOf(b) === -1) { return; }                
                if(angular.isString(b)){               
                    if(b == 'x') b = '*';
                    if(b == '÷') b = '/';
                    if(b == '='){
                        scope.fullOperation += scope.number;        
                        scope.number = eval(scope.fullOperation);
                        if(isNaN(scope.number)){
                            scope.number = "";
                            alert("ERROR 0/0");
                        }
                        scope.fullOperation = '';
                        op = true;
                    }else{
                        switch(b){
                            case 'C': 
                                scope.fullOperation = "";
                                scope.number = "";
                                break;
                            case 'CE': 
                                scope.number = "";
                                op = true;
                                break;
                            case '←': 
                                scope.fullOperation = scope.fullOperation.slice(0, -1);
                                scope.number = scope.number.toString().slice(0, -1); break;
                            case '∓':
                                scope.number = -1 * scope.number;
                                break;
                            case 'MC':
                                memory = 0;
                                break;
                            case 'MS':
                                memory = scope.number;
                                break;
                            case 'MR':
                                scope.number = memory;
                                break;
                            case 'M+':
                                memory += parseFloat(scope.number);
                                op = true;
                                break;
                            case 'M-':
                                memory += parseFloat(scope.number);
                                op = true;
                                break;                            
                            case '.':
                                op = false;
                                scope.number += b;
                                scope.fullOperation += b;                                
                                decimals = 2;break;

                            default:
                                if(op){
                                    scope.fullOperation = scope.fullOperation.slice(0, -1);
                                    scope.fullOperation += b;
                                }else{
                                    scope.fullOperation += scope.number;
                                    scope.fullOperation += b;                                   
                                    op = true;
                                }
                                
                                break;
                        }                        
                    }
                    
                    
                }else{
                    // scope.fullOperation += b;                    
                    scope.number += b;                    
                    if(op){
                        scope.number = "";
                        scope.number += b;
                        op = false;
                    }
                }
                
                 

            
            }

            // desde el teclado
            window.focus();
            window.onkeydown = keypress;
            function keypress() {
                k = event.key;
                if (isStringNumber(k)) {
                    k = parseInt(k);                    
                }
                if(k == 'Enter'){
                    k = '=';
                }
                if(k == 'Delete'){
                    k = 'CE';
                }
                if (k == 'Backspace'){
                    k = '←';
                }
                scope.processBtn(k);
                scope.$apply();
            }

            function isStringNumber(s) {
                var x = +s; // made cast obvious for demonstration
                return x.toString() === s;
            }



        }
    }
});