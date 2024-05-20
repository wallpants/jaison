# Jaison

Convert Audio to meaningful JSON.

This project is a proof of concept.

## Workflow

1. Define _extractors_, which basically means specifying JSON columns
   and prompts to fill those columns with.
2. Upload an audio file and choose an _extractor_.
3. Receive JSON at your webhook of choice. (not implemented)

## Behind the Scenes

Behind the scenes, whenever an audio is uploaded, it's getting sent to the [speech-to-text
service from rev.ai](https://www.rev.ai/).

Once we get the transcription back, we generate a prompt that includes the
information the user specified in the _extractor_, the _complete transcript_,
and [_custom instructions_](/app/routes/extractor-jobs.webhook/generate-prompt.ts)
for GPT to generate the response we need in the correct format.

Once we get a response from GPT, we run some validations on it, and if validations
fail, we re-submit the prompt for a total of 5 max attempts until we get a valid
response or give up.

## [🏗️ Development](/docs/development.md)

## [🚀 Deploy](/docs/deploy.md)

## [⚙️ CI/CD](/docs/ci-cd.md)
