export type Timeouts = {
    morseDot
    morseDash
    morseCharacterSpacing
    characterSpacing
    wordSpacing
};

export type MorseCharacter = "." | "-";
export type TimeoutKeys = keyof Timeouts;
export type Writer = (currentState: boolean, seconds: number) => void;
export type SetPointout = (points: number, next: any) => number;

class MorseTransmitterFactory {
    private readonly unitOfTimeInMs: number = 5000;
    private readonly callback: Function = () => console.log("Message has finished!");
    private readonly morseAlphabet : Object = {
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
    };
    private readonly writer: Writer = (currentState: boolean, seconds: number) => console.log((currentState ? "ON" : "OFF") + " for " + seconds.toString + " s");
    private readonly setPointsTimeout = (points: number, next: any): number => { 
        const secondsPerPoint = 1;
        return setTimeout(() => next(), points * secondsPerPoint * 1000);
    }

    private timeoutHandlerArray: Array<number> = [];

    constructor (unitOfTimeInMs?: number, callback?: Function, morseAlphabet?: Object, writer?: Writer, setPointsTimeout?: SetPointout) {
        if(!!unitOfTimeInMs) this.unitOfTimeInMs = unitOfTimeInMs;
        if(!!callback) this.callback = callback;
        if(!!morseAlphabet) this.morseAlphabet = morseAlphabet;
        if(!!writer) this.writer = writer;
        if(!!setPointsTimeout) this.setPointsTimeout = setPointsTimeout;
    }

    private readonly mapToMarks = (stuff: string, splitCharacter: string, timeoutCharacter: number, mapFun: Function, prefun?: Function): Array<number> => {
        let currentString:string = stuff;
        if (!!prefun) {
            currentString = prefun(stuff);
        } 
        const currentArray = currentString.split(splitCharacter);
        const timeArray: Array<number> = currentArray
            .map(element => mapFun(element))
            .reduce((r, p) => [...r, timeoutCharacter, ...p]);
        return timeArray;
    }

    private readonly mapRegularCharacterToMarks = (character: string): Array<number> => {
        return this.mapToMarks(character,
            "",
            this.timeouts["morseCharacterSpacing"],
            (element) => [this.timeouts[this.morseCharacterMapper[element]]],
            (character) => this.morseAlphabet[character]
        );
    }

    private readonly mapWordToMarks = (word: string): Array<number> => {
        return this.mapToMarks(word,
            "",
            this.timeouts["characterSpacing"],
            (element) => this.mapRegularCharacterToMarks(element)
        );
    }

    private readonly mapTextToMarks = (message: string): Array<number> => {
        return this.mapToMarks(message,
            " ",
            this.timeouts["wordSpacing"],
            (element) => this.mapWordToMarks(element)
        );
    }
    
    private readonly timeouts: Timeouts = {
        "morseDot": 1,
        "morseDash": 3,
        "morseCharacterSpacing": -1,
        "characterSpacing": -3,
        "wordSpacing": -7
    }

    private readonly morseCharacterMapper: Object = {
        ".": "morseDot",
        "-": "morseDash"
    }

    private readonly validCharacters = [...Object.keys(this.morseAlphabet), " "];
    private readonly validCharactersMatch = `^[${this.validCharacters.reduce((prev, current) => prev + current)}]+$`;

    private readonly removeUselessEmptySpaces = (message: string) => message.trim().replace(/\s+/g, " ")

    private readonly validateMessage = (message: string): boolean => (message.length > 0 && message.match(this.validCharactersMatch) !== null);

    private readonly trimAndToLowerString = (message: string): string => message.trim().toLocaleLowerCase();

    private readonly clearTimeouts = () => {
        this.timeoutHandlerArray.forEach(handler => clearTimeout(handler));
        this.timeoutHandlerArray = [];
    }

    TransmitMessage = (message: string): void => {
        this.clearTimeouts();

        const trimmedLowerMessage = this.trimAndToLowerString(message);

        if(this.validateMessage(trimmedLowerMessage)) {
            const sanitizedMessage = this.removeUselessEmptySpaces(trimmedLowerMessage);
            const messageToTransmit = this.mapTextToMarks(sanitizedMessage);
            this.beginTransmission(messageToTransmit);
        } else {
            console.log(`The message contained at least one character not translatable into Morse code. Please use only the following characters: 
                            ${Object.keys(this.morseAlphabet).join(", ")}.`)
        }
    }

    private readonly beginTransmission = (sanitizedMessage: Array<number>): void => {
        console.log("Starting the message in 5 seconds: ")
        setTimeout(() => this.transmitMessage(sanitizedMessage), 5000)
    }

    private readonly transmitMessage = (sanitizedMessage: Array<number>): void => {
        console.log("Let's go!");
        console.log(sanitizedMessage);
        let index = 0;
        this.timeOutMessage(index, sanitizedMessage, );
    }

    private readonly timeOutMessage = (index: number, messageAsArray: Array<number>): void => {
        if(index < messageAsArray.length) { 
            const currentValue = messageAsArray[index];
            const timeInSeconds = this.unitOfTimeInMs * Math.abs(currentValue);
            this.writer(currentValue > 0, timeInSeconds);
            this.timeoutHandlerArray.concat(this.setPointsTimeout(Math.abs(currentValue), () => this.timeOutMessage(index + 1, messageAsArray)))
            //setTimeout(() => this.timeOutMessage(index + 1, messageAsArray, callback), timeInSeconds)
        }
        else {
            this.callback();
        }
    }  
    

}

let resultado = new MorseTransmitterFactory(500)
resultado.TransmitMessage("SOS")