
// buget app

/*
ui controller
datacontroller
appcontroller
*/

// budgetController
var budgetController = (function(){

    // expence cnstructor
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    // income cnstructor
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // data structure for items and total buget
    var data = {
        allItems :{
            inc : [],
            exp : [],
        },
        total : {
            inc : 0,
            exp : 0,
        },
        per : 0,
        budget : 0,
    };


    // calculate total inc and exp funcion
    var calculateTotal = function(typ){
        sum = 0;
        data.allItems[typ].forEach(function(current){
            sum+= current.value;
        })
        data.total[typ] = sum;
    }

    //public buget return
    return {
        // function for add new items
        addNewItem : function(typ, des, val){
            var newItem, ID;
            if (data.allItems[typ].length > 0){
                ID = data.allItems[typ][data.allItems[typ].length - 1].id + 1;
            }else{
                    ID = 0;
                }
            // create newitem based on 'inc' or 'exp'
            if (typ === 'exp'){
                newItem = new Expense(ID, des, val);
            }else if(typ === 'inc'){
                newItem = new Income(ID, des, val);
            }
            // add newitem to specific typ
            data.allItems[typ].push(newItem);
            return newItem;
        },

        deleteItem : function(delType, delId){
            var ids, index;
            /* // deltype = [2,4,6,7]
            data.allItems[delType][id]   wrong id finds index but we need element that is id
            */
            //ids = [2,4,6,7]
            // id = 6
            // index = 3
            ids = data.allItems[delType].map(function(current){
                return current.id;
            });
            index = ids.indexOf(delId);
            if (index !== -1){
                data.allItems[delType].splice(index, 1);    // splice remove item and update new
            }
        },

        calculateBudget: function(){

            // addition of all inc and  all exp separate
            calculateTotal('exp');
            calculateTotal('inc');

            // get buget by income - exp z4
            data.budget = data.total.inc - data.total.exp;

            if (data.total.inc > 0){
                // get per by (exp/inc)100
                data.per = Math.round((data.total.exp / data.total.inc)*100);
            }else {
                data.per = -1;
            }
        },
        getBudget : function(){
            return{
                totalInc : data.total.inc,
                totalExp : data.total.exp,
                budget : data.budget,
                percentage : data.per,
            };
        },

        // test function to test object
        test : function(){
            console.log(data);
        },
    };
})();


// UIController
var uiController = (function(){

    var domStrings = {
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputType : '.add__type',
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        ExpensesContainer : '.expenses__list',
        budgetUI : '.budget__value',
        incomeUI : '.budget__income--value',
        expenseUI : '.budget__expenses--value',
        percentageUI : '.budget__expenses--percentage',
        container : '.container'
    };

    return{
        getInput : function(){
            return{
                type : document.querySelector(domStrings.inputType).value,
                description : document.querySelector(domStrings.inputDescription).value,
                value : parseFloat(document.querySelector(domStrings.inputValue).value),
            };
        },
        getDomStrings : function(){
            return domStrings;
        },
        // method add item to ui
        addItemList : function(obj, type){
            var html;
            //1. html
            if (type === 'inc'){
                element = domStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }else if(type === 'exp'){
                element = domStrings.ExpensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //2. replace string repalcement
                newhtml = html.replace('%id%',obj.id);
                newhtml = newhtml.replace('%description%',obj.description);
                newhtml = newhtml.replace('%value%',obj.value);
            //3. insert html into DOM
                document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
        },

        deleteItem :function(selectorID){
              var el = document.getElementById(selectorID);
              el.parentNode.removeChild(el);
        },

        //4. clear input strings
        clearInputs : function(){
            var fields, fieldArr;
            // select all input fields make a list
            fields = document.querySelectorAll(domStrings.inputDescription+ ',' + domStrings.inputValue);
            //convert list into array by slice
            fieldArr = Array.prototype.slice.call(fields);
            // iterate each element by foreach and callback function.
            fieldArr.forEach(function(eachname){
                eachname.value = "";
            });
            // cursor focus on first element of arr(description)
            fieldArr[0].focus();
        },

        displayBudget : function(buget){
            document.querySelector(domStrings.budgetUI).textContent = buget.budget;
            document.querySelector(domStrings.incomeUI).textContent = buget.totalInc;
            document.querySelector(domStrings.expenseUI).textContent = buget.totalExp;
            if (buget.percentage > 0){
                document.querySelector(domStrings.percentageUI).textContent = buget.percentage +'%';
            }else{
                document.querySelector(domStrings.percentageUI).textContent = '---';
            }

        }

    };

})();

//GlobalController
var appController = (function(bugetCtrl, UICtrl){


    var setupInitFunction = function(){
        var DOM = UICtrl.getDomStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13 || event.which ===13){
                ctrlAddItem();
        }
        });
    } ;

    var updateBudget = function(){

        // 1. update buget
        bugetCtrl.calculateBudget();

        // 2. return buget
        var budget = bugetCtrl.getBudget();

        // 3. display buget
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function(){
      //1. calculate percentages

      //2. read percentages

      //3. update ui for percentages

    };

    var ctrlAddItem = function(){
        var input, newItem;
        // 1. get input values
        input = UICtrl.getInput();

        if (input.description !== "" && input.value > 0 && !isNaN(input.value)){
            // 2. call addnewitem function from bugetcontroller
            newItem = bugetCtrl.addNewItem(input.type, input.description, input.value);

            // 3. display input values
            UICtrl.addItemList(newItem, input.type);

            // 4. clear inputs
            UICtrl.clearInputs();
            }
            // 5. udateBudget
            updateBudget();

            // 6.  update percentages
            updatePercentages();

    }

    var ctrlDeleteItem = function(event){
        var itemId, splitID, type;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId){

            // inc-1
            splitID = itemId.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // delete item from data structure
            bugetCtrl.deleteItem(type, ID);

            // delete item from ui
            UICtrl.deleteItem(itemId);

            // update buget after deleted items
            updateBudget();

            // update percentages
            updatePercentages();
        }

    }

   return{
       init : function(){
           UICtrl.displayBudget({
                totalInc : 0,
                totalExp : 0,
                budget : 0,
                percentage : -1
           });
           setupInitFunction();

       }
   };

})(budgetController,uiController);

appController.init();

