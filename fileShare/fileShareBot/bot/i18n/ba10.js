

const { Button } = require("telegram/tl/custom/button");

const maxClmnForButton = 2;
const elements = ["http://", "https://"]

/**
 * This function converts a dictionary into buttons. Depending on the
 * dictionary's values, it determines the type of buttons needed.
 * 
 * @param {object} button                   - An object containing button values.
 * @param {number} [order=maxClmnForButton] - The maximum number of button columns 
 *                                            (default: 2).
 * 
 * @returns {object} - Returns an object.
 */

async function createButton(
    { button, order=maxClmnForButton }
){
    let temp_button = [];

    if(Object.keys(button).length <= 0){
        return temp_button;
    };

    for (const key in button) {
        // console.log(key, button[key]);
        let type="callback", value=button[key];
        if (elements.some(element => value.startsWith(element))){
            // all links starts with http, https are treated as url
            type="url"
        } else if (value.startsWith(":")){
            // startWith (:) will be treated as inline_query
            type="query"; value=value.slice(1);
        }

        if (type==="url") {
            temp_button.push(
                Button.url(text=key, url=value)
            )
        } else if (type==="callback") {
            temp_button.push(
                Button.inline(text=key, data=value===0?undefined:value)
            )
        } else if (type==="query"){
            temp_button.push(
                Button.switchInline(text=key, query=value)
            )
        }
    };

    const keyboard = [];
    if (order === maxClmnForButton) {
        for (let i = 0; i < temp_button.length; i += maxClmnForButton) {
          keyboard.push(temp_button.slice(i, i + maxClmnForButton));
        }
      } else {
        const newOrder = order.toString().split("").map(Number);
        const buttonIterator = temp_button[Symbol.iterator]();
      
        keyboard = newOrder.map(elem => Array.from({ length: elem }, () => {
          const subArray = [];
          for (let i = 0; i < elem; i++) {
            subArray.push(buttonIterator.next().value);
          }
          return subArray;
        }));
      }

    return keyboard ? keyboard : null;
}

module.exports = {
    maxClmnForButton, createButton
}