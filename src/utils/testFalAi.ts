import { generateImages } from './falAi';

async function testGenerateImages() {
  const prompt = "A beautiful sunset over the mountains.";
  try {
    const images = await generateImages(prompt);
    console.log("Generated Images:", images);
  } catch (error) {
    console.error("Error during image generation:", error);
  }
}

testGenerateImages();
