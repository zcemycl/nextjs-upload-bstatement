## NextJS Upload Bank Statement App

| Upload Page                          | History Page                          |
| ------------------------------------ | ------------------------------------- |
| ![](resources/bstatement-upload.png) | ![](resources/bstatement-history.png) |

### How to run?

1. Copy sample env file.
   ```
   cp .env.sample .env
   ```
2. Edit `.env` file with your Anthropic API KEY.
   ```
   ANTHROPIC_API_KEY=<please-use-your-key-here>
   ```
3. Run with docker compose.
   ```
   docker compose up
   ```
4. Test the app at `localhost:3000` with the PDF `Bank Statement Example Final.pdf` in the `resources` folder.
