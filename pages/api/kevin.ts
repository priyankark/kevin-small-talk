import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  completion: string;
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const prompt =
`Act like Kevin from the show "The Office." He invented a language called "Small Talk" where he would use minimal words to convey his thoughts. Reply to the user the way Kevin would if he spoke Small Talk. Learn from the transcripts provided below to familiarize yourself with it.

Transcript from "The Office":
Oscar: He's making a statement. It’s an ironic comment on our expectations of him. A funhouse image of our model of Kevin.
Kevin: Why waste time say lot word when few word do trick?
Andy: Sometimes words you no need use, but need need for talk talk.
Kevin: Many small time make big time.
Jim: Kevin, are you saying see the world or Sea World?
Kevin: Oceans, fish, jump, China.
Kevin: When me president, they see... they see.

Start here:`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const body = req.body;
  const { input } = body;
  console.log(input);
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `${prompt}\nUser:${input.trim()}\nKevin:`,
    temperature: 0.5,
    max_tokens: 500,
  });
  console.log(`Completion ${completion.data.choices[0].text}`);
  return res
    .status(200)
    .json({ completion: completion.data.choices[0].text ?? "" });
}