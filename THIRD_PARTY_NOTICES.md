# Open-source AI acknowledgments

SupportLab's free AI coach uses:

- **WebLLM 0.2.85** by the MLC AI contributors. Apache License 2.0. Source: https://github.com/mlc-ai/web-llm. Runtime license: `vendor/WebLLM-LICENSE.txt`. **loglevel 1.9.2** is bundled under its MIT license, supplied as `vendor/loglevel-LICENSE.txt`.
- **Qwen2.5-1.5B-Instruct** by the Qwen team, Alibaba Cloud. Apache License 2.0. Original model and license: https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct.
- **MLC quantized model artifacts**: https://huggingface.co/mlc-ai/Qwen2.5-1.5B-Instruct-q4f16_1-MLC and the corresponding q4f32 variant. WebGPU model libraries are hosted by https://github.com/mlc-ai/binary-mlc-llm-libs.

Model weights and WebGPU libraries are downloaded by the browser only after the learner chooses **Load free AI**. They are not included in the source ZIP. No hosted model inference service or OpenAI API is used. Third-party model hosts receive ordinary file-download requests; coaching prompts remain on the learner's device.

The smaller local model can produce incorrect or incomplete guidance. Training scores and case outcomes remain controlled by SupportLab's exercises.
