1. Calling the API
#
Install the client
#
The client provides a convenient way to interact with the model API.

npm
yarn
pnpm
bun

npm install --save @fal-ai/serverless-client
Setup your API Key
#
Set FAL_KEY as an environment variable in your runtime.


export FAL_KEY="YOUR_API_KEY"
Submit a request
#
The client API handles the API submit protocol. It will handle the request status updates and return the result when the request is completed.


import * as fal from "@fal-ai/serverless-client";

const result = await fal.subscribe("fal-ai/realistic-vision", {
  input: {
    prompt: "A hyperdetailed photograph of a Cat dressed as a mafia boss holding a fish walking down a Japanese fish market with an angry face, 8k resolution, best quality, beautiful photograph, dynamic lighting,"
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});
2. Authentication
#
The API uses an API Key for authentication. It is recommended you set the FAL_KEY environment variable in your runtime when possible.

API Key
#
In case your app is running in an environment where you cannot set environment variables, you can set the API Key manually as a client configuration.

import * as fal from "@fal-ai/serverless-client";

fal.config({
  credentials: "YOUR_FAL_KEY"
});
Protect your API Key
When running code on the client-side (e.g. in a browser, mobile app or GUI applications), make sure to not expose your FAL_KEY. Instead, use a server-side proxy to make requests to the API. For more information, check out our server-side integration guide.

3. Queue
#
Long-running requests
For long-running requests, such as training jobs or models with slower inference times, it is recommended to check the Queue status and rely on Webhooks instead of blocking while waiting for the result.

Submit a request
#
The client API provides a convenient way to submit requests to the model.


import * as fal from "@fal-ai/serverless-client";

const { request_id } = await fal.queue.submit("fal-ai/realistic-vision", {
  input: {
    prompt: "A hyperdetailed photograph of a Cat dressed as a mafia boss holding a fish walking down a Japanese fish market with an angry face, 8k resolution, best quality, beautiful photograph, dynamic lighting,"
  },
  webhookUrl: "https://optional.webhook.url/for/results",
});
Fetch request status
#
You can fetch the status of a request to check if it is completed or still in progress.


import * as fal from "@fal-ai/serverless-client";

const status = await fal.queue.status("fal-ai/realistic-vision", {
  requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b",
  logs: true,
});
Get the result
#
Once the request is completed, you can fetch the result. See the Output Schema for the expected result format.


import * as fal from "@fal-ai/serverless-client";

const result = await fal.queue.result("fal-ai/realistic-vision", {
  requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b"
});
4. Files
#
Some attributes in the API accept file URLs as input. Whenever that's the case you can pass your own URL or a Base64 data URI.

Data URI (base64)
#
You can pass a Base64 data URI as a file input. The API will handle the file decoding for you. Keep in mind that for large files, this alternative although convenient can impact the request performance.

Hosted files (URL)
#
You can also pass your own URLs as long as they are publicly accessible. Be aware that some hosts might block cross-site requests, rate-limit, or consider the request as a bot.

Uploading files
#
We provide a convenient file storage that allows you to upload files and use them in your requests. You can upload files using the client API and use the returned URL in your requests.


import * as fal from "@fal-ai/serverless-client";

const file = new File(["Hello, World!"], "hello.txt", { type: "text/plain" });
const url = await fal.storage.upload(file);
Auto uploads
The client will auto-upload the file for you if you pass a binary object (e.g. File, Data).

Read more about file handling in our file upload guide.

5. Schema
#
Input
#
model_name string
The Realistic Vision model to use.

prompt string
The prompt to use for generating the image. Be as descriptive as possible for best results.

negative_prompt string
The negative prompt to use. Use it to address details that you don't want in the image. Default value: "(worst quality, low quality, normal quality, lowres, low details, oversaturated, undersaturated, overexposed, underexposed, grayscale, bw, bad photo, bad photography, bad art:1.4), (watermark, signature, text font, username, error, logo, words, letters, digits, autograph, trademark, name:1.2), (blur, blurry, grainy), morbid, ugly, asymmetrical, mutated malformed, mutilated, poorly lit, bad shadow, draft, cropped, out of frame, cut off, censored, jpeg artifacts, out of focus, glitch, duplicate, (airbrushed, cartoon, anime, semi-realistic, cgi, render, blender, digital art, manga, amateur:1.3), (3D ,3D Game, 3D Game Scene, 3D Character:1.1), (bad hands, bad anatomy, bad body, bad face, bad teeth, bad arms, bad legs, deformities:1.3)"

image_size ImageSize | Enum
Default value: [object Object]

Possible enum values: square_hd, square, portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9

Note: For custom image sizes, you can pass the width and height as an object:


"image_size": {
  "width": 1280,
  "height": 720
}
num_inference_steps integer
The number of inference steps to perform. Default value: 35

guidance_scale float
The CFG (Classifier Free Guidance) scale is a measure of how close you want the model to stick to your prompt when looking for a related image to show you. Default value: 5

loras list<LoraWeight>
The list of LoRA weights to use. Default value: ``

embeddings list<Embedding>
The list of embeddings to use. Default value: ``

expand_prompt boolean
If set to true, the prompt will be expanded with additional prompts.

num_images integer
The number of images to generate. Default value: 1

seed integer
The same seed and the same prompt given to the same version of Stable Diffusion will output the same image every time.

enable_safety_checker boolean
If set to true, the safety checker will be enabled. Default value: true

sync_mode boolean
If set to true, the function will wait for the image to be generated and uploaded before returning the response. This will increase the latency of the function but it allows you to get the image directly in the response without going through the CDN.

format FormatEnum
The format of the generated image. Default value: "jpeg"

Possible enum values: jpeg, png

safety_checker_version SafetyCheckerVersionEnum
The version of the safety checker to use. v1 is the default CompVis safety checker. v2 uses a custom ViT model. Default value: "v1"

Possible enum values: v1, v2


{
  "model_name": "SG161222/Realistic_Vision_V6.0_B1_noVAE",
  "prompt": "A hyperdetailed photograph of a Cat dressed as a mafia boss holding a fish walking down a Japanese fish market with an angry face, 8k resolution, best quality, beautiful photograph, dynamic lighting,",
  "negative_prompt": "(worst quality, low quality, normal quality, lowres, low details, oversaturated, undersaturated, overexposed, underexposed, grayscale, bw, bad photo, bad photography, bad art:1.4), (watermark, signature, text font, username, error, logo, words, letters, digits, autograph, trademark, name:1.2), (blur, blurry, grainy), morbid, ugly, asymmetrical, mutated malformed, mutilated, poorly lit, bad shadow, draft, cropped, out of frame, cut off, censored, jpeg artifacts, out of focus, glitch, duplicate, (airbrushed, cartoon, anime, semi-realistic, cgi, render, blender, digital art, manga, amateur:1.3), (3D ,3D Game, 3D Game Scene, 3D Character:1.1), (bad hands, bad anatomy, bad body, bad face, bad teeth, bad arms, bad legs, deformities:1.3)",
  "image_size": {
    "height": 1024,
    "width": 1024
  },
  "num_inference_steps": 35,
  "guidance_scale": 5,
  "loras": [],
  "embeddings": [],
  "num_images": 1,
  "enable_safety_checker": true,
  "format": "jpeg",
  "safety_checker_version": "v1"
}
Output
#
images list<Image>
The generated image files info.

timings Timings
seed integer
Seed of the generated Image. It will be the same value of the one passed in the input or the randomly generated that was used in case none was passed.

has_nsfw_concepts list<boolean>
Whether the generated images contain NSFW concepts.

prompt string
The prompt used for generating the image.


{
  "images": [
    {
      "url": "",
      "content_type": "image/jpeg"
    }
  ],
  "prompt": ""
}
Other types
#
ImageSize
#
width integer
The width of the generated image. Default value: 512

height integer
The height of the generated image. Default value: 512

LoraWeight
#
path string
URL or the path to the LoRA weights. Or HF model name.

scale float
The scale of the LoRA weight. This is used to scale the LoRA weight before merging it with the base model. Default value: 1

Embedding
#
path string
URL or the path to the embedding weights.

tokens list<string>
The list of tokens to use for the embedding. Default value: <s0>,<s1>

Image
#
url string
width integer
height integer
content_type string
Default value: "image/jpeg"


Client Library for JavaScript / TypeScript
Introduction
The client for JavaScript / TypeScript provides a seamless interface to interact with fal.

Installation
First, add the client as a dependency in your project:

npm install --save @fal-ai/serverless-client

Features
1. Call an endpoint
Endpoints requests are managed by a queue system. This allows fal to provide a reliable and scalable service.

The subscribe method allows you to submit a request to the queue and wait for the result.

import * as fal from "@fal-ai/serverless-client";
 
const result = await fal.subscribe("fal-ai/flux/dev", {
  input: {
    prompt: "a cat",
    seed: 6252023,
    image_size: "landscape_4_3",
    num_images: 4,
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});

2. Queue Management
You can manage the queue using the following methods:

Submit a Request
Submit a request to the queue using the queue.submit method.

import * as fal from "@fal-ai/serverless-client";
 
const { request_id } = await fal.queue.submit("fal-ai/flux/dev", {
  input: {
    prompt: "a cat",
    seed: 6252023,
    image_size: "landscape_4_3",
    num_images: 4,
  },
  webhookUrl: "https://optional.webhook.url/for/results",
});

This is useful when you want to submit a request to the queue and retrieve the result later. You can save the request_id and use it to retrieve the result later.

Webhooks
For long-running requests, such as training jobs, you can use webhooks to receive the result asynchronously. You can specify the webhook URL when submitting a request.

Check Request Status
Retrieve the status of a specific request in the queue:

import * as fal from "@fal-ai/serverless-client";
 
const status = await fal.queue.status("fal-ai/flux/dev", {
  requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b",
  logs: true,
});

Retrieve Request Result
Get the result of a specific request from the queue:

import * as fal from "@fal-ai/serverless-client";
 
const result = await fal.queue.result("fal-ai/flux/dev", {
  requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b",
});

3. File Uploads
Some endpoints require files as input. However, since the endpoints run asynchronously, processed by the queue, you will need to provide URLs to the files instead of the actual file content.

Luckily, the client library provides a way to upload files to the server and get a URL to use in the request.

import * as fal from "@fal-ai/serverless-client";
 
const file = new File(["Hello, World!"], "hello.txt", { type: "text/plain" });
const url = await fal.storage.upload(file);

4. Streaming
Some endpoints support streaming:

import * as fal from "@fal-ai/serverless-client";
 
const stream = await fal.stream("fal-ai/flux/dev", {
  input: {
    prompt: "a cat",
    seed: 6252023,
    image_size: "landscape_4_3",
    num_images: 4,
  },
});
 
for await (const event of stream) {
  console.log(event);
}
 
const result = await stream.done();

5. Realtime Communication
For the endpoints that support real-time inference via WebSockets, you can use the realtime client that abstracts the WebSocket connection, re-connection, serialization, and provides a simple interface to interact with the endpoint:

import * as fal from "@fal-ai/serverless-client";
 
const connection = fal.realtime.connect("fal-ai/flux/dev", {
  onResult: (result) => {
    console.log(result);
  },
  onError: (error) => {
    console.error(error);
  },
});
 
connection.send({
  prompt: "a cat",
  seed: 6252023,
  image_size: "landscape_4_3",
  num_images: 4,
});

6. Run
The endpoints can also be called directly instead of using the queue system.

Prefer the queue
We do not recommend this use most use cases as it will block the client until the response is received. Moreover, if the connection is closed before the response is received, the request will be lost.



Add fal.ai to your Next.js app
You will learn how to:
Install the fal.ai libraries
Add a server proxy to protect your credentials
Generate an image using SDXL
Prerequisites
Have an existing Next.js app or create a new one using npx create-next-app
Have a fal.ai account
Have an API Key. You can create one here
1. Install the fal.ai libraries
Using your favorite package manager, install both the @fal-ai/serverless-client and @fal-ai/serverless-proxy libraries.

npm install @fal-ai/serverless-client @fal-ai/serverless-proxy

2. Setup the proxy
The proxy will protect your API Key and prevent it from being exposed to the client. Usually app implementation have to handle that integration themselves, but in order to make the integration as smooth as possible, we provide a drop-in proxy implementation that can be integrated with either the Page Router or the App Router.

2.1. Page Router
If you are using the Page Router (i.e. src/pages/_app.js), create an API handler in src/pages/api/fal/proxy.js (or .ts in case of TypeScript), and re-export the built-in proxy handler:

export { handler as default } from "@fal-ai/serverless-proxy/nextjs";

2.2. App Router
If you are using the App Router (i.e. src/app/page.jsx) create a route handler in src/app/api/fal/proxy/route.js (or .ts in case of TypeScript), and re-export the route handler:

import { route } from "@fal-ai/serverless-proxy/nextjs";
 
export const { GET, POST } = route;

2.3. Setup the API Key
Make sure you have your API Key available as an environment variable. You can setup in your .env.local file for development and also in your hosting provider for production, such as Vercel.

FAL_KEY="key_id:key_secret"

2.4. Custom proxy logic
It's common for applications to execute custom logic before or after the proxy handler. For example, you may want to add a custom header to the request, or log the request and response, or apply some rate limit. The good news is that the proxy implementation is simply a standard Next.js API/route handler function, which means you can compose it with other handlers.

For example, let's assume you want to add some analytics and apply some rate limit to the proxy handler:

import { route } from "@fal-ai/serverless-proxy/nextjs";
 
// Let's add some custom logic to POST requests - i.e. when the request is
// submitted for processing
export const POST = (req) => {
  // Add some analytics
  analytics.track("fal.ai request", {
    targetUrl: req.headers["x-fal-target-url"],
    userId: req.user.id,
  });
 
  // Apply some rate limit
  if (rateLimiter.shouldLimit(req)) {
    res.status(429).json({ error: "Too many requests" });
  }
 
  // If everything passed your custom logic, now execute the proxy handler
  return route.POST(req);
};
 
// For GET requests we will just use the built-in proxy handler
// But you could also add some custom logic here if you need
export const GET = route.GET;

Note that the URL that will be forwarded to server is available as a header named x-fal-target-url. Also, keep in mind the example above is just an example, rateLimiter and analytics are just placeholders.

The example above used the app router, but the same logic can be applied to the page router and its handler function.

3. Configure the client
On your main file (i.e. src/pages/_app.jsx or src/app/page.jsx), configure the client to use the proxy:

import * as fal from "@fal-ai/serverless-client";
 
fal.config({
  proxyUrl: "/api/fal/proxy",
});

Protect your API Key
Although the client can be configured with credentials, use that only for rapid prototyping. We recommend you always use the proxy to avoid exposing your API Key in the client before you deploy your web application. See the server-side guide for more details.

4. Generate an image
Now that the client is configured, you can generate an image using fal.subscribe and pass the model id and the input parameters:

const result = await fal.subscribe("110602490-lora", {
  input: {
    prompt,
    model_name: "stabilityai/stable-diffusion-xl-base-1.0",
    image_size: "square_hd",
  },
  pollInterval: 5000,
  logs: true,
  onQueueUpdate(update) {
    console.log("queue update", update);
  },
});
 
const imageUrl = result.images[0].url;

See more about SD with LoRA used in this example on fal.ai/models/sd-loras

What's next?
Image generation is just one of the many cool things you can do with fal. Make sure you:

Check our demo application at github.com/fal-ai/serverless-js/apps/demo-nextjs-app-router
Check all the available Model APIs
Learn how to write your own model APIs on Introduction to serverless functions
Read more about function endpoints on Serving functions
Check the next page to learn how to deploy your app to Vercel
