const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(bodyParser.json());

exports.Compiler = async (req, res) => {
    const { code, input, lang } = req.body;
    const tempFileName = "Main" + getFileExtension(lang);
    fs.writeFileSync(tempFileName, code);

    let command, args, compiledFileName;

    if (lang === "C") {
        command = "gcc";
        args = ["-o", "compiled_c", tempFileName];
        compiledFileName = "compiled_c";
    } else if (lang === "C++") {
        command = "g++";
        args = ["-o", "compiled_cpp", tempFileName];
        compiledFileName = "compiled_cpp";
    } else if (lang === "Java") {
        command = "javac";
        args = [tempFileName];
        compiledFileName = "Main";
    } else if (lang === "Python") {
        command = "python3.11";
        args = ["-"];
        compiledFileName = "compiled_py";
    } else {
        return res.status(400).json({ error: "Invalid language specified" });
    }

    const childProcess = spawn(command, args);

    let output = "";
    let error = "";

    childProcess.stdout.on("data", (data) => {
        output += data.toString();
    });

    childProcess.stderr.on("data", (data) => {
        error += data.toString();
    });

    childProcess.on("close", () => {
        if (error) {
            res.send(error);
        } else {
            if (lang === "Java") {
                const runProcess = spawn("java", [compiledFileName], {
                    stdio: ["pipe", "pipe", "ignore"]
                });
                runProcess.stdin.write(input);
                runProcess.stdin.end();

                let runOutput = "";
                runProcess.stdout.on("data", (data) => {
                    runOutput += data.toString();
                });

                runProcess.on("close", () => {
                    res.send(runOutput);
                });
            }
            else if (lang === "Python") {
              const runProcess = spawn("python", [tempFileName], {
                  stdio: ["pipe", "pipe", "ignore"]
              });
              runProcess.stdin.write(input);
              runProcess.stdin.end();
          
              let runOutput = "";
              runProcess.stdout.on("data", (data) => {
                  runOutput += data.toString();
              });
          
              runProcess.on("close", () => {
                  res.send(runOutput);
              });
          }
             else {
                const runProcess = spawn(`./${compiledFileName}`, {
                    stdio: ["pipe", "pipe", "ignore"]
                });

                runProcess.stdin.write(input);
                runProcess.stdin.end();

                let runOutput = "";

                runProcess.stdout.on("data", (data) => {
                    runOutput += data.toString();
                });

                runProcess.on("close", () => {
                    res.send(runOutput);
                });
            }
        }
    });
};

function getFileExtension(lang) {
    switch (lang) {
        case "C":
            return ".c";
        case "C++":
            return ".cpp";
        case "Java":
            return ".java";
        case "Python":
            return ".py";
        default:
            return "";
    }
}
