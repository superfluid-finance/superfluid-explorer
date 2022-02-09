import { FC, useEffect, useState } from "react";
import {
  Icon,
  IconButton,
  SvgIcon,
  SvgIconProps,
  Tooltip,
  TooltipProps,
} from "@mui/material";
import _ from "lodash";
import LinkIcon from "@mui/icons-material/Link";
import { useRouter } from "next/router";

/**
 * Inspired by: https://blog.logrocket.com/implementing-copy-to-clipboard-in-react-with-clipboard-api/
 */
const CopyLink: FC<{
  localPath: string;
  TooltipProps?: Partial<TooltipProps>;
  IconProps?: Partial<SvgIconProps>;
}> = ({ localPath, TooltipProps, IconProps }) => {
  const [absoluteUrl, setAbsoluteUrl] = useState<string>("");

  useEffect(() => {
    setAbsoluteUrl(new URL(localPath, document.baseURI).href);
  }, []);

  const [isCopied, setIsCopied] = useState(false);

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(absoluteUrl)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <IconButton>
      <Tooltip
        {..._.merge(
          {
            title: isCopied ? "Link copied!" : "Copy link to clipboard",
          },
          TooltipProps
        )}
      >
        <LinkIcon
          onClick={handleCopyClick}
          {..._.merge(IconProps)}
        />
      </Tooltip>
    </IconButton>
  );
};

export default CopyLink;

async function copyTextToClipboard(text: string) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}
