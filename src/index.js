function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    while (expr.indexOf(' ') >= 0) {
        expr = expr.replace(' ','');
    }
    let left_pos = [];
    for (let i = 0; i< expr.length; i++) {
        if (expr[i] == '(') {
            left_pos.push(i);
        }
        if (expr[i] == ')') {
            if (left_pos.length > 0) {
                let left = left_pos.pop();
                let res = my_calc(expr.substr(left+1,i-left-1));
                expr = expr.replace(expr.substr(left,i-left+1),res);
                return expressionCalculator(expr);
            }
            else {
                throw new Error("ExpressionError: Brackets must be paired");
            }
        }
    }
    if (left_pos.length>0) throw new Error("ExpressionError: Brackets must be paired");
    return Number(my_calc(expr));
}

function my_calc(expr) {
    let md = [];
    let pm = [];
    for (let i = 0; i < expr.length; i++) {
        if (expr[i] == '*' || expr[i] == '/') md.push(i);
        if (expr[i] == '+') pm.push(i);
        if (expr[i] == '-' && i != 0 && pm[pm.length-1]+1 != i && expr[i-1] != "e") pm.push(i);
    }
    if (md.length > 0) {
        let op = expr[md[0]];
        let before = md[0]-1;
        let after = md[0]+1;
        let first = 0;
        let second = 0;
        for (let i = before; i >= 0 ; i--) {
            if (expr[i] == '+' || expr[i] == "-" || i == 0) {
                before = i==0?0:i+1;
                let pre = expr.substr(before,md[0]-i-(i==0?i:1));
                if (pre.length > 0) {
                    first = Number(pre);
                    break;
                }
                else {
                    throw new Error("Error! Invalid input!")
                }
            }
        }
        for (let i = after; i < expr.length ; i++) {
            if (expr[i] == '*' || expr[i] == "/" || expr[i] == '+' || expr[i] == "-" || i == expr.length-1) {
                if (md[0] == i-1 && i != expr.length-1) continue;
                after = i==expr.length-1?i:i-1;
                let pre = expr.substr(md[0]+1,after-md[0]);
                if (pre.length > 0) {
                    second = Number(pre);
                    break;
                }
                else {
                    throw new Error("Error! Invalid input!")
                }
            }
        }
        if (op == '*') first*=second;
        else if (second != 0) first/=second;
             else throw new Error("TypeError: Division by zero.");
        expr = expr.replace(expr.substr(before,after-before+1),String(first));
        return my_calc(expr);
    }
    if (pm.length > 0) {
        let op = expr[pm[0]];
        let before = 0;
        let after = pm[0]+1;
        let first = 0;
        let second = 0;
        let pre = expr.substr(0,pm[0]);
        if (pre.length > 0) {
            first = Number(pre);
        }
        else {
            throw new Error("Error! Invalid input!")
        }
        for (let i = after; i < expr.length ; i++) {
            if (expr[i] == '+' || expr[i] == "-" || i == expr.length-1) {
                if (pm[0] == i-1 && i != expr.length-1) continue;
                after = i==expr.length-1?i:i-1;
                let aft = expr.substr(pm[0]+1,after-pm[0]);
                if (aft.length > 0) {
                    second = Number(aft);
                    break;
                }
                else {
                    throw new Error("Error! Invalid input!");
                }
            }
        }
        if (op == '+') first+=second;
        else first-=second;
        after++;
        expr = expr.replace(expr.substr(before,after),String(first));
        return my_calc(expr);
    }
    return expr;
}

module.exports = {
    expressionCalculator
}