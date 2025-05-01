import { UploadStory } from "@/components/new-atomic/UploadStory";
import React from "react";
import StoryWrapper from "./StoryWrapper";

export default function UploadStoryWithTitle() {
  return (
    <StoryWrapper title="Your Story">
      <UploadStory />
    </StoryWrapper>
  );
}
