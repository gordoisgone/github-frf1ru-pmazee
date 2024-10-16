import * as fal from "@fal-ai/serverless-client";

const prompt = "A hyperdetailed photograph of a Cat dressed as a mafia boss holding a fish walking down a Japanese fish market with an angry face, 8k resolution, best quality, beautiful photograph, dynamic lighting,";

const submitRequest = async () => {
  try {
    const enqueueResult = await fal.queue.submit("fal-ai/realistic-vision", {
      input: { prompt },
    });
    const requestId = enqueueResult.request_id;

    if (!requestId) {
      throw new Error("Request ID not found in enqueueResult");
    }

    console.log("Request ID:", requestId);
    let status;
    while (true) {
      status = await fal.queue.status("fal-ai/realistic-vision", { requestId, logs: true });
      console.log("Status:", status);
      if (status) {
        // Type assertion to suppress TypeScript error
        const statusString: string = status.status as string; 
        if (statusString === "COMPLETED" || statusString === "FAILED" || statusString === "IN_PROGRESS" || statusString === "IN_QUEUE") {
          break;
        }
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    try {
      if (status && status.status === "COMPLETED") {
        const result = await fal.queue.result("fal-ai/realistic-vision", { requestId });
        console.log("Result:", result);
        const resultDiv = document.getElementById("result");
        if (resultDiv) {
          resultDiv.innerText = JSON.stringify(result, null, 2);
        }
      } else {
        const resultDiv = document.getElementById("result");
        if (resultDiv) {
          resultDiv.innerText = `Request failed: ${JSON.stringify(status, null, 2)}`;
        }
      }
    } catch (error) {
      console.error("Error fetching result:", error);
      const resultDiv = document.getElementById("result");
      if (resultDiv) {
        resultDiv.innerText = `Error fetching result: ${error}`;
      }
    }
  } catch (error) {
    console.error("Error:", error);
    const resultDiv = document.getElementById("result");
    if (resultDiv) {
      resultDiv.innerText = `An error occurred: ${error}`;
    }
  }
};

const promptDiv = document.getElementById("prompt");
if (promptDiv) {
  promptDiv.innerText = prompt;
}
submitRequest();
