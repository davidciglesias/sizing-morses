# sizing-morses
This project implements a Morse code transmitter.

# User Story (Card):

As a newbie Morse operator, I want to be able to write a text with characters from the Morse Alphabet and obtain the required Morse signals to transmit that message so that I can communicate easily without having to think much.

# User Story (Conversation):

- Morse code is based on short marks (1 unit of time) and long marks (3 units of time), which used together (with a time separation of 1 unit of time) create characters. To separate characters from a word, a gap is left (3 units of time) and to separate words from each other, a longer gap is left (7 units of time)
- The Morse Alphabet contains the following codes:

const morseAlphabet = {
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  "a": ".-",
  "b": "-...",
  "c": "-.-.",
  "d": "-..",
  "e": ".",
  "f": "..-.",
  "g": "--.",
  "h": "....",
  "i": "..",
  "j": ".---",
  "k": "-.-",
  "l": ".-..",
  "m": "--",
  "n": "-.",
  "o": "---",
  "p": ".--.",
  "q": "--.-",
  "r": ".-.",
  "s": "...",
  "t": "-",
  "u": "..-",
  "v": "...-",
  "w": ".--",
  "x": "-..-",
  "y": "-.--",
  "z": "--..",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "!": "-.-.--",
  "-": "-....-",
  "/": "-..-.",
  "@": ".--.-.",
  "(": "-.--.",
  ")": "-.--.-"
}
- Alternative representation of the code: https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Morse_code_tree3.png/770px-Morse_code_tree3.png
- A console output is enough, but it must be readable enough so that an operator can easily follow it to transmit the message.

# User Story (Confirmation)
- The input must be a text that only contains characters from the Morse Alphabet
- If the input contains characters that are not included in the Morse Alphabet, an error will show, so as to avoid buggy messages
- The output must be the ON/OFF status of the switch, as well as the current state of the message
- The time unit must be configurable so that an operator can get used to working with the system by using longer times
- Once the transmission has finished, a message will indicate so

# Technical Information

- The Factory pattern will be used
 - Therefore, the class/object will be provided from the Factory class
- The ingredients the factory requires are:
 - Mapper from character to Morse code
 - Timeout implementation to space the symbols with 1/3/7 units as the input. The time of the unit must be defined elsewhere.
 - A 'writer' to take care of the output
 - A callback function when the message has been fully transmitted
 - A function to transmit the message, with the message as an input (and applying the validation)
 
# Additional information
- https://en.wikipedia.org/wiki/Morse_code
 
 
