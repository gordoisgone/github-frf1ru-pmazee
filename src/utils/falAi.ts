import * as fal from "@fal-ai/serverless-client";
import axios from "axios";

fal.config({
  credentials: "0a658b6a-905f-439b-a16d-b87fd3d83f29:f9677d854161cc2dce2a5d8690c834f7",
});

const OPENAI_API_KEY = "sk-svcacct-g3Hv7gI2ydLBx8sAxSEa0VV6svwLxx_XKii9PPb6a63EsMH3OXJfMCGQVT3BlbkFJLFWd-TH0HHkEYYkw-JAtD8YRGEIEA44FnihsfoVAEu4fTBXS68Wa8jnugA";

interface ImageResult {
  images: { url: string }[];
}

interface VideoResult {
  video: { url: string };
}

async function embellishPrompt(prompt: string): Promise<string> {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    },
    {
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
}

export async function generateImages(prompt: string): Promise<string[]> {
  console.log("generateImages function called with prompt:", prompt);
  try {
    console.log("Attempting to embellish prompt...");
    const embellishedPrompt = await embellishPrompt(prompt);
    console.log("Embellished prompt:", embellishedPrompt);

    console.log("Calling fal.subscribe...");
    const result = await fal.subscribe("fal-ai/realistic-vision", {
      input: {
        loras: [
          {
            path: "https://civitai.com/api/download/models/62833?type=Model&format=SafeTensor",
            scale: 1
          }
        ],
        format: "png",
        prompt: embellishedPrompt,
        embeddings: [],
        image_size: "landscape_16_9",
        model_name: "SG161222/Realistic_Vision_V6.0_B1_noVAE",
        num_images: 8,
        expand_prompt: true,
        guidance_scale: 5,
        negative_prompt: "nsfw, (deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime), camera, text, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, UnrealisticDream",
        num_inference_steps: 35,
        enable_safety_checker: true,
        safety_checker_version: "v1"
      },
      logs: true,
      onQueueUpdate: (status) => {
        console.log("Queue status:", status);
      },
    }) as ImageResult;

    console.log("fal.subscribe completed. Result:", JSON.stringify(result, null, 2));

    if (result && 'images' in result && Array.isArray(result.images)) {
      const imageUrls = result.images.map(image => image.url);
      console.log("Generated image URLs:", imageUrls);
      
      // Verify that the URLs are valid
      const validUrls = await Promise.all(imageUrls.map(async (url) => {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          return response.ok ? url : null;
        } catch (error) {
          console.error(`Error verifying URL ${url}:`, error);
          return null;
        }
      }));
      
      const filteredUrls = validUrls.filter((url): url is string => url !== null);
      console.log("Filtered valid image URLs:", filteredUrls);
      
      if (filteredUrls.length === 0) {
        console.error('No valid image URLs found');
        return [];
      }
      
      return filteredUrls;
    } else {
      console.error('Unexpected result format:', JSON.stringify(result, null, 2));
      return [];
    }
  } catch (error) {
    console.error('Error generating images:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return [];
  }
}

// Add this function to test the API connection
export async function testFalConnection(): Promise<void> {
  console.log("Testing FAL AI connection...");
  try {
    const result = await fal.subscribe("fal-ai/realistic-vision", {
      input: {
        prompt: "Test prompt",
        num_images: 1,
      },
    });
    console.log("FAL AI connection test result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("FAL AI connection test failed:", error);
  }
}

export async function generateVideo(prompt: string, imageUrl: string): Promise<string> {
  const embellishedPrompt = await embellishPrompt(prompt);
  try {
    const result = await fal.subscribe("fal-ai/runway-gen3/turbo/image-to-video", {
      input: {
        prompt: embellishedPrompt,
        image_url: imageUrl
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && update.logs) {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    }) as VideoResult;

    if (result && 'video' in result && 'url' in result.video) {
      return result.video.url;
    } else {
      throw new Error('Unexpected video result format');
    }
  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
}
