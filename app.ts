import { createInterface } from 'node:readline';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined');
}
const ai = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = ai.getGenerativeModel({
    model: 'gemini-2.0-flash',
});

async function content(prompt: string) {
    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return text;
    } catch (err) {
        console.error(err);
    }
}

const read = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'You (Ctrl+C to exit):\n'
});

function askGemini() {
    read.prompt();

    read.on('line', async function (prompt: string) {
        try {
            const result = await content(prompt);
            console.log(`Gemini:\n${result}`);
            read.prompt();
        } catch (err) {
            console.error(err);
            read.prompt();
        }
    });

    read.on('close', function () {
        console.log('Thank you for using Gemini!');
        process.exit(0);
    });

    read.on('SIGINT', function () {
        console.log('Exiting...');
        read.close();
    });
}

askGemini();