import express from 'express';
import * as dotenv from 'dotenv';
import Replicate from "replicate";


dotenv.config();

const router = express.Router();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E!' });
});

router.route('/').post(async (req, res) => {
  try {
    const prompt  = req.body.prompt;
    const  nPrompt = req.body.nprompt;
    console.log(prompt)
    console.log(nPrompt)
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          width: 1024,
          height: 1024,
          prompt: prompt,
          refine: "expert_ensemble_refiner",
          scheduler: "K_EULER",
          lora_scale: 0.6,
          num_outputs: 1,
          guidance_scale: 7.5,
          apply_watermark: false,
          high_noise_frac: 0.8,
          negative_prompt: nPrompt,
          prompt_strength: 0.8,
          num_inference_steps: 25
        }
      }
    );
    res.status(200).json({ photo: output[0]});
  } catch (error) {
    console.error(error);
    res.status(500).send(error?.response.data.error.message || 'Something went wrong');
  }
});

export default router;



