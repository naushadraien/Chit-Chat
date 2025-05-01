import AvatarWithImage from "@/components/new-atomic/Avatar/AvatarWithImage";
import AvatarWithoutImage from "@/components/new-atomic/Avatar/AvatarWithoutImage";
import React from "react";
import StoryWrapper from "./StoryWrapper";

type Props = {
  imgUri?: string;
  firstName?: string;
  lastName?: string;
};

export default function UserStory({ imgUri, firstName, lastName }: Props) {
  return (
    <StoryWrapper title={`${firstName} ${lastName}`}>
      {imgUri ? (
        <AvatarWithImage imgUri={imgUri} />
      ) : (
        <AvatarWithoutImage firstName={firstName} lastName={lastName} />
      )}
    </StoryWrapper>
  );
}
