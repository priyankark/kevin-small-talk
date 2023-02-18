import React from "react";
import {
  Stack,
  HStack,
  Box,
  VStack,
  Input,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import Router from "next/router";

export interface IConversation {
  kevin: string;
  you: string;
}

export const Chat = () => {
  const [inputText, setInputText] = React.useState("");
  const [chatList, setChatList] = React.useState<IConversation[]>([]);
  const { isLoading, error, data, refetch } = useQuery(
    "repoData",
    () =>
      fetch("/api/kevin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: `${inputText}`,
        }),
      }),
    {
      enabled: false,
      onSuccess: async (data) => {
        const jsonData = await data.json();
        console.log(`JSONData`, jsonData);
        setChatList([
          ...chatList,
          {
            you: inputText,
            kevin: jsonData.completion,
          },
        ]);
        setInputText("");
      },
    }
  );
  return (
    <VStack alignContent={"space-between"}>
      <Stack style={{ height: "80vh" }} overflowY={'auto'} maxHeight={'90vh'}>
        {chatList.map((ele) => (
          <Box key={Symbol().toString()} gap={5}>
            <Box>{`You: ${ele.you}`}</Box>
            <Box>{`Kevin: ${ele.kevin}`}</Box>
          </Box>
        ))}
      </Stack>

      <HStack spacing={3} justifySelf={"end"} width={"100%"}>
        <Box width={"90%"}>
          <Textarea
            placeholder="Ask me!"
            size="md"
            onChange={(ev) => setInputText(ev.target.value)}
            value={inputText}
          />
        </Box>
        <Box>
          <Button colorScheme="teal" size="lg" onClick={() => refetch()}>
            Send
          </Button>
        </Box>
      </HStack>
    </VStack>
  );
};

export default Chat;