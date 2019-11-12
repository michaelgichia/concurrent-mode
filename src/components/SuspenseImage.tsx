// Modified from github.com/relayjs/relay-examples/blob/master/issue-tracker/src/SuspenseImage.js

import React from "react";
import { createResource } from "../experimental-simple-cache/cache";

export const preloadImage = src => {
  const resource = createResource(src, () => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        resolve(src);
      };
      img.onerror = error => {
        console.error(error);
        resolve(src);
      };
      img.src = src;
    });
  });
  return resource;
};

export const loadImage = src => {
  preloadImage(src).read(); // suspends while the image is pending
};

export default function SuspenseImage(props) {
  const { src } = props;
  if (src != null) {
    loadImage(src);
  }
  return <img alt={props.alt} {...props} />;
}
