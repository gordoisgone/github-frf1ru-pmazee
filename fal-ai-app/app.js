"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fal = __importStar(require("@fal-ai/serverless-client"));
const prompt = "A hyperdetailed photograph of a Cat dressed as a mafia boss holding a fish walking down a Japanese fish market with an angry face, 8k resolution, best quality, beautiful photograph, dynamic lighting,";
const submitRequest = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enqueueResult = yield fal.queue.submit("fal-ai/realistic-vision", {
            input: { prompt },
        });
        const requestId = enqueueResult.request_id;
        if (!requestId) {
            throw new Error("Request ID not found in enqueueResult");
        }
        console.log("Request ID:", requestId);
        let status;
        while (true) {
            status = yield fal.queue.status("fal-ai/realistic-vision", { requestId, logs: true });
            console.log("Status:", status);
            if (status && status.status === "complete") {
                break;
            }
            yield new Promise(resolve => setTimeout(resolve, 2000));
        }
        if (status && status.status === "complete") {
            try {
                const result = yield fal.queue.result("fal-ai/realistic-vision", { requestId });
                console.log("Result:", result);
                const resultDiv = document.getElementById("result");
                if (resultDiv) {
                    resultDiv.innerText = JSON.stringify(result, null, 2);
                }
            }
            catch (error) {
                console.error("Error fetching result:", error);
                const resultDiv = document.getElementById("result");
                if (resultDiv) {
                    resultDiv.innerText = `Error fetching result: ${error}`;
                }
            }
        }
        else {
            const resultDiv = document.getElementById("result");
            if (resultDiv) {
                resultDiv.innerText = `Request failed: ${JSON.stringify(status, null, 2)}`;
            }
        }
    }
    catch (error) {
        console.error("Error:", error);
        const resultDiv = document.getElementById("result");
        if (resultDiv) {
            resultDiv.innerText = `An error occurred: ${error}`;
        }
    }
});
const promptDiv = document.getElementById("prompt");
if (promptDiv) {
    promptDiv.innerText = prompt;
}
submitRequest();
