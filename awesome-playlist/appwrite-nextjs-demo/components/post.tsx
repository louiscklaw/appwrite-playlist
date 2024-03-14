import { Box, Flex, Grid, GridItem, Image, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { IPost } from "./types";
import useAppwrite from "../hooks/appwrite/useAppwrite";

export default function Post(props: {
  post: IPost;
  getImage: (fileId: string) => URL;
  fetchPosts: any;
}) {
  const { post, fetchPosts } = props;
  const [account, collection, bucket] = useAppwrite();

  const formattedDate = useMemo(
    () =>
      new Date(post.$createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "2-digit",
      }),
    [post]
  );

  const imageUrl = useMemo(() => props.getImage(post.image), [post]);

  const handleDeleteClick = async () => {
    try {
      await collection.remove(post.$id);
      console.log("delete done");
      fetchPosts();
    } catch (error) {
      console.log(["delete error"]);
    }
  };

  const handleUpdateClick = async () => {
    await collection.update(post.$id, { content: " updated " + post.content });
    fetchPosts();
  };

  return (
    <Grid
      w={300}
      h={"min-content"}
      templateAreas={`
    "content content content"
    "author spacer date"
    `}
      gridTemplateColumns="1fr 1fr 0.6fr"
      p={2}
      shadow="md"
      borderWidth="1px"
      borderRadius="5%"
    >
      <GridItem area={"content"}>
        <Flex direction={"column"}>
          <Image
            w={300}
            h={300}
            objectFit={"cover"}
            objectPosition={"center"}
            src={imageUrl.toString()}
          />
          <Text>{post.content}</Text>
        </Flex>
      </GridItem>
      <GridItem area={"author"}>
        <Text fontSize={"xs"}>{post.author}</Text>
      </GridItem>
      <GridItem area={"spacer"} />
      <GridItem area={"date"}>
        <Text fontSize={"xs"}>{formattedDate}</Text>
      </GridItem>
      <button onClick={handleDeleteClick}>Delete</button>
      <button onClick={handleUpdateClick}>Update</button>
    </Grid>
  );
}
